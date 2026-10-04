"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/route_requires";
import { membershipStartSchema, type MembershipStartInput } from "./schema";

export type AuthorActionResult = { error: string } | undefined;

const NOT_ADMIN = { error: "Vous devez être administrateur·ice pour gérer les auteur·ices." };
const userIdSchema = z.uuid();

const revalidate = () => {
    revalidatePath('/admin', 'layout');
    revalidatePath('/authors', 'layout');
    revalidatePath('/games', 'layout');
}

/**
 * Gives the admin role. It can only be removed in the database.
 */
export const promoteToAdmin = async (userId: string): Promise<AuthorActionResult> => {
    // A server action is a public endpoint: check the role here too (the RLS policy also does).
    if(!(await isAdmin())){
        return NOT_ADMIN;
    }
    const parsed = userIdSchema.safeParse(userId);
    if(!parsed.success){
        return { error: "Utilisateur·ice inconnu·e" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from('user_roles').insert({ user_id: parsed.data, role: 'admin' });

    // 23505: already admin, nothing to do.
    if(error && error.code !== '23505'){
        console.log(error);
        return { error: "Le rôle n'a pas pu être donné. Réessayez." };
    }

    revalidate();
}

/**
 * Enables (end of the current period) or disables (end of the previous period) an author.
 * The dates are computed by admin_set_membership() from the membership settings.
 */
export const setMembership = async (userId: string, active: boolean): Promise<AuthorActionResult> => {
    if(!(await isAdmin())){
        return NOT_ADMIN;
    }
    const parsed = userIdSchema.safeParse(userId);
    if(!parsed.success){
        return { error: "Utilisateur·ice inconnu·e" };
    }

    const supabase = await createClient();
    const { error } = await supabase.rpc('admin_set_membership', { target: parsed.data, active });

    if(error){
        console.log(error);
        if(error.message.includes('own membership')){
            return { error: "Vous ne pouvez pas modifier votre propre adhésion." };
        }
        if(error.message.includes('Admins are always active')){
            return { error: "Les admins sont toujours actif·ves : retirez d'abord le rôle en base." };
        }
        return { error: "L'adhésion n'a pas pu être modifiée. Réessayez." };
    }

    revalidate();
}

/**
 * Changes the start date of the membership period (day and month).
 */
export const updateMembershipStart = async (payload: MembershipStartInput): Promise<AuthorActionResult> => {
    if(!(await isAdmin())){
        return NOT_ADMIN;
    }
    const parsed = membershipStartSchema.safeParse(payload);
    if(!parsed.success){
        return { error: "Cette date n'existe pas tous les ans." };
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from('membership_settings')
        .update({ start_month: parsed.data.month, start_day: parsed.data.day, updated_at: new Date().toISOString() })
        .eq('id', true);

    if(error){
        console.log(error);
        return { error: "La date n'a pas pu être enregistrée. Réessayez." };
    }

    revalidate();
}
