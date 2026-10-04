import { createClient } from "@/lib/supabase/server"

export const GetAuthor = async (slug:string) => {
    const supabase = await createClient();
    const {data,error} = await supabase.from('authors').select('*').eq('slug',slug).maybeSingle();

    if(error){
        throw new Error(error.message);
    }

    return data;
}
