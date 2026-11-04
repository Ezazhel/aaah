'use client'

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/alert";
import { FormField } from "@/components/form-field";
import { inviteMember } from "./actions/invite-member";

const roles = [
    { value: 'author', label: "Auteur·ice", help: "Propose des jeux, apparaît dans la liste des auteur·ices, emprunte du matériel.", checked: true },
    { value: 'location_manager', label: "Gestion de stock", help: "Gère un ou plusieurs lieux de stockage (ex. un bar à jeux). Se connecte sans adhésion.", checked: false },
    { value: 'admin', label: "Admin", help: "Accès à l'administration. Ne peut être retiré qu'en base de données.", checked: false },
] as const;

export function InviteForm() {
    const [state, formAction, pending] = useActionState(inviteMember, undefined);

    return (
        <form action={formAction} className="flex flex-col gap-4">
            {state && 'error' in state && <Alert>{state.error}</Alert>}
            {state && 'success' in state && <Alert variant="success">{state.success}</Alert>}
            <FormField id="email" label="Email">
                <Input name="email" id="email" type="email" placeholder="Adresse e-mail du nouveau membre" required/>
            </FormField>
            <fieldset className="flex flex-col gap-3">
                <legend className="mb-2 text-sm font-medium">Rôles</legend>
                {roles.map((role) => (
                    <div key={role.value} className="flex items-start gap-3">
                        <Checkbox id={`role-${role.value}`} name="roles" value={role.value} defaultChecked={role.checked} className="mt-0.5"/>
                        <div className="flex flex-col gap-0.5">
                            <Label htmlFor={`role-${role.value}`}>{role.label}</Label>
                            <p className="text-sm text-gray-600">{role.help}</p>
                        </div>
                    </div>
                ))}
            </fieldset>
            <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Envoi…" : "Envoyer l'invitation"}
            </Button>
        </form>
    );
}
