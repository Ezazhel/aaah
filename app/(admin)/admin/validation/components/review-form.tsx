'use client'

import { useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/alert";
import { FormField, errorId } from "@/components/form-field";
import { reviewGame } from "../lib/action";
import type { ReviewInput } from "../lib/schema";

/**
 * Approve / reject buttons of a pending game. Rejecting asks for a reason.
 */
export function ReviewForm({ gameId }: { gameId: string }) {
    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const submit = (payload: ReviewInput) => startTransition(async () => {
        setServerError(null);
        const result = await reviewGame(payload);
        if(result?.error){
            setServerError(result.error);
        }
    });

    const reject = () => {
        if(!reason.trim()){
            setReasonError("Indiquez la raison du refus");
            return;
        }
        setReasonError(null);
        submit({ gameId, decision: 'rejected', reason });
    };

    const reasonId = `reason-${gameId}`;

    return (
        <div className="flex flex-col gap-3">
            {serverError && <Alert>{serverError}</Alert>}

            {rejecting ? (
                <>
                    <FormField id={reasonId} label="Raison du refus" error={reasonError ?? undefined} hint="Visible par les auteur·ices du jeu.">
                        <Textarea
                            id={reasonId}
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            aria-invalid={Boolean(reasonError)}
                            aria-describedby={reasonError ? errorId(reasonId) : undefined}
                            autoFocus
                        />
                    </FormField>
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="destructive" onClick={reject} disabled={pending}><X/> Confirmer le refus</Button>
                        <Button type="button" variant="outline" onClick={() => setRejecting(false)} disabled={pending}>Annuler</Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-wrap gap-2">
                    <Button type="button" onClick={() => submit({ gameId, decision: 'approved' })} disabled={pending}><Check/> Valider</Button>
                    <Button type="button" variant="outline" onClick={() => setRejecting(true)} disabled={pending}><X/> Refuser</Button>
                </div>
            )}
        </div>
    );
}
