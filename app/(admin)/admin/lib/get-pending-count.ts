import { createClient } from "@/lib/supabase/server"

/**
 * Number of games waiting for an admin decision.
 */
export const GetPendingCount = async () => {
    const supabase = await createClient();
    const {count, error} = await supabase
        .from('games')
        .select('id', {count: 'exact', head: true})
        .eq('status', 'pending');

    if(error){
        throw new Error(error.message);
    }
    return count ?? 0;
}
