'use server'

import { createClient } from "@supabase/supabase-js";

export async function inviteUser(formData: FormData){
    const email = formData.get('email') as string;

    const supabase = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!,
    );

    const {data, error} = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`
    })

    if(error){
        throw new Error(error.message)
    }
}