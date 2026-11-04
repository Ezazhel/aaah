'use client'

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/alert";
import { cn } from "@/lib/utils";
import type { FormState } from "../lib/action";

type ActionFormProps = {
    action: (prev: FormState, formData: FormData) => Promise<FormState>;
    submitLabel: string;
    className?: string;
    /** Inline layout (one row): the success message is not shown. */
    compact?: boolean;
    children: React.ReactNode;
}

function SubmitButton({ label, compact }: { label: string; compact?: boolean }) {
    const { pending } = useFormStatus();
    return <Button type="submit" size={compact ? "sm" : "default"} disabled={pending}>{pending ? "…" : label}</Button>;
}

/**
 * Form posting to a server action, with its error / success message.
 */
export function ActionForm({ action, submitLabel, className, compact, children }: ActionFormProps) {
    const [state, formAction] = useActionState(action, undefined);

    return (
        <form action={formAction} className={cn("flex flex-col gap-3", className)}>
            {state && 'error' in state && <Alert>{state.error}</Alert>}
            {!compact && state && 'success' in state && <Alert variant="success">{state.success}</Alert>}
            <div className={cn(compact ? "flex flex-wrap items-end gap-2" : "flex flex-col gap-3")}>
                {children}
                <div><SubmitButton label={submitLabel} compact={compact}/></div>
            </div>
        </form>
    );
}
