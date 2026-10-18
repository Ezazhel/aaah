import { publicStorageUrl } from "./image";

export const GAME_RULES_BUCKET = "game-rules";

/** Same limit as the bucket. */
export const GAME_RULES_MAX_BYTES = 10 * 1024 * 1024;

/**
 * Path inside the bucket: one folder per game, used by the storage policies.
 * A new version overwrites the file, its date (rules_updated_at) changes the URL.
 */
export const gameRulesPath = (gameId: string) => `${gameId}/rules.pdf`;

/** Public URL of the rules PDF (opened by the browser's own viewer), or null when the game has none. */
export const gameRulesUrl = (gameId: string, updatedAt: string | null) =>
    publicStorageUrl(GAME_RULES_BUCKET, gameRulesPath(gameId), updatedAt);

/**
 * Same file, sent as an attachment by Storage: the `download` attribute
 * of a link is ignored for another origin.
 */
export const gameRulesDownloadUrl = (url: string, slug: string) =>
    `${url}&download=${encodeURIComponent(`regles-${slug}.pdf`)}`;

/** "13 octobre 2026": shown with the PDF so players can tell a new version. */
export const formatRulesDate = (value: string) =>
    new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(new Date(value));
