'use client'

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/alert";
import { FormField } from "@/components/form-field";
import { inviteAuthor } from "./actions/invite-author";

export function InviteForm() {
    const [state, formAction, pending] = useActionState(inviteAuthor, undefined);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            {state && 'error' in state && <Alert>{state.error}</Alert>}
            {state && 'success' in state && <Alert variant="success">{state.success}</Alert>}
            <FormField id="email" label="Email">
                <Input name="email" id="email" type="email" placeholder="Adresse e-mail du nouveau membre" required/>
            </FormField>
            <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Envoi…" : "Envoyer l'invitation"}
            </Button>
        </form>
    );
}
