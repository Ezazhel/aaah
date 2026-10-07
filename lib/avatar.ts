import { publicStorageUrl } from "./image";

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

/** Public URL of an avatar, or null when the author has none. */
export const avatarUrl = (authorId: string, updatedAt: string | null, size: AvatarSize) =>
    publicStorageUrl(AVATAR_BUCKET, avatarPath(authorId, size), updatedAt);
