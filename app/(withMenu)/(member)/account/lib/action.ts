"use server"

import { createClient } from "@/lib/supabase/server"
import { profileSchema, type ProfileInput } from "./schema"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ProfileActionResult = { error: string } | { success: true };

export const updateProfile = async (payload: ProfileInput): Promise<ProfileActionResult> => {

    const parsed = profileSchema.safeParse(payload);

    if(!parsed.success){
        return {error: "Vérifiez les informations saisies"};
    }

    const supabase = await createClient();

    const {data:auth} = await supabase.auth.getClaims();

    if(!auth?.claims){
        redirect('/auth/login');
    }

    // The authors row is created by a trigger with the auth user: no row returned means it was refused.
    const {data: author, error} = await supabase
        .from('authors')
        .update({...parsed.data, description: parsed.data.description || null, updated_at: new Date().toISOString()})
        .eq('id', auth.claims.sub)
        .select('id')
        .maybeSingle();

    if(error || !author){
        console.log(error);

        return {error: "Le profil n'a pas pu être enregistré. Réessayez ou contactez un administrateur"};
    }

    // Names appear on author and game pages, and unlock the public pages.
    revalidatePath('/', 'layout');
    return {success: true};
}
