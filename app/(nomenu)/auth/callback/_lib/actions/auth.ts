
import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function exchangeCodeForSession(code:string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if(error){
        throw error;
    }

    revalidatePath('/', 'layout');
    redirect('/authors');
}