"use server"

import { createClient } from "@/lib/supabase/server"
import { gameSchema, mechanicNameSchema, type GameInput } from "./schema"
import { isActiveMember } from "@/lib/route_requires";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { notifyAdmins } from "@/lib/email/notify-admins";

type Supabase = Awaited<ReturnType<typeof createClient>>;

// "Prénom Nom" of the logged-in author, for the admin notifications.
const authorName = async (supabase: Supabase, userId: string) => {
    const {data} = await supabase.from('authors').select('first_name, last_name').eq('id', userId).maybeSingle();
    return [data?.first_name, data?.last_name].filter(Boolean).join(' ') || "Un·e membre";
}

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

    notifyAdmins({
        subject: `Nouveau jeu à valider : ${fields.name}`,
        title: "Nouveau jeu à valider",
        paragraphs: [`${await authorName(supabase, auth.claims.sub)} a ajouté le jeu « ${fields.name} ». Il attend une validation avant d'être publié.`],
        path: '/admin/validation',
    });

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
    // Read before the update: the trigger turns a rejected game into a pending one.
    const {data: before} = await supabase.from("games").select('status').eq('id', id).maybeSingle();
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

    if(before?.status === 'rejected'){
        notifyAdmins({
            subject: `Jeu corrigé à revalider : ${fields.name}`,
            title: "Jeu corrigé à revalider",
            paragraphs: [`${await authorName(supabase, auth.claims.sub)} a modifié le jeu refusé « ${fields.name} ». Il attend une nouvelle validation.`],
            path: '/admin/validation',
        });
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

    if(data.status === 'pending'){
        const {data: auth} = await supabase.auth.getClaims();
        notifyAdmins({
            subject: `Mécanique proposée : ${data.name}`,
            title: "Mécanique à valider",
            paragraphs: [`${auth?.claims ? await authorName(supabase, auth.claims.sub) : "Un·e membre"} propose la mécanique « ${data.name} ».`],
            path: '/admin/tags',
        });
    }

    revalidatePath('/admin', 'layout');
    return { mechanic: data };
}
