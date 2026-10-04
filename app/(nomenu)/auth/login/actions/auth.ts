'use server';

import { type AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { success: boolean, error: string | null };

const GENERIC_ERROR = "La connexion a échoué. Réessayez ou contactez un administrateur.";

/**
 * Turns a Supabase auth error code into a message for the user.
 * The raw Supabase message is never shown.
 */
function loginErrorMessage(code: AuthError["code"]): string {
    switch(code){
        // shouldCreateUser: false -> no account for this email
        case 'otp_disabled':
        case 'signup_disabled':
        case 'user_not_found':
            return "Aucun compte n'existe pour cette adresse. L'inscription se fait sur invitation : contactez les administrateurs de l'association.";
        case 'email_address_invalid':
        case 'validation_failed':
            return "Adresse e-mail invalide.";
        case 'over_email_send_rate_limit':
        case 'over_request_rate_limit':
            return "Trop de tentatives, réessayez dans quelques minutes.";
        default:
            return GENERIC_ERROR;
    }
}

export async function signInWithMagicLink(initialState: LoginState, formData: FormData): Promise<LoginState> {
    const email = formData.get('email');
    if(typeof email !== 'string' || !email.trim()){
        return { success : false, error: "L'adresse e-mail est obligatoire."};
    }

    try {
        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithOtp({
            email: email.trim(),
            options: {
                shouldCreateUser: false,
                emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`
            }
        });

        if(error){
            console.error(error);
            return { success: false, error: loginErrorMessage(error.code) };
        }
    } catch(error) {
        console.error(error);
        return { success: false, error: GENERIC_ERROR };
    }

    return { success: true, error: null };
}
