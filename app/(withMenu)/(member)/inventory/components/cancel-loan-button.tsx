'use client'

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cancelLoan } from "../lib/action";

export function CancelLoanButton({ loanId }: { loanId: string }) {
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="flex flex-col items-end gap-1">
            <Button type="button" size="sm" variant="outline" disabled={pending}
                onClick={() => startTransition(async () => {
                    const result = await cancelLoan(loanId);
                    setError(result?.error ?? null);
                })}>
                Annuler la demande
            </Button>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
