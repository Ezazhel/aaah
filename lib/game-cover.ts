import { publicStorageUrl } from "./image";

export const GAME_COVER_BUCKET = "game-covers";

/**
 * Longest side of the stored covers (2x the display size, never cropped):
 * sm for the square of the game cards (up to ~200px), lg for the game page (~560x320).
 */
export const GAME_COVER_SIZES = { sm: 400, lg: 1200 } as const;

export type GameCoverSize = keyof typeof GAME_COVER_SIZES;

/**
 * Path inside the bucket: one folder per game, used by the storage policies.
 * No extension: the file is WebP, or JPEG on browsers that cannot encode WebP (Safari).
 */
export const gameCoverPath = (gameId: string, size: GameCoverSize) => `${gameId}/${size}`;

/** Public URL of a game cover, or null when the game has none. */
export const gameCoverUrl = (gameId: string, updatedAt: string | null, size: GameCoverSize) =>
    publicStorageUrl(GAME_COVER_BUCKET, gameCoverPath(gameId, size), updatedAt);
