'use client'

import { useState, useTransition } from "react";
import { BookOpen, Package, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/alert";
import { promoteToAdmin, setMembership, setRole, type MemberActionResult } from "../lib/action";

type ConfirmedAction = 'promote' | 'disable' | 'enable';

const confirmations: Record<ConfirmedAction, string> = {
    promote: "Le rôle admin ne pourra être retiré qu'en base de données.",
    disable: "L'adhésion expirera à la fin de la période précédente : connexion bloquée (sauf gestionnaire de stock), profil masqué.",
    enable: "L'adhésion sera valable jusqu'à la fin de la période en cours.",
};

type MemberActionsProps = {
    userId: string;
    isAdmin: boolean;
    isAuthor: boolean;
    isLocationManager: boolean;
    isActive: boolean;
}

/**
 * Role toggles (author, stock manager), promote to admin and membership buttons of a member.
 * Promote / disable / enable are confirmed in two steps; roles can be toggled back at any time.
 */
export function MemberActions({ userId, isAdmin, isAuthor, isLocationManager, isActive }: MemberActionsProps) {
    const [confirming, setConfirming] = useState<ConfirmedAction | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const run = (action: () => Promise<MemberActionResult>) => startTransition(async () => {
        setServerError(null);
        const result = await action();
        if(result?.error){
            setServerError(result.error);
        }
        setConfirming(null);
    });

    const runConfirmed = (action: ConfirmedAction) => run(() =>
        action === 'promote' ? promoteToAdmin(userId) : setMembership(userId, action === 'enable'));

    return (
        <div className="flex flex-col gap-3">
            {serverError && <Alert>{serverError}</Alert>}

            {confirming ? (
                <>
                    <p className="text-sm text-gray-700">{confirmations[confirming]}</p>
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" size="sm" variant={confirming === 'disable' ? 'destructive' : 'default'} onClick={() => runConfirmed(confirming)} disabled={pending}>Confirmer</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setConfirming(null)} disabled={pending}>Annuler</Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant={isAuthor ? "default" : "outline"} aria-pressed={isAuthor} disabled={pending}
                        onClick={() => run(() => setRole(userId, 'author', !isAuthor))}>
                        <BookOpen/> Auteur·ice
                    </Button>
                    <Button type="button" size="sm" variant={isLocationManager ? "default" : "outline"} aria-pressed={isLocationManager} disabled={pending}
                        onClick={() => run(() => setRole(userId, 'location_manager', !isLocationManager))}>
                        <Package/> Gestion de stock
                    </Button>
                    {/* Admins are always active and their role is removed in the database. */}
                    {!isAdmin && isActive && (
                        <Button type="button" size="sm" variant="outline" onClick={() => setConfirming('promote')}><ShieldCheck/> Nommer admin</Button>
                    )}
                    {!isAdmin && (isActive
                        ? <Button type="button" size="sm" variant="outline" onClick={() => setConfirming('disable')}><UserX/> Désactiver l&apos;adhésion</Button>
                        : <Button type="button" size="sm" onClick={() => setConfirming('enable')}><UserCheck/> Réactiver l&apos;adhésion</Button>)}
                </div>
            )}
        </div>
    );
}
