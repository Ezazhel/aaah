'use server';

import { createClient } from "@/lib/supabase/server";

export async function signInWithMagicLink(initialState: {success:boolean, error: any}, formData: FormData): Promise<{success:boolean, error: any}> {
    const email = formData.get('email') as string;
    
    if(!email){
        return { success : false, error: 'Email is required'};
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: false,
            emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`
        }
    });

    if(error){
        return { success: false, error };
    }

    return { success: true, error: null };
}

