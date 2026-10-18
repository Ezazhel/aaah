'use client'

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Category, Mechanic } from "@/app/model/category";
import { CategoryBadge } from "@/components/category-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { countActiveFilters, toSearchParams, type GameFilters } from "../lib/filters";

type GamesFilterSheetProps = {
    categories: Category[];
    mechanics: Mechanic[];
    filters: GameFilters;
}

const noFilters: GameFilters = { categories: [], mechanics: [] };

// Accent-insensitive search: "pose d'ouvriers" matches "Pose d’Ouvriers".
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[‘’]/g, "'").toLowerCase().trim();

const toggle = (list: number[], id: number, checked: boolean) =>
    checked ? [...list, id] : list.filter((selectedId) => selectedId !== id);

const numberFields = [
    { key: 'players', label: 'Nombre de joueurs', placeholder: 'ex. 4' },
    { key: 'duration', label: 'Durée max (min)', placeholder: 'ex. 60' },
    { key: 'age', label: 'Âge des joueurs', placeholder: 'ex. 8' },
] as const;

/**
 * "Filtres" button opening a side panel. The choices are a draft:
 * they only reach the URL (and the list) when the user clicks "Appliquer".
 */
export function GamesFilterSheet({ categories, mechanics, filters }: GamesFilterSheetProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(filters);
    const [query, setQuery] = useState('');
    const id = useId();
    const activeCount = countActiveFilters(filters);

    // Selected mechanics first, so they stay visible in the long list.
    const shownMechanics = useMemo(() => {
        const search = normalize(query);
        const matches = mechanics.filter((mechanic) => !search || normalize(mechanic.name).includes(search));
        return [
            ...matches.filter((mechanic) => draft.mechanics.includes(mechanic.id)),
            ...matches.filter((mechanic) => !draft.mechanics.includes(mechanic.id)),
        ];
    }, [mechanics, query, draft.mechanics]);

    // Each opening starts from the applied filters: closing without applying discards the draft.
    const onOpenChange = (next: boolean) => {
        if(next){
            setDraft(filters);
            setQuery('');
        }
        setOpen(next);
    };

    const apply = () => {
        const params = toSearchParams(draft).toString();
        router.push(params ? `/games?${params}` : '/games', { scroll: false });
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal/> Filtres
                    {activeCount > 0 && (
                        <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeCount}</span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
                <SheetHeader className="border-b">
                    <SheetTitle className="text-lg text-brand-dark">Filtrer les jeux</SheetTitle>
                    <SheetDescription>Les filtres s’appliquent quand vous cliquez sur « Appliquer ».</SheetDescription>
                </SheetHeader>

                <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
                    <fieldset className="flex flex-col gap-3">
                        <legend className="mb-3 text-sm font-bold text-brand-dark">Catégorie</legend>
                        {categories.map((category) => (
                            <Label key={category.id} className="cursor-pointer font-normal">
                                <Checkbox
                                    checked={draft.categories.includes(category.id)}
                                    onCheckedChange={(checked) => setDraft({ ...draft, categories: toggle(draft.categories, category.id, checked === true) })}
                                />
                                <CategoryBadge name={category.name} color={category.color}/>
                            </Label>
                        ))}
                    </fieldset>

                    <fieldset className="flex flex-col gap-3">
                        <legend className="mb-3 text-sm font-bold text-brand-dark">Joueurs, durée et âge</legend>
                        <div className="grid grid-cols-3 gap-3">
                            {numberFields.map(({ key, label, placeholder }) => (
                                <div key={key} className="flex flex-col gap-2">
                                    <Label htmlFor={`${id}-${key}`} className="text-xs leading-tight">{label}</Label>
                                    <Input
                                        id={`${id}-${key}`}
                                        type="number"
                                        inputMode="numeric"
                                        min={1}
                                        placeholder={placeholder}
                                        value={draft[key] ?? ''}
                                        onChange={(event) => {
                                            const value = Number.parseInt(event.target.value, 10);
                                            setDraft({ ...draft, [key]: value > 0 ? value : undefined });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </fieldset>

                    <fieldset className="flex min-h-0 flex-col gap-3">
                        <legend className="mb-3 text-sm font-bold text-brand-dark">
                            Mécaniques{draft.mechanics.length > 0 && <span className="font-normal text-gray-500"> · {draft.mechanics.length} sélectionnée{draft.mechanics.length > 1 ? 's' : ''}</span>}
                        </legend>
                        <Input
                            type="search"
                            placeholder="Rechercher une mécanique"
                            aria-label="Rechercher une mécanique"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <ul className="flex max-h-72 flex-col gap-2.5 overflow-y-auto rounded-lg border border-gray-200 p-3">
                            {shownMechanics.map((mechanic) => (
                                <li key={mechanic.id}>
                                    <Label className="cursor-pointer font-normal">
                                        <Checkbox
                                            checked={draft.mechanics.includes(mechanic.id)}
                                            onCheckedChange={(checked) => setDraft({ ...draft, mechanics: toggle(draft.mechanics, mechanic.id, checked === true) })}
                                        />
                                        {mechanic.name}
                                    </Label>
                                </li>
                            ))}
                            {shownMechanics.length === 0 && <li className="text-sm text-gray-500">Aucune mécanique trouvée.</li>}
                        </ul>
                    </fieldset>
                </div>

                <SheetFooter className="flex-row border-t">
                    <Button variant="outline" className="flex-1" onClick={() => setDraft(noFilters)}>Réinitialiser</Button>
                    <Button className="flex-1" onClick={apply}>Appliquer</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
