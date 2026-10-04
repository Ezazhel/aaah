"use server"

import { createClient } from "@/lib/supabase/server"
import { gameSchema, type GameInput } from "./schema"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type GameActionResult = { error: string} | undefined;

export const createGame = async (payload: GameInput): Promise<GameActionResult> => {

    const parsed = gameSchema.safeParse(payload);

    if(!parsed.success){
        return {error: "Vérifiez les informations saisies"};
    }

    const supabase = await createClient();

    const {data:auth} = await supabase.auth.getClaims();

    if(!auth?.claims){
        redirect('/auth/login');
    }

    const {data: game, error} = await supabase.from("games").insert(parsed.data).select('slug').single();

    if(error) {
        console.log(error);

        return { error : "Le jeu n'a pas pu être créé. Réessayez ou contactez un administrateur"}
    }

    revalidatePath('/games');
    redirect(`/games/${game.slug}`)
}

export const updateGame = async (id: string, payload: GameInput): Promise<GameActionResult> => {

    const parsed = gameSchema.safeParse(payload);

    if(!parsed.success){
        return {error: "Vérifiez les informations saisies"};
    }

    const supabase = await createClient();

    const {data:auth} = await supabase.auth.getClaims();

    if(!auth?.claims){
        redirect('/auth/login');
    }

    // RLS only lets the authors of the game update it: no row returned means not allowed.
    // The slug is rebuilt by a trigger if the name changed.
    // A rejected game goes back to pending (trigger protect_game_status): it is resubmitted.
    const {data: game, error} = await supabase.from("games").update(parsed.data).eq('id', id).select('slug').maybeSingle();

    if(error || !game) {
        console.log(error);

        return { error : "Le jeu n'a pas pu être modifié. Réessayez ou contactez un administrateur"}
    }

    revalidatePath('/games', 'layout');
    // Status may have changed: profile list and admin validation badge.
    revalidatePath('/account');
    revalidatePath('/admin', 'layout');
    redirect(`/games/${game.slug}`)
}
