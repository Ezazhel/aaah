import { createClient } from "@/lib/supabase/server";
import { activeMembershipFilter } from "@/app/model/author";

export async function GetAuthors() {
    const supabase = await createClient();
    try {
        const { data } = await supabase.from('authors').select('id, last_name, first_name, slug, description, avatar_updated_at')
        .neq('last_name',null)
        .neq('first_name',null)
        .neq('last_name','')
        .neq('first_name','')
        .neq('slug',null)
        .neq('slug', '')
        // Authors whose membership expired are hidden.
        .or(activeMembershipFilter())
        .order('last_name');

        return data ?? [];

    }catch(error){
        console.log(error)
        return [];
    }
}