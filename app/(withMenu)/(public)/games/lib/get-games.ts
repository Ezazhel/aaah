import { createClient } from "@/lib/supabase/server"

const GAME_CARD_SELECT = '*, authors:game_authors(author:authors(id, first_name, last_name, slug))';

export const GetGames = async (limit?: number) => {
    const supabase = await createClient();
    let query = supabase.from('games').select(GAME_CARD_SELECT).order('name');
    if(limit){
        query = query.limit(limit);
    }
    const {data, error } = await query;

    if(error){
        throw new Error(error.message);
    }
    return data;
}

export type GameSummary = Awaited<ReturnType<typeof GetGames>>[number];

/**
 * Games the author took part in.
 */
export const GetAuthorGames = async (authorId: string) => {
    const supabase = await createClient();
    const {data: links, error: linksError} = await supabase
        .from('game_authors')
        .select('game_id')
        .eq('author_id', authorId);

    if(linksError){
        throw new Error(linksError.message);
    }

    const {data, error} = await supabase
        .from('games')
        .select(GAME_CARD_SELECT)
        .in('id', links.map(({game_id}) => game_id))
        .order('name');

    if(error){
        throw new Error(error.message);
    }
    return data;
}
