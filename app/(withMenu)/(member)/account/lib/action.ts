"use server"

import { createClient } from "@/lib/supabase/server"
import { AVATAR_BUCKET, AVATAR_SIZES, avatarPath, type AvatarSize } from "@/lib/avatar"
import { avatarChangeSchema, profileSchema, type AvatarChange, type ProfileInput } from "./schema"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ProfileActionResult = { error: string } | { success: true };

export const updateProfile = async (payload: ProfileInput, avatarChange: AvatarChange = 'unchanged'): Promise<ProfileActionResult> => {

    const parsed = profileSchema.safeParse(payload);
    const avatar = avatarChangeSchema.safeParse(avatarChange);

    if(!parsed.success || !avatar.success){
        return {error: "Vérifiez les informations saisies"};
    }

    const supabase = await createClient();

    const {data:auth} = await supabase.auth.getClaims();

    if(!auth?.claims){
        redirect('/auth/login');
    }

    const now = new Date().toISOString();
    // Only touched when the picture changed: the date is also the cache-busting version of its URL.
    const avatarUpdatedAt = avatar.data === 'unchanged' ? {} : {avatar_updated_at: avatar.data === 'updated' ? now : null};

    // The authors row is created by a trigger with the auth user: no row returned means it was refused.
    const {data: author, error} = await supabase
        .from('authors')
        .update({...parsed.data, ...avatarUpdatedAt, description: parsed.data.description || null, updated_at: now})
        .eq('id', auth.claims.sub)
        .select('id')
        .maybeSingle();

    if(error || !author){
        console.log(error);

        return {error: "Le profil n'a pas pu être enregistré. Réessayez ou contactez un administrateur"};
    }

    if(avatar.data === 'removed'){
        const sizes = Object.keys(AVATAR_SIZES) as AvatarSize[];
        // The profile no longer points to the files: a failure here only leaves orphans behind.
        const {error: removeError} = await supabase.storage.from(AVATAR_BUCKET).remove(sizes.map(size => avatarPath(author.id, size)));
        if(removeError){
            console.log(removeError);
        }
    }

    // Names appear on author and game pages, and unlock the public pages.
    revalidatePath('/', 'layout');
    return {success: true};
}
