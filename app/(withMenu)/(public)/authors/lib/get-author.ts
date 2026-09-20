import { Author } from "@/app/model/author";
import { createClient } from "@/lib/supabase/server";

export async function GetAuthor(): Promise<Author[]> {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('authors').select('last_name, first_name, id')
        .neq('last_name',null)
        .neq('first_name',null)
        .neq('last_name','')
        .neq('first_name','');

        return data?.map(data => ({
            firstName: data.first_name,
            lastName: data.last_name,
            id: data.id
        })) ?? [];
    }catch(error){
        console.log(error)
        return [];
    }
}