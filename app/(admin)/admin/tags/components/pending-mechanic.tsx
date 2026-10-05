'use client'

import Link from "next/link";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/alert";
import { approveMechanic, deleteMechanic } from "../lib/action";
import type { AdminTags } from "../lib/get-tags";
import { useTagAction } from "./use-tag-action";

/**
 * A suggested mechanic: the admin can fix its name, then approve it, or reject (delete) it.
 */
export function PendingMechanic({ mechanic }: { mechanic: AdminTags['pending'][number] }) {
    const [name, setName] = useState(mechanic.name);
    const [confirmReject, setConfirmReject] = useState(false);
    const { error, pending, run } = useTagAction();
    const suggester = mechanic.suggester ? `${mechanic.suggester.first_name ?? ''} ${mechanic.suggester.last_name ?? ''}`.trim() : null;
    const games = mechanic.games.map(({game}) => game).filter((game) => game !== null);
    const inputId = `pending-${mechanic.id}`;

    return (
        <li className="flex flex-col gap-3 rounded-xl bg-white/90 p-5 shadow">
            {error && <Alert>{error}</Alert>}
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex flex-1 flex-col gap-1">
                    <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">Nom (corrigez-le si besoin avant de valider)</label>
                    <Input id={inputId} value={name} onChange={(event) => setName(event.target.value)} disabled={pending}/>
                </div>
                {confirmReject ? (
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="destructive" onClick={() => run(() => deleteMechanic(mechanic.id))} disabled={pending}>Confirmer le refus</Button>
                        <Button type="button" variant="outline" onClick={() => setConfirmReject(false)} disabled={pending}>Annuler</Button>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" onClick={() => run(() => approveMechanic(mechanic.id, name))} disabled={pending}><Check/> Valider</Button>
                        <Button type="button" variant="outline" onClick={() => setConfirmReject(true)} disabled={pending}><X/> Refuser</Button>
                    </div>
                )}
            </div>
            <p className="text-sm text-gray-600">
                {suggester ? `Proposée par ${suggester}` : "Proposée par un·e auteur·ice"}
                {games.length > 0 && <> · utilisée par {games.map((game, index) => (
                    <span key={game.slug}>{index > 0 && ', '}<Link href={`/games/${game.slug}`} className="text-primary hover:underline">{game.name}</Link></span>
                ))}</>}
            </p>
            {confirmReject && <p className="text-sm text-red-700">La mécanique sera supprimée et retirée des jeux qui l&apos;utilisent.</p>}
        </li>
    );
}
