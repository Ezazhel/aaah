import { createClient } from "@/lib/supabase/server"
import type { GameFilters } from "./filters"

const GAME_CARD_SELECT = '*, authors:game_authors(author:members(id, first_name, last_name, slug)), category:categories(id, name, color), mechanics:game_mechanics(mechanic:mechanics(id, name))';

export const GetGames = async ({limit, filters}: {limit?: number; filters?: GameFilters} = {}) => {
    const supabase = await createClient();
    // Explicit filter: RLS also lets authors and admins read the games not yet approved.
    let query = supabase.from('games').select(GAME_CARD_SELECT).eq('status', 'approved').order('name');
    if(limit){
        query = query.limit(limit);
    }
    if(filters?.categories.length){
        query = query.in('category_id', filters.categories);
    }
    if(filters?.mechanics.length){
        // Separate lookup: an inner join on the embedded mechanics would also trim the badges of the cards.
        const {data: links, error: linksError} = await supabase
            .from('game_mechanics')
            .select('game_id')
            .in('mechanic_id', filters.mechanics);
        if(linksError){
            throw new Error(linksError.message);
        }
        query = query.in('id', links.map(({game_id}) => game_id));
    }
    if(filters?.players){
        query = query.lte('min_players', filters.players).gte('max_players', filters.players);
    }
    if(filters?.duration){
        query = query.lte('max_time_minutes', filters.duration);
    }
    if(filters?.age){
        query = query.lte('age_threshold', filters.age);
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
