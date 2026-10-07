export const AVATAR_BUCKET = "avatars";

/**
 * Square picture sizes stored for each author (2x the largest display size):
 * sm for lists and cards (up to 120px), lg for the author page (up to 200px).
 */
export const AVATAR_SIZES = { sm: 256, lg: 512 } as const;

export type AvatarSize = keyof typeof AVATAR_SIZES;

/**
 * Path inside the bucket: one folder per author, used by the storage policies.
 * No extension: the file is WebP, or JPEG on browsers that cannot encode WebP (Safari).
 */
export const avatarPath = (authorId: string, size: AvatarSize) => `${authorId}/${size}`;

/**
 * Public URL of an avatar, or null when the author has none.
 * The path never changes, so `?v=` makes the browser load a replaced picture.
 */
export const avatarUrl = (authorId: string, updatedAt: string | null, size: AvatarSize) =>
    updatedAt
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${AVATAR_BUCKET}/${avatarPath(authorId, size)}?v=${Date.parse(updatedAt)}`
        : null;

/**
 * Browser only: crops the picture to a centered square and encodes it as WebP (JPEG as a fallback).
 * Throws when the browser cannot decode the file (e.g. HEIC outside Safari).
 */
export const resizeToSquare = async (file: File, size: number): Promise<Blob> => {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const side = Math.min(bitmap.width, bitmap.height);
    // Never upscale a small picture.
    const target = Math.min(size, side);

    const canvas = document.createElement("canvas");
    canvas.width = target;
    canvas.height = target;
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Canvas 2D not supported");
    }
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, target, target);
    bitmap.close();

    const webp = await toBlob(canvas, "image/webp");
    // Browsers that cannot encode WebP silently return a PNG instead.
    return webp.type === "image/webp" ? webp : toBlob(canvas, "image/jpeg");
};

const toBlob = (canvas: HTMLCanvasElement, type: string) =>
    new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error(`${type} encoding failed`))), type, 0.85);
    });
