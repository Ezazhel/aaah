'use server'

import { z } from "zod";
import { isAdmin } from "@/lib/route_requires";
import { createAdminClient } from "@/lib/supabase/admin";

export type InviteState = { error: string } | { success: string } | undefined;

export const INVITABLE_ROLES = ['author', 'location_manager', 'admin'] as const;

const inviteSchema = z.object({
    email: z.email(),
    roles: z.array(z.enum(INVITABLE_ROLES)).min(1),
});

/**
 * Invites a member by email and gives the chosen roles.
 * The roles are stored right away (the account exists from the invitation), so a resent
 * invitation (login page) needs nothing more.
 */
export async function inviteMember(_prevState: InviteState, formData: FormData): Promise<InviteState> {
    // A server action is a public endpoint: check the role here too.
    if(!(await isAdmin())){
        return { error: "Vous devez être administrateur·ice pour inviter un·e membre." };
    }

    const parsed = inviteSchema.safeParse({
        email: formData.get('email'),
        roles: formData.getAll('roles'),
    });
    if(!parsed.success){
        const emailError = parsed.error.issues.some((issue) => issue.path[0] === 'email');
        return { error: emailError ? "Adresse e-mail invalide." : "Choisissez au moins un rôle." };
    }

    // The secret key is required to send invitations: only used on the server.
    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(parsed.data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`
    });

    if(error || !data.user){
        console.log(error);
        return { error: "L'invitation n'a pas pu être envoyée. L'adresse est peut-être déjà inscrite : modifiez ses rôles dans « Membres »." };
    }

    // The member row is created by the on_auth_user_created trigger.
    const { error: rolesError } = await supabase
        .from('user_roles')
        .upsert(parsed.data.roles.map((role) => ({ user_id: data.user.id, role })), { ignoreDuplicates: true });

    if(rolesError){
        console.log(rolesError);
        return { error: `Invitation envoyée à ${parsed.data.email}, mais les rôles n'ont pas pu être enregistrés : donnez-les dans « Membres ».` };
    }

    return { success: `Invitation envoyée à ${parsed.data.email}.` };
}
