"use server"

import { createClient } from "@/lib/supabase/server"
import { gameSchema, mechanicNameSchema, type GameInput } from "./schema"
import { isActiveMember } from "@/lib/route_requires";
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

    const { mechanic_ids, ...fields } = parsed.data;
    const {data: game, error} = await supabase.from("games").insert(fields).select('id, slug').single();

    if(error) {
        console.log(error);

        return { error : "Le jeu n'a pas pu être créé. Réessayez ou contactez un administrateur"}
    }

    // The creator is already an author (trigger), so the game_mechanics policy lets them add mechanics.
    const {error: mechanicsError} = await supabase.rpc('set_game_mechanics', { game: game.id, mechanic_ids });
    if(mechanicsError){
        console.log(mechanicsError);
        return { error: "Le jeu a été créé mais ses mécaniques n'ont pas pu être enregistrées. Modifiez-le pour réessayer." };
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
    const { mechanic_ids, ...fields } = parsed.data;
    const {data: game, error} = await supabase.from("games").update(fields).eq('id', id).select('slug').maybeSingle();

    if(error || !game) {
        console.log(error);

        return { error : "Le jeu n'a pas pu être modifié. Réessayez ou contactez un administrateur"}
    }

    const {error: mechanicsError} = await supabase.rpc('set_game_mechanics', { game: id, mechanic_ids });
    if(mechanicsError){
        console.log(mechanicsError);
        return { error: "Les mécaniques n'ont pas pu être enregistrées. Réessayez." };
    }

    revalidatePath('/games', 'layout');
    // Status may have changed: profile list and admin validation badge.
    revalidatePath('/account');
    revalidatePath('/admin', 'layout');
    redirect(`/games/${game.slug}`)
}

export type SuggestMechanicResult = { error: string } | { mechanic: { id: number; name: string; status: 'pending' | 'approved' } };

/**
 * Suggests a new mechanic (pending until an admin approves it).
 * If it already exists and is visible, returns it so it can be picked.
 */
export const suggestMechanic = async (name: string): Promise<SuggestMechanicResult> => {
    const parsed = mechanicNameSchema.safeParse(name);
    if(!parsed.success){
        return { error: parsed.error.issues[0].message };
    }
    if(!(await isActiveMember())){
        return { error: "Votre adhésion doit être active pour proposer une mécanique." };
    }

    const supabase = await createClient();
    const {data, error} = await supabase.from('mechanics').insert({ name: parsed.data }).select('id, name, status').single();

    if(error?.code === '23505'){
        const {data: existing} = await supabase.from('mechanics').select('id, name, status').ilike('name', parsed.data.replace(/[%_\\]/g, '\\$&')).maybeSingle();
        return existing ? { mechanic: existing } : { error: "Cette mécanique a déjà été proposée et attend la validation d'un administrateur." };
    }
    if(error || !data){
        console.log(error);
        return { error: "La mécanique n'a pas pu être proposée. Réessayez." };
    }

    revalidatePath('/admin', 'layout');
    return { mechanic: data };
}
