"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isActiveAuthor } from "@/lib/route_requires";
import { inventoryErrorMessage } from "@/app/model/inventory";
import { notifyLoanEvent } from "@/lib/email/inventory";

export type BorrowState = { error: string } | { success: string } | undefined;
export type LoanActionResult = { error: string } | undefined;

const NOT_AUTHOR = { error: "Seul·es les auteur·ices à l'adhésion active peuvent emprunter du matériel." };

const borrowSchema = z.object({
    item_id: z.uuid(),
    location_id: z.uuid(),
    quantity: z.coerce.number().int().min(1).max(10_000),
    message: z.string().trim().max(1000).optional(),
    mode: z.enum(['request', 'declare']),
});

const revalidate = () => {
    revalidatePath('/inventory');
    revalidatePath('/stock');
    revalidatePath('/admin/inventory');
}

/**
 * Asks to borrow (the managers accept it) or declares a direct take (stock updated right away).
 */
export async function borrow(_prev: BorrowState, formData: FormData): Promise<BorrowState> {
    if(!(await isActiveAuthor())){
        return NOT_AUTHOR;
    }
    const parsed = borrowSchema.safeParse({
        item_id: formData.get('item_id'),
        location_id: formData.get('location_id'),
        quantity: formData.get('quantity'),
        message: formData.get('message') ?? undefined,
        mode: formData.get('mode'),
    });
    if(!parsed.success){
        return { error: "Vérifiez le lieu et la quantité." };
    }

    const { item_id, location_id, quantity, message, mode } = parsed.data;
    const supabase = await createClient();
    const args = { p_item: item_id, p_location: location_id, p_quantity: quantity, p_message: message || undefined };
    const { data: loanId, error } = mode === 'request'
        ? await supabase.rpc('inventory_request_loan', args)
        : await supabase.rpc('inventory_declare_borrow', args);

    if(error || !loanId){
        console.log(error);
        return { error: error ? inventoryErrorMessage(error, "La demande n'a pas pu être enregistrée. Réessayez.") : "La demande n'a pas pu être enregistrée." };
    }

    notifyLoanEvent(loanId, mode === 'request' ? 'requested' : 'declared');
    revalidate();
    return { success: mode === 'request'
        ? "Demande envoyée : le lieu vous répondra par e-mail."
        : "C'est noté : le lieu est prévenu. Pensez à rendre le matériel." };
}

/**
 * The borrower cancels a request not picked up yet.
 */
export async function cancelLoan(loanId: string): Promise<LoanActionResult> {
    const parsed = z.uuid().safeParse(loanId);
    if(!parsed.success){
        return { error: "Prêt inconnu" };
    }
    const supabase = await createClient();
    const { error } = await supabase.rpc('inventory_cancel_loan', { p_loan: parsed.data });
    if(error){
        console.log(error);
        return { error: inventoryErrorMessage(error, "La demande n'a pas pu être annulée. Réessayez.") };
    }
    revalidate();
}
