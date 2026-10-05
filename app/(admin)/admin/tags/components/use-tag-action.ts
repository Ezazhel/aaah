'use client'

import { useState, useTransition } from "react";
import type { TagActionResult } from "../lib/action";

/**
 * Runs a tag server action and keeps its error message (pattern of the admin forms).
 */
export function useTagAction() {
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const run = (action: () => Promise<TagActionResult>, onSuccess?: () => void) => startTransition(async () => {
        setError(null);
        const result = await action();
        if(result?.error){
            setError(result.error);
        } else {
            onSuccess?.();
        }
    });

    return { error, pending, run };
}
