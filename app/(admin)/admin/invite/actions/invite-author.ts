'use server'

import { z } from "zod";
import { isAdmin } from "@/lib/route_requires";
import { createAdminClient } from "@/lib/supabase/admin";

export type InviteState = { error: string } | { success: string } | undefined;

const emailSchema = z.email();

export async function inviteAuthor(_prevState: InviteState, formData: FormData): Promise<InviteState> {
    // A server action is a public endpoint: check the role here too.
    if(!(await isAdmin())){
        return { error: "Vous devez être administrateur·ice pour inviter un·e auteur·ice." };
    }

    const parsed = emailSchema.safeParse(formData.get('email'));
    if(!parsed.success){
        return { error: "Adresse e-mail invalide." };
    }

    // The secret key is required to send invitations: only used on the server.
    const supabase = createAdminClient();

    const { error } = await supabase.auth.admin.inviteUserByEmail(parsed.data, {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`
    });

    if(error){
        console.log(error);
        return { error: "L'invitation n'a pas pu être envoyée. L'adresse est peut-être déjà inscrite." };
    }

    return { success: `Invitation envoyée à ${parsed.data}.` };
}
