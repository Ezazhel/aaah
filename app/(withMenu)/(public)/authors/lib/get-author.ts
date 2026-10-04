import { createClient } from "@/lib/supabase/server"
import { activeMembershipFilter } from "@/app/model/author";

export const GetAuthor = async (slug:string) => {
    const supabase = await createClient();
    const {data,error} = await supabase.from('authors').select('*').eq('slug',slug)
        // Authors whose membership expired are hidden.
        .or(activeMembershipFilter())
        .maybeSingle();

    if(error){
        throw new Error(error.message);
    }

    return data;
}
