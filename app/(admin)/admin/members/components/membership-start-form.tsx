'use client'

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/alert";
import { FormField } from "@/components/form-field";
import { updateMembershipStart } from "../lib/action";
import { membershipStartSchema } from "../lib/schema";

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/**
 * Start date (day + month) of the membership period.
 */
export function MembershipStartForm({ month: initialMonth, day: initialDay }: { month: number; day: number }) {
    const [month, setMonth] = useState(initialMonth);
    const [day, setDay] = useState(initialDay);
    const [message, setMessage] = useState<{ error: string } | { success: string } | null>(null);
    const [pending, startTransition] = useTransition();

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const parsed = membershipStartSchema.safeParse({ month, day });
        if(!parsed.success){
            setMessage({ error: parsed.error.issues[0].message });
            return;
        }
        startTransition(async () => {
            const result = await updateMembershipStart(parsed.data);
            setMessage(result ?? { success: "Date de début enregistrée." });
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end gap-3">
                <FormField id="start_day" label="Jour" className="w-20">
                    <Input id="start_day" type="number" min={1} max={31} value={day} onChange={(event) => setDay(event.target.valueAsNumber)} required/>
                </FormField>
                <FormField id="start_month" label="Mois">
                    <select
                        id="start_month"
                        value={month}
                        onChange={(event) => setMonth(Number(event.target.value))}
                        className="h-9 rounded-md border border-input bg-white px-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                        {MONTHS.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}
                    </select>
                </FormField>
                <Button type="submit" variant="outline" disabled={pending}>Enregistrer</Button>
            </div>
            {message && 'error' in message && <Alert>{message.error}</Alert>}
            {message && 'success' in message && <Alert variant="success">{message.success}</Alert>}
        </form>
    );
}
