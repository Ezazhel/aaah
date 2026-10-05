'use client'

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/alert";
import { createMechanic, deleteMechanic, renameMechanic } from "../lib/action";
import type { AdminTags } from "../lib/get-tags";
import { useTagAction } from "./use-tag-action";

type Mechanic = AdminTags['approved'][number];

const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

function MechanicRow({ mechanic }: { mechanic: Mechanic }) {
    const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view');
    const [name, setName] = useState(mechanic.name);
    const { error, pending, run } = useTagAction();

    return (
        <li className="flex flex-col gap-2 border-b border-gray-100 py-2 last:border-0">
            {error && <Alert>{error}</Alert>}
            {mode === 'edit' ? (
                <form className="flex flex-wrap items-center gap-2" onSubmit={(event) => { event.preventDefault(); run(() => renameMechanic(mechanic.id, name), () => setMode('view')); }}>
                    <Input aria-label="Nom de la mécanique" value={name} onChange={(event) => setName(event.target.value)} className="max-w-sm flex-1" disabled={pending} autoFocus/>
                    <Button type="submit" size="sm" disabled={pending}>Enregistrer</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => { setName(mechanic.name); setMode('view'); }} disabled={pending}>Annuler</Button>
                </form>
            ) : (
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-gray-800">
                        {mechanic.name}
                        <span className="ml-2 text-xs text-gray-500">
                            {mechanic.gameCount} jeu{mechanic.gameCount > 1 ? 'x' : ''}
                            {mechanic.bgg_id && <> · <a href={`https://boardgamegeek.com/boardgamemechanic/${mechanic.bgg_id}`} target="_blank" rel="noopener noreferrer" className="hover:underline">BGG</a></>}
                        </span>
                    </span>
                    {mode === 'delete' ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-red-700">Retirée des jeux qui l&apos;utilisent.</span>
                            <Button type="button" size="xs" variant="destructive" onClick={() => run(() => deleteMechanic(mechanic.id))} disabled={pending}>Supprimer</Button>
                            <Button type="button" size="xs" variant="outline" onClick={() => setMode('view')} disabled={pending}>Annuler</Button>
                        </div>
                    ) : (
                        <div className="flex gap-1">
                            <Button type="button" size="icon-sm" variant="ghost" onClick={() => setMode('edit')} aria-label={`Renommer ${mechanic.name}`}><Pencil/></Button>
                            <Button type="button" size="icon-sm" variant="ghost" onClick={() => setMode('delete')} aria-label={`Supprimer ${mechanic.name}`}><Trash2/></Button>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
}

/**
 * Approved mechanics: search, rename, delete, and add new ones directly (approved).
 */
export function MechanicsEditor({ mechanics }: { mechanics: Mechanic[] }) {
    const [query, setQuery] = useState('');
    const { error, pending, run } = useTagAction();

    const results = useMemo(() => {
        const search = normalize(query);
        return search ? mechanics.filter(({name}) => normalize(name).includes(search)) : mechanics;
    }, [mechanics, query]);

    const exists = mechanics.some(({name}) => normalize(name) === normalize(query));

    return (
        <div className="flex flex-col gap-3">
            <form className="flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); run(() => createMechanic(query), () => setQuery('')); }}>
                <Input aria-label="Rechercher ou ajouter une mécanique" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher ou ajouter une mécanique" className="max-w-sm flex-1" disabled={pending}/>
                <Button type="submit" variant="outline" disabled={pending || query.trim().length < 2 || exists}><Plus/> Ajouter « {query.trim() || '…'} »</Button>
            </form>
            {error && <Alert>{error}</Alert>}
            <p className="text-sm text-gray-500">{results.length} mécanique{results.length > 1 ? 's' : ''}</p>
            <ul className="max-h-[32rem] overflow-y-auto pr-2">
                {results.map((mechanic) => <MechanicRow key={mechanic.id} mechanic={mechanic}/>)}
            </ul>
        </div>
    );
}
