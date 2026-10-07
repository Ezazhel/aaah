'use client'

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { resizeImage } from "./image";

// Checked before resizing: the uploaded files weigh a few hundred KB at most.
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;

/**
 * Picture picked in a form, not saved yet: the file, its local preview,
 * and whether the stored picture must be removed.
 */
export const useImagePicker = () => {
    // The preview URL is created with the file, and freed when it is replaced or the form goes away.
    const [picked, setPicked] = useState<{file: File; previewUrl: string} | null>(null);
    const [removed, setRemoved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => () => {
        if(picked){
            URL.revokeObjectURL(picked.previewUrl);
        }
    }, [picked]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // Lets the same file be picked again after removing it.
        event.target.value = '';
        if(!file){
            return;
        }
        if(!file.type.startsWith('image/')){
            setError("Choisissez une image (JPEG, PNG, WebP…).");
            return;
        }
        if(file.size > MAX_SOURCE_BYTES){
            setError("L'image ne doit pas dépasser 15 Mo.");
            return;
        }
        setError(null);
        setRemoved(false);
        setPicked({file, previewUrl: URL.createObjectURL(file)});
    }

    const remove = () => {
        setError(null);
        setPicked(null);
        setRemoved(true);
    }

    // After saving: the stored picture now matches the form.
    const reset = () => {
        setPicked(null);
        setRemoved(false);
    }

    const file = picked?.file ?? null;
    const previewUrl = picked?.previewUrl ?? null;
    const change = file ? 'updated' as const : removed ? 'removed' as const : 'unchanged' as const;

    return { file, previewUrl, removed, error, change, onChange, remove, reset };
}

/**
 * Resizes the picture to every size and uploads them straight from the browser
 * (Storage policies decide who may write). Returns an error message, or null.
 */
export const uploadResizedImage = async <Size extends string>(
    file: File,
    {bucket, sizes, path, square = false}: {
        bucket: string;
        sizes: Record<Size, number>;
        path: (size: Size) => string;
        square?: boolean;
    },
): Promise<string | null> => {
    const names = Object.keys(sizes) as Size[];
    let blobs: Blob[];
    try {
        blobs = await Promise.all(names.map(size => resizeImage(file, sizes[size], {square})));
    } catch {
        return "Format d'image non pris en charge, essayez JPEG ou PNG.";
    }

    const supabase = createClient();
    const uploads = await Promise.all(names.map((size, index) =>
        supabase.storage.from(bucket).upload(path(size), blobs[index], {
            upsert: true,
            contentType: blobs[index].type,
            // The URL changes with each new picture (?v=), so it can be cached for a year.
            cacheControl: '31536000',
        })
    ));
    const failed = uploads.find(upload => upload.error);
    if(failed){
        console.log(failed.error);
        return "L'image n'a pas pu être envoyée. Réessayez ou contactez un administrateur";
    }
    return null;
}
