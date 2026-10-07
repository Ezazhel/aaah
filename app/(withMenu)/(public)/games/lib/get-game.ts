import { createClient } from "@/lib/supabase/server"

export const GetGame = async (slug:string) => {
    const supabase = await createClient();

    const {data, error} = await supabase
        .from('games')
        .select('*, authors:game_authors(author:authors(id, first_name, last_name, slug, description, avatar_updated_at, member_ship_expired_at)), category:categories(id, name, color), mechanics:game_mechanics(mechanic:mechanics(id, name, status))')
        .eq('slug', slug)
        .maybeSingle();

    if(error){
        throw new Error(error.message);
    }
    return data;
}

export type Game = NonNullable<Awaited<ReturnType<typeof GetGame>>>;

/**
 * True if the logged-in user is one of the authors of the game.
 */
export const IsGameAuthor = async (game: Game) => {
    const supabase = await createClient();
    const {data} = await supabase.auth.getClaims();
    const userId = data?.claims.sub;

    if(!userId){
        return false;
    }
    return game.authors.some(({author}) => author.id === userId);
}

/**
 * Latest admin decision on the game (null if none, or if the user cannot read it:
 * reviews are only visible to admins and to the authors of the game).
 */
export const GetLastReview = async (gameId: string) => {
    const supabase = await createClient();
    const {data} = await supabase
        .from('game_reviews')
        .select('decision, reason, created_at')
        .eq('game_id', gameId)
        .order('created_at', {ascending: false})
        .limit(1)
        .maybeSingle();

    return data;
}
