import { createClient } from "@/lib/supabase/server"

/**
 * Categories (display order) and the mechanics the user can pick:
 * approved ones and their own pending suggestions (RLS).
 */
export const GetTags = async () => {
    const supabase = await createClient();
    const [categories, mechanics] = await Promise.all([
        supabase.from('categories').select('id, name, color').order('position').order('name'),
        supabase.from('mechanics').select('id, name, status').order('name'),
    ]);

    if(categories.error || mechanics.error){
        throw new Error((categories.error ?? mechanics.error)!.message);
    }
    return { categories: categories.data, mechanics: mechanics.data };
}

export type Tags = Awaited<ReturnType<typeof GetTags>>;
export type MechanicOption = Tags['mechanics'][number];
