import { createClient } from "@/lib/supabase/server"

/**
 * Games waiting for an admin decision, oldest first.
 */
export const GetPendingGames = async () => {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from('games')
        .select('*, authors:game_authors(author:authors(id, first_name, last_name, slug))')
        .eq('status', 'pending')
        .order('created_at');

    if(error){
        throw new Error(error.message);
    }
    return data;
}
