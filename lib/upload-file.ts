'use client'

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GAME_RULES_BUCKET, GAME_RULES_MAX_BYTES, gameRulesPath } from "./game-rules";

/**
 * Rules PDF picked in a form, not saved yet, and whether the stored one must be removed.
 * Same states as useImagePicker, without preview.
 */
export const usePdfPicker = () => {
    const [file, setFile] = useState<File | null>(null);
    const [removed, setRemoved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const picked = event.target.files?.[0];
        // Lets the same file be picked again after removing it.
        event.target.value = '';
        if(!picked){
            return;
        }
        if(picked.type !== 'application/pdf'){
            setError("Choisissez un fichier PDF.");
            return;
        }
        if(picked.size > GAME_RULES_MAX_BYTES){
            setError("Le PDF ne doit pas dépasser 10 Mo.");
            return;
        }
        setError(null);
        setRemoved(false);
        setFile(picked);
    }

    const remove = () => {
        setError(null);
        setFile(null);
        setRemoved(true);
    }

    const change = file ? 'updated' as const : removed ? 'removed' as const : 'unchanged' as const;

    return { file, removed, error, change, onChange, remove };
}

/**
 * Uploads the rules PDF straight from the browser, overwriting the previous version
 * (Storage policies decide who may write). Returns an error message, or null.
 */
export const uploadGameRules = async (file: File, gameId: string): Promise<string | null> => {
    const {error} = await createClient().storage.from(GAME_RULES_BUCKET).upload(gameRulesPath(gameId), file, {
        upsert: true,
        contentType: 'application/pdf',
        // The URL changes with each new version (?v=), so it can be cached for a year.
        cacheControl: '31536000',
    });
    if(error){
        console.log(error);
        return "Le PDF des règles n'a pas pu être envoyé. Réessayez ou contactez un administrateur";
    }
    return null;
}
