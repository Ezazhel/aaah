'use client'

import { useId, useMemo, useRef, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { suggestMechanic } from "../lib/action";
import type { MechanicOption } from "@/app/(withMenu)/(public)/games/lib/get-tags";

type MechanicsPickerProps = {
    id: string;
    options: MechanicOption[];
    value: number[];
    onChange: (value: number[]) => void;
    invalid?: boolean;
    describedBy?: string;
}

// Accent-insensitive search: "pose d'ouvriers" matches "Pose d’Ouvriers".
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const MAX_RESULTS = 50;

/**
 * Multi-select of mechanics with search. When nothing matches, the user can suggest
 * a new mechanic: it is added right away, pending until an admin approves it.
 */
export function MechanicsPicker({ id, options: initialOptions, value, onChange, invalid, describedBy }: MechanicsPickerProps) {
    const [options, setOptions] = useState(initialOptions);
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const listId = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const selected = value
        .map((mechanicId) => options.find((option) => option.id === mechanicId))
        .filter((option): option is MechanicOption => option !== undefined);

    const results = useMemo(() => {
        const search = normalize(query);
        return options
            .filter((option) => !value.includes(option.id))
            .filter((option) => !search || normalize(option.name).includes(search))
            .slice(0, MAX_RESULTS);
    }, [options, query, value]);

    // "Proposer" is offered when no mechanic has exactly this name.
    const canSuggest = query.trim().length >= 2 && !options.some((option) => normalize(option.name) === normalize(query));
    const itemCount = results.length + (canSuggest ? 1 : 0);

    const add = (mechanicId: number) => {
        onChange([...value, mechanicId]);
        setQuery('');
        setActive(0);
        inputRef.current?.focus();
    };

    const remove = (mechanicId: number) => onChange(value.filter((selectedId) => selectedId !== mechanicId));

    const suggest = () => startTransition(async () => {
        setError(null);
        const result = await suggestMechanic(query);
        if('error' in result){
            setError(result.error);
            return;
        }
        setOptions((current) => current.some((option) => option.id === result.mechanic.id) ? current : [...current, result.mechanic]);
        if(!value.includes(result.mechanic.id)){
            add(result.mechanic.id);
        }
    });

    const choose = (index: number) => {
        if(index < results.length){
            add(results[index].id);
        } else if(canSuggest){
            suggest();
        }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'ArrowDown'){
            event.preventDefault();
            setOpen(true);
            setActive((index) => Math.min(index + 1, itemCount - 1));
        } else if(event.key === 'ArrowUp'){
            event.preventDefault();
            setActive((index) => Math.max(index - 1, 0));
        } else if(event.key === 'Enter'){
            // Never submit the game form from the search field.
            event.preventDefault();
            if(open && itemCount > 0){
                choose(active);
            }
        } else if(event.key === 'Escape'){
            setOpen(false);
        } else if(event.key === 'Backspace' && !query && value.length){
            remove(value[value.length - 1]);
        }
    };

    const optionId = (index: number) => `${listId}-${index}`;

    return (
        <div className="flex flex-col gap-2">
            {selected.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Mécaniques choisies">
                    {selected.map((mechanic) => (
                        <li key={mechanic.id} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white py-0.5 pr-1 pl-2.5 text-sm text-gray-800">
                            {mechanic.name}
                            {mechanic.status === 'pending' && <span className="text-xs text-orange-700">(en attente de validation)</span>}
                            <button type="button" onClick={() => remove(mechanic.id)} className="rounded-full p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800" aria-label={`Retirer ${mechanic.name}`}>
                                <X className="size-3.5"/>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="relative">
                <Input
                    ref={inputRef}
                    id={id}
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-autocomplete="list"
                    aria-activedescendant={open && itemCount > 0 ? optionId(active) : undefined}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    autoComplete="off"
                    placeholder="Rechercher une mécanique : deck-building, pose d'ouvriers…"
                    value={query}
                    onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(0); }}
                    onFocus={() => setOpen(true)}
                    // Delay so a click on an option is handled before the list closes.
                    onBlur={() => setTimeout(() => setOpen(false), 150)}
                    onKeyDown={onKeyDown}
                    disabled={pending}
                />
                {open && itemCount > 0 && (
                    <ul id={listId} role="listbox" aria-label="Mécaniques" className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                        {results.map((option, index) => (
                            <li
                                key={option.id}
                                id={optionId(index)}
                                role="option"
                                aria-selected={index === active}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => add(option.id)}
                                onMouseEnter={() => setActive(index)}
                                className={cn("cursor-pointer px-3 py-1.5 text-sm", index === active && "bg-primary/10 text-primary")}
                            >
                                {option.name}
                                {option.status === 'pending' && <span className="ml-1 text-xs text-orange-700">(en attente)</span>}
                            </li>
                        ))}
                        {canSuggest && (
                            <li
                                id={optionId(results.length)}
                                role="option"
                                aria-selected={active === results.length}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={suggest}
                                onMouseEnter={() => setActive(results.length)}
                                className={cn("flex cursor-pointer items-center gap-2 border-t border-gray-100 px-3 py-2 text-sm font-medium", active === results.length ? "bg-primary/10 text-primary" : "text-gray-700")}
                            >
                                <Plus className="size-4" aria-hidden/> Proposer « {query.trim()} »
                            </li>
                        )}
                    </ul>
                )}
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            {pending && <p className="text-sm text-gray-500">Envoi de la proposition…</p>}
        </div>
    );
}
