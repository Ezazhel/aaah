import { createClient } from "@/lib/supabase/server"

/**
 * Everything the tags admin page shows (admin RLS: pending mechanics included).
 */
export const GetAdminTags = async () => {
    const supabase = await createClient();
    const [categories, mechanics] = await Promise.all([
        supabase.from('categories').select('id, name, color, position, games(count)').order('position').order('name'),
        supabase
            .from('mechanics')
            .select('id, name, status, bgg_id, created_at, suggester:authors(first_name, last_name), games:game_mechanics(game:games(name, slug))')
            .order('name'),
    ]);

    if(categories.error || mechanics.error){
        throw new Error((categories.error ?? mechanics.error)!.message);
    }

    return {
        categories: categories.data.map(({games, ...category}) => ({ ...category, gameCount: games[0]?.count ?? 0 })),
        pending: mechanics.data.filter(({status}) => status === 'pending'),
        approved: mechanics.data.filter(({status}) => status === 'approved').map(({games, ...mechanic}) => ({ ...mechanic, gameCount: games.length })),
    };
}

export type AdminTags = Awaited<ReturnType<typeof GetAdminTags>>;

/**
 * Number of mechanics suggested by authors and waiting for an admin.
 */
export const GetPendingMechanicsCount = async () => {
    const supabase = await createClient();
    const {count, error} = await supabase
        .from('mechanics')
        .select('id', {count: 'exact', head: true})
        .eq('status', 'pending');

    if(error){
        throw new Error(error.message);
    }
    return count ?? 0;
}
