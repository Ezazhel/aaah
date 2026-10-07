/**
 * Public URL of a file in a public Storage bucket, or null when there is no file.
 * The paths never change, so `?v=` makes the browser load a replaced file.
 */
export const publicStorageUrl = (bucket: string, path: string, updatedAt: string | null) =>
    updatedAt
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}?v=${Date.parse(updatedAt)}`
        : null;

/**
 * Browser only: shrinks the picture so its longest side is at most `maxSide`
 * (never upscales), optionally cropped to a centered square.
 * Encodes it as WebP, or JPEG on browsers that cannot encode WebP (Safari).
 * Throws when the browser cannot decode the file (e.g. HEIC outside Safari).
 */
export const resizeImage = async (file: File, maxSide: number, {square = false}: {square?: boolean} = {}): Promise<Blob> => {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    // Source area: the whole picture, or its centered square.
    const sourceWidth = square ? Math.min(bitmap.width, bitmap.height) : bitmap.width;
    const sourceHeight = square ? sourceWidth : bitmap.height;
    const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sourceWidth * scale);
    canvas.height = Math.round(sourceHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Canvas 2D not supported");
    }
    context.imageSmoothingQuality = "high";
    context.drawImage(
        bitmap,
        (bitmap.width - sourceWidth) / 2, (bitmap.height - sourceHeight) / 2, sourceWidth, sourceHeight,
        0, 0, canvas.width, canvas.height,
    );
    bitmap.close();

    const webp = await toBlob(canvas, "image/webp");
    // Browsers that cannot encode WebP silently return a PNG instead.
    return webp.type === "image/webp" ? webp : toBlob(canvas, "image/jpeg");
};

const toBlob = (canvas: HTMLCanvasElement, type: string) =>
    new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error(`${type} encoding failed`))), type, 0.85);
    });
