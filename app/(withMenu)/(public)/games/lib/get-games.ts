import { createClient } from "@/lib/supabase/server"

export const GetGames = async () => {
    const supabase = await createClient();
    const {data, error } = await supabase.from('games').select('*');

    if(error){
        throw new Error(error.message);
    }
    return data;
}