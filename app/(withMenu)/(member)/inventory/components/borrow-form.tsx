'use client'

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/alert";
import { FormField } from "@/components/form-field";
import { borrow } from "../lib/action";
import type { CatalogItem } from "../lib/get-inventory";

const selectClass = "h-9 w-full rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

/**
 * Borrow form of one item: place, quantity, message, then "ask" or "I already took it".
 */
export function BorrowForm({ item }: { item: CatalogItem }) {
    const [state, formAction, pending] = useActionState(borrow, undefined);
    const available = item.stock.filter((row) => row.available > 0);
    const [locationId, setLocationId] = useState(available[0]?.location?.id ?? '');
    const max = available.find((row) => row.location?.id === locationId)?.available ?? 1;
    const id = (name: string) => `${name}-${item.id}`;

    if(!available.length){
        return <p className="text-sm text-gray-600">Tout est emprunté ou réservé pour le moment.</p>;
    }

    return (
        <form action={formAction} className="flex flex-col gap-3">
            {state && 'error' in state && <Alert>{state.error}</Alert>}
            {state && 'success' in state && <Alert variant="success">{state.success}</Alert>}
            <input type="hidden" name="item_id" value={item.id}/>
            <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
                <FormField id={id('location')} label="Lieu">
                    <select id={id('location')} name="location_id" className={selectClass} value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                        {available.map((row) => row.location && (
                            <option key={row.location.id} value={row.location.id}>{row.location.name} ({row.available} dispo.)</option>
                        ))}
                    </select>
                </FormField>
                <FormField id={id('quantity')} label="Quantité">
                    <Input id={id('quantity')} name="quantity" type="number" min={1} max={max} defaultValue={1} required/>
                </FormField>
            </div>
            <FormField id={id('message')} label="Message (facultatif)">
                <Textarea id={id('message')} name="message" maxLength={1000} rows={2} placeholder="Pour quel projet, quand passer…"/>
            </FormField>
            <div className="flex flex-wrap gap-2">
                <Button type="submit" name="mode" value="request" disabled={pending}>Demander</Button>
                <Button type="submit" name="mode" value="declare" variant="outline" disabled={pending}>Je l&apos;ai déjà pris</Button>
            </div>
        </form>
    );
}
