"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { hasRole } from "@/lib/route_requires";
import { inventoryErrorMessage } from "@/app/model/inventory";
import { notifyLoanEvent } from "@/lib/email/inventory";

export type FormState = { error: string } | { success: string } | undefined;
export type ActionResult = { error: string } | undefined;

const NOT_MANAGER = { error: "Vous devez avoir le rôle « gestion de stock »." };

const optionalText = (max: number) => z.string().trim().max(max).optional().transform((value) => value || null);

const locationSchema = z.object({
    name: z.string().trim().min(1).max(120),
    address: optionalText(300),
    description: optionalText(2000),
});

const itemSchema = z.object({
    location_id: z.uuid(),
    name: z.string().trim().min(1).max(120),
    category: optionalText(60),
    description: optionalText(2000),
    quantity: z.coerce.number().int().min(0).max(100_000),
});

const stockSchema = z.object({
    location_id: z.uuid(),
    item_id: z.uuid(),
    quantity: z.coerce.number().int().min(0).max(100_000),
});

const field = (formData: FormData, name: string) => formData.get(name) ?? undefined;

const revalidate = () => {
    revalidatePath('/stock');
    revalidatePath('/inventory');
    revalidatePath('/admin/inventory');
}

const userId = async (supabase: Awaited<ReturnType<typeof createClient>>) => {
    const { data } = await supabase.auth.getClaims();
    return data?.claims?.sub ?? null;
}

/**
 * Creates a place managed by the user (one manager per place). No admin validation.
 */
export async function createLocation(_prev: FormState, formData: FormData): Promise<FormState> {
    if(!(await hasRole('location_manager'))){
        return NOT_MANAGER;
    }
    const parsed = locationSchema.safeParse({ name: field(formData, 'name'), address: field(formData, 'address'), description: field(formData, 'description') });
    if(!parsed.success){
        return { error: "Le nom du lieu est obligatoire." };
    }
    const supabase = await createClient();
    const manager_id = await userId(supabase);
    if(!manager_id){
        return NOT_MANAGER;
    }
    const { error } = await supabase.from('inventory_locations').insert({ ...parsed.data, manager_id });
    if(error){
        console.log(error);
        return { error: "Le lieu n'a pas pu être créé. Réessayez." };
    }
    revalidate();
    return { success: `Lieu « ${parsed.data.name} » créé.` };
}

/**
 * Adds a new item to the shared catalog and sets its quantity in a place.
 */
export async function createItem(_prev: FormState, formData: FormData): Promise<FormState> {
    if(!(await hasRole('location_manager'))){
        return NOT_MANAGER;
    }
    const parsed = itemSchema.safeParse({
        location_id: field(formData, 'location_id'),
        name: field(formData, 'name'),
        category: field(formData, 'category'),
        description: field(formData, 'description'),
        quantity: field(formData, 'quantity'),
    });
    if(!parsed.success){
        return { error: "Vérifiez le nom de l'article et la quantité." };
    }
    const { location_id, quantity, ...item } = parsed.data;
    const supabase = await createClient();
    const created_by = await userId(supabase);
    if(!created_by){
        return NOT_MANAGER;
    }
    const { data, error } = await supabase.from('inventory_items').insert({ ...item, created_by }).select('id').single();
    if(error){
        console.log(error);
        return { error: "L'article n'a pas pu être ajouté. Réessayez." };
    }
    const { error: stockError } = await supabase.rpc('inventory_set_stock', { p_location: location_id, p_item: data.id, p_quantity: quantity });
    if(stockError){
        console.log(stockError);
        return { error: inventoryErrorMessage(stockError, "L'article a été ajouté au catalogue, mais sa quantité n'a pas pu être enregistrée.") };
    }
    revalidate();
    return { success: `« ${item.name} » ajouté.` };
}

/**
 * Sets the quantity of an item in a place (adds the item to the place if needed).
 */
export async function setStock(_prev: FormState, formData: FormData): Promise<FormState> {
    const parsed = stockSchema.safeParse({ location_id: field(formData, 'location_id'), item_id: field(formData, 'item_id'), quantity: field(formData, 'quantity') });
    if(!parsed.success){
        return { error: "Quantité invalide." };
    }
    const supabase = await createClient();
    const { error } = await supabase.rpc('inventory_set_stock', { p_location: parsed.data.location_id, p_item: parsed.data.item_id, p_quantity: parsed.data.quantity });
    if(error){
        console.log(error);
        return { error: inventoryErrorMessage(error, "Le stock n'a pas pu être enregistré. Réessayez.") };
    }
    revalidate();
    return { success: "Enregistré." };
}

const loanIdSchema = z.uuid();

/**
 * Accepts (reserves the material) or rejects a loan request.
 */
export async function decideLoan(loanId: string, approve: boolean, note?: string): Promise<ActionResult> {
    const parsed = loanIdSchema.safeParse(loanId);
    const parsedNote = z.string().trim().max(1000).optional().safeParse(note);
    if(!parsed.success || !parsedNote.success){
        return { error: "Demande inconnue" };
    }
    const supabase = await createClient();
    const { error } = await supabase.rpc('inventory_decide_loan', { p_loan: parsed.data, p_approve: approve, p_note: parsedNote.data || undefined });
    if(error){
        console.log(error);
        return { error: inventoryErrorMessage(error, "La décision n'a pas pu être enregistrée. Réessayez.") };
    }
    notifyLoanEvent(parsed.data, approve ? 'approved' : 'rejected');
    revalidate();
}

/**
 * The author picked up the reserved material: the stock goes down.
 */
export async function markBorrowed(loanId: string): Promise<ActionResult> {
    const parsed = loanIdSchema.safeParse(loanId);
    if(!parsed.success){
        return { error: "Prêt inconnu" };
    }
    const supabase = await createClient();
    const { error } = await supabase.rpc('inventory_mark_borrowed', { p_loan: parsed.data });
    if(error){
        console.log(error);
        return { error: inventoryErrorMessage(error, "Le retrait n'a pas pu être enregistré. Réessayez.") };
    }
    revalidate();
}

/**
 * The material came back: the stock goes up.
 */
export async function markReturned(loanId: string): Promise<ActionResult> {
    const parsed = loanIdSchema.safeParse(loanId);
    if(!parsed.success){
        return { error: "Prêt inconnu" };
    }
    const supabase = await createClient();
    const { error } = await supabase.rpc('inventory_mark_returned', { p_loan: parsed.data });
    if(error){
        console.log(error);
        return { error: inventoryErrorMessage(error, "Le retour n'a pas pu être enregistré. Réessayez.") };
    }
    notifyLoanEvent(parsed.data, 'returned');
    revalidate();
}
