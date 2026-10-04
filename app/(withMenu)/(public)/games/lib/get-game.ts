import { createClient } from "@/lib/supabase/server"

export const GetGame = async (slug:string) => {
    const supabase = await createClient();

    const {data, error} = await supabase
        .from('games')
        .select('*, authors:game_authors(author:authors(id, first_name, last_name, slug))')
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
