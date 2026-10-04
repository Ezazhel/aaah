"use server"

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/route_requires";
import { reviewSchema, type ReviewInput } from "./schema";

export type ReviewActionResult = { error: string } | undefined;

/**
 * Approves or rejects a game. The game_reviews trigger updates the status of the game.
 */
export const reviewGame = async (payload: ReviewInput): Promise<ReviewActionResult> => {
    // A server action is a public endpoint: check the role here too (the RLS policy also does).
    if(!(await isAdmin())){
        return { error: "Vous devez être administrateur·ice pour valider un jeu." };
    }

    const parsed = reviewSchema.safeParse(payload);
    if(!parsed.success){
        return { error: "Vérifiez les informations saisies" };
    }

    const supabase = await createClient();
    const { gameId, decision } = parsed.data;
    const reason = parsed.data.decision === 'rejected' ? parsed.data.reason : null;

    const { error } = await supabase.from('game_reviews').insert({ game_id: gameId, decision, reason });

    if(error){
        console.log(error);
        return { error: "La décision n'a pas pu être enregistrée. Réessayez." };
    }

    revalidatePath('/admin', 'layout');
    revalidatePath('/games', 'layout');
}
