import { createClient } from "@/lib/supabase/server"
import { activeMembershipFilter } from "@/app/model/author";

export const GetAuthor = async (slug:string) => {
    const supabase = await createClient();
    const {data,error} = await supabase.from('members').select('*, user_roles!inner(role)').eq('slug',slug)
        .eq('user_roles.role', 'author')
        // Authors whose membership expired are hidden.
        .or(activeMembershipFilter())
        .maybeSingle();

    if(error){
        throw new Error(error.message);
    }

    return data;
}
