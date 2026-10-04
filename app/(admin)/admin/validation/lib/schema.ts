import { z } from "zod";

// Same rule as the game_reviews_reason_required constraint: a rejection must say why.
export const reviewSchema = z.discriminatedUnion('decision', [
    z.object({ gameId: z.uuid(), decision: z.literal('approved') }),
    z.object({ gameId: z.uuid(), decision: z.literal('rejected'), reason: z.string().trim().min(1, "Indiquez la raison du refus") }),
]);

export type ReviewInput = z.infer<typeof reviewSchema>;
