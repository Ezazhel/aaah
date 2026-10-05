'use client'

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/alert";
import { CategoryBadge } from "@/components/category-badge";
import { createCategory, deleteCategory, updateCategory } from "../lib/action";
import type { AdminTags } from "../lib/get-tags";
import { useTagAction } from "./use-tag-action";

type Category = AdminTags['categories'][number];

/**
 * Name + color fields, used to create and edit a category.
 */
function CategoryFields({ initial, submitLabel, onSubmit, onCancel, pending }: {
    initial: { name: string; color: string };
    submitLabel: string;
    onSubmit: (values: { name: string; color: string }) => void;
    onCancel?: () => void;
    pending: boolean;
}) {
    const [name, setName] = useState(initial.name);
    const [color, setColor] = useState(initial.color);

    return (
        <form
            onSubmit={(event) => { event.preventDefault(); onSubmit({ name, color }); }}
            className="flex flex-wrap items-center gap-2"
        >
            <Input aria-label="Nom de la catégorie" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nom" className="w-48" required disabled={pending}/>
            <input type="color" aria-label="Couleur" value={color} onChange={(event) => setColor(event.target.value)} className="h-9 w-12 cursor-pointer rounded-md border border-input bg-white p-1" disabled={pending}/>
            {name.trim() && <CategoryBadge name={name} color={color}/>}
            <Button type="submit" size="sm" disabled={pending}>{submitLabel}</Button>
            {onCancel && <Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={pending}>Annuler</Button>}
        </form>
    );
}

function CategoryRow({ category }: { category: Category }) {
    const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view');
    const { error, pending, run } = useTagAction();

    return (
        <li className="flex flex-col gap-2 border-b border-gray-100 py-3 last:border-0">
            {error && <Alert>{error}</Alert>}
            {mode === 'edit' ? (
                <CategoryFields
                    initial={category}
                    submitLabel="Enregistrer"
                    pending={pending}
                    onSubmit={(values) => run(() => updateCategory(category.id, values), () => setMode('view'))}
                    onCancel={() => setMode('view')}
                />
            ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <CategoryBadge name={category.name} color={category.color}/>
                        <span className="text-sm text-gray-500">{category.gameCount} jeu{category.gameCount > 1 ? 'x' : ''}</span>
                    </div>
                    {mode === 'delete' ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-red-700">Les jeux de cette catégorie n&apos;en auront plus.</span>
                            <Button type="button" size="sm" variant="destructive" onClick={() => run(() => deleteCategory(category.id))} disabled={pending}>Supprimer</Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => setMode('view')} disabled={pending}>Annuler</Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => setMode('edit')}><Pencil/> Modifier</Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => setMode('delete')} aria-label={`Supprimer ${category.name}`}><Trash2/></Button>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
}

export function CategoriesEditor({ categories }: { categories: Category[] }) {
    const [adding, setAdding] = useState(false);
    const { error, pending, run } = useTagAction();

    return (
        <div className="flex flex-col gap-3">
            <ul>
                {categories.map((category) => <CategoryRow key={category.id} category={category}/>)}
            </ul>
            {error && <Alert>{error}</Alert>}
            {adding ? (
                <CategoryFields
                    initial={{ name: '', color: '#e8692c' }}
                    submitLabel="Ajouter"
                    pending={pending}
                    onSubmit={(values) => run(() => createCategory(values), () => setAdding(false))}
                    onCancel={() => setAdding(false)}
                />
            ) : (
                <Button type="button" variant="outline" className="self-start" onClick={() => setAdding(true)}><Plus/> Nouvelle catégorie</Button>
            )}
        </div>
    );
}
