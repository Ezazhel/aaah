"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/route_requires";
import { categorySchema, mechanicNameSchema, type CategoryInput } from "./schema";

export type TagActionResult = { error: string } | undefined;

const NOT_ADMIN = { error: "Vous devez être administrateur·ice pour gérer les tags." };
const idSchema = z.number().int().positive();

const DUPLICATE = '23505';

const revalidate = () => {
    revalidatePath('/admin', 'layout');
    revalidatePath('/games', 'layout');
    revalidatePath('/', 'layout');
}

// Every action checks the role first: a server action is a public endpoint (RLS checks it too).
const run = async (
    validate: () => boolean,
    query: (supabase: Awaited<ReturnType<typeof createClient>>) => PromiseLike<{ error: { code: string } | null }>,
    duplicateMessage = "Ce nom existe déjà.",
): Promise<TagActionResult> => {
    if(!(await isAdmin())){
        return NOT_ADMIN;
    }
    if(!validate()){
        return { error: "Vérifiez les informations saisies." };
    }

    const supabase = await createClient();
    const { error } = await query(supabase);
    if(error){
        console.log(error);
        return { error: error.code === DUPLICATE ? duplicateMessage : "L'enregistrement a échoué. Réessayez." };
    }

    revalidate();
}

// ---------------------------------------------------------
// Mechanics
// ---------------------------------------------------------

/**
 * Approves a suggested mechanic, with its name possibly fixed (typo).
 */
export const approveMechanic = async (id: number, name: string) => {
    const parsed = mechanicNameSchema.safeParse(name);
    return run(
        () => idSchema.safeParse(id).success && parsed.success,
        (supabase) => supabase.from('mechanics').update({ name: parsed.data!, status: 'approved' }).eq('id', id),
        "Une mécanique porte déjà ce nom : refusez la proposition, ou renommez-la.",
    );
}

/**
 * Rejecting deletes the mechanic: it is removed from the games that used it.
 */
export const deleteMechanic = async (id: number) =>
    run(
        () => idSchema.safeParse(id).success,
        (supabase) => supabase.from('mechanics').delete().eq('id', id),
    );

export const renameMechanic = async (id: number, name: string) => {
    const parsed = mechanicNameSchema.safeParse(name);
    return run(
        () => idSchema.safeParse(id).success && parsed.success,
        (supabase) => supabase.from('mechanics').update({ name: parsed.data! }).eq('id', id),
    );
}

export const createMechanic = async (name: string) => {
    const parsed = mechanicNameSchema.safeParse(name);
    return run(
        () => parsed.success,
        (supabase) => supabase.from('mechanics').insert({ name: parsed.data!, status: 'approved', suggested_by: null }),
    );
}

// ---------------------------------------------------------
// Categories
// ---------------------------------------------------------

export const createCategory = async (payload: CategoryInput) => {
    const parsed = categorySchema.safeParse(payload);
    return run(
        () => parsed.success,
        async (supabase) => {
            // New categories go last.
            const { data: last } = await supabase.from('categories').select('position').order('position', { ascending: false }).limit(1).maybeSingle();
            return supabase.from('categories').insert({ ...parsed.data!, position: (last?.position ?? 0) + 1 });
        },
    );
}

export const updateCategory = async (id: number, payload: CategoryInput) => {
    const parsed = categorySchema.safeParse(payload);
    return run(
        () => idSchema.safeParse(id).success && parsed.success,
        (supabase) => supabase.from('categories').update(parsed.data!).eq('id', id),
    );
}

/**
 * The games of this category lose their category (on delete set null).
 */
export const deleteCategory = async (id: number) =>
    run(
        () => idSchema.safeParse(id).success,
        (supabase) => supabase.from('categories').delete().eq('id', id),
    );
