'use client'

import { useState, useTransition } from "react";
import { ShieldCheck, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/alert";
import { promoteToAdmin, setMembership, type AuthorActionResult } from "../lib/action";

type Action = 'promote' | 'disable' | 'enable';

const confirmations: Record<Action, string> = {
    promote: "Le rôle admin ne pourra être retiré qu'en base de données.",
    disable: "L'adhésion expirera à la fin de la période précédente : connexion bloquée, profil masqué.",
    enable: "L'adhésion sera valable jusqu'à la fin de la période en cours.",
};

type AuthorActionsProps = {
    userId: string;
    isAdmin: boolean;
    isActive: boolean;
}

/**
 * Promote / disable / enable buttons of an author, each confirmed in two steps.
 */
export function AuthorActions({ userId, isAdmin, isActive }: AuthorActionsProps) {
    const [confirming, setConfirming] = useState<Action | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const run = (action: Action) => startTransition(async () => {
        setServerError(null);
        let result: AuthorActionResult;
        if(action === 'promote'){
            result = await promoteToAdmin(userId);
        } else {
            result = await setMembership(userId, action === 'enable');
        }
        if(result?.error){
            setServerError(result.error);
        }
        setConfirming(null);
    });

    // Admins are always active and their role is removed in the database: nothing to do here.
    if(isAdmin){
        return null;
    }

    return (
        <div className="flex flex-col gap-3">
            {serverError && <Alert>{serverError}</Alert>}

            {confirming ? (
                <>
                    <p className="text-sm text-gray-700">{confirmations[confirming]}</p>
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" size="sm" variant={confirming === 'disable' ? 'destructive' : 'default'} onClick={() => run(confirming)} disabled={pending}>Confirmer</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setConfirming(null)} disabled={pending}>Annuler</Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {isActive && (
                        <Button type="button" size="sm" variant="outline" onClick={() => setConfirming('promote')}><ShieldCheck/> Nommer admin</Button>
                    )}
                    {isActive
                        ? <Button type="button" size="sm" variant="outline" onClick={() => setConfirming('disable')}><UserX/> Désactiver</Button>
                        : <Button type="button" size="sm" onClick={() => setConfirming('enable')}><UserCheck/> Réactiver</Button>}
                </div>
            )}
        </div>
    );
}
