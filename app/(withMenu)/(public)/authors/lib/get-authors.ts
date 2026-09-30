import { Author } from "@/app/model/author";
import { createClient } from "@/lib/supabase/server";

export async function GetAuthors() {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('authors').select('last_name, first_name, slug')
        .neq('last_name',null)
        .neq('first_name',null)
        .neq('last_name','')
        .neq('first_name','')
        .neq('slug',null)
        .neq('slug', '');

        return data ?? [];

    }catch(error){
        console.log(error)
        return [];
    }
}