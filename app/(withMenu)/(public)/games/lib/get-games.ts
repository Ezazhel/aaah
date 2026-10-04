import { createClient } from "@/lib/supabase/server"

const GAME_CARD_SELECT = '*, authors:game_authors(author:authors(id, first_name, last_name, slug))';

export const GetGames = async (limit?: number) => {
    const supabase = await createClient();
    // Explicit filter: RLS also lets authors and admins read the games not yet approved.
    let query = supabase.from('games').select(GAME_CARD_SELECT).eq('status', 'approved').order('name');
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
 * Public pages: approved games only. The author's own profile passes `allStatuses`
 * to also list pending and rejected games (RLS lets authors read them).
 */
export const GetAuthorGames = async (authorId: string, {allStatuses = false}: {allStatuses?: boolean} = {}) => {
    const supabase = await createClient();
    const {data: links, error: linksError} = await supabase
        .from('game_authors')
        .select('game_id')
        .eq('author_id', authorId);

    if(linksError){
        throw new Error(linksError.message);
    }

    let query = supabase
        .from('games')
        .select(GAME_CARD_SELECT)
        .in('id', links.map(({game_id}) => game_id));
    if(!allStatuses){
        query = query.eq('status', 'approved');
    }
    const {data, error} = await query.order('name');

    if(error){
        throw new Error(error.message);
    }
    return data;
}
