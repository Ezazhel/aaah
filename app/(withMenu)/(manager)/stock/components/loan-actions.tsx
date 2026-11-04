'use client'

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LoanStatus } from "@/app/model/inventory";
import { decideLoan, markBorrowed, markReturned, type ActionResult } from "../lib/action";

/**
 * Next step of a loan: accept / refuse a request, record the pick-up, record the return.
 */
export function LoanActions({ loanId, status }: { loanId: string; status: LoanStatus }) {
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [note, setNote] = useState('');

    const run = (action: () => Promise<ActionResult>) => startTransition(async () => {
        const result = await action();
        setError(result?.error ?? null);
    });

    return (
        <div className="flex flex-col gap-2 sm:items-end">
            {status === 'pending' && (<>
                <Input aria-label="Note pour l'auteur·ice (facultatif)" placeholder="Note (facultatif)" value={note} maxLength={1000}
                    onChange={(e) => setNote(e.target.value)} className="sm:w-64"/>
                <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" disabled={pending} onClick={() => run(() => decideLoan(loanId, true, note))}>Accepter</Button>
                    <Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => run(() => decideLoan(loanId, false, note))}>Refuser</Button>
                </div>
            </>)}
            {status === 'approved' && (
                <Button type="button" size="sm" disabled={pending} onClick={() => run(() => markBorrowed(loanId))}>Matériel retiré</Button>
            )}
            {status === 'borrowed' && (
                <Button type="button" size="sm" disabled={pending} onClick={() => run(() => markReturned(loanId))}>Matériel rendu</Button>
            )}
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
