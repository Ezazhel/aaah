"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/route_requires";
import { membershipStartSchema, type MembershipStartInput } from "./schema";

export type MemberActionResult = { error: string } | undefined;

const NOT_ADMIN = { error: "Vous devez être administrateur·ice pour gérer les membres." };
const userIdSchema = z.uuid();

const revalidate = () => {
    revalidatePath('/admin', 'layout');
    revalidatePath('/authors', 'layout');
    revalidatePath('/games', 'layout');
}

/**
 * Gives the admin role. It can only be removed in the database.
 */
export const promoteToAdmin = async (userId: string): Promise<MemberActionResult> => {
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

/** Roles an admin can give and remove from the UI. The admin role is removed in the database only. */
const toggleableRoleSchema = z.enum(['author', 'location_manager']);

/**
 * Gives or removes the author / stock manager role.
 */
export const setRole = async (userId: string, role: 'author' | 'location_manager', enabled: boolean): Promise<MemberActionResult> => {
    if(!(await isAdmin())){
        return NOT_ADMIN;
    }
    const parsedUser = userIdSchema.safeParse(userId);
    const parsedRole = toggleableRoleSchema.safeParse(role);
    if(!parsedUser.success || !parsedRole.success){
        return { error: "Utilisateur·ice ou rôle inconnu" };
    }

    const supabase = await createClient();
    const { error } = enabled
        ? await supabase.from('user_roles').insert({ user_id: parsedUser.data, role: parsedRole.data })
        : await supabase.from('user_roles').delete().eq('user_id', parsedUser.data).eq('role', parsedRole.data);

    // 23505: the member already has this role.
    if(error && error.code !== '23505'){
        console.log(error);
        return { error: "Le rôle n'a pas pu être modifié. Réessayez." };
    }

    revalidate();
}

/**
 * Enables (end of the current period) or disables (end of the previous period) a membership.
 * The dates are computed by admin_set_membership() from the membership settings.
 */
export const setMembership = async (userId: string, active: boolean): Promise<MemberActionResult> => {
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
export const updateMembershipStart = async (payload: MembershipStartInput): Promise<MemberActionResult> => {
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
