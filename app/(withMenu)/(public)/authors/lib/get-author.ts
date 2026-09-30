import { Author } from "@/app/model/author";
import { createClient } from "@/lib/supabase/server"

export const GetAuthor = async (slug:string) => {
    const supabase = await createClient();
    const {data,error} = await supabase.from('authors').select('*').eq('slug',slug).single();

    if(error){
        throw new Error(error.message);
    }

    console.log(data);
    return data;
}