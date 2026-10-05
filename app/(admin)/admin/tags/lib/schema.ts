import { z } from "zod";
import { mechanicNameSchema } from "@/app/(withMenu)/(member)/games/lib/schema";

export { mechanicNameSchema };

export const categorySchema = z.object({
    name: z.string().trim().min(2, "Le nom est trop court.").max(40, "Le nom ne peut pas dépasser 40 caractères."),
    // Same rule as the categories_color_check constraint.
    color: z.string().toLowerCase().regex(/^#[0-9a-f]{6}$/, "Couleur invalide."),
});

export type CategoryInput = z.infer<typeof categorySchema>;
