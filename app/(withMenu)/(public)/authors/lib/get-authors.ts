import { createClient } from "@/lib/supabase/server";

export async function GetAuthors() {
    const supabase = await createClient();
    try {
        const { data } = await supabase.from('authors').select('id, last_name, first_name, slug, description, avatar_url')
        .neq('last_name',null)
        .neq('first_name',null)
        .neq('last_name','')
        .neq('first_name','')
        .neq('slug',null)
        .neq('slug', '')
        .order('last_name');

        return data ?? [];

    }catch(error){
        console.log(error)
        return [];
    }
}