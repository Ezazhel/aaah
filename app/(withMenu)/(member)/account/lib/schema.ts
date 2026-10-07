import { z } from "zod";

export const profileSchema = z.object({
    first_name: z.string().trim().min(1, "Le prénom est obligatoire").max(50, "50 caractères maximum"),
    last_name: z.string().trim().min(1, "Le nom est obligatoire").max(50, "50 caractères maximum"),
    description: z.string().trim().max(2000, "2000 caractères maximum"),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// The files are uploaded by the browser: the action only records the change.
export const avatarChangeSchema = z.enum(['updated', 'removed', 'unchanged']);

export type AvatarChange = z.infer<typeof avatarChangeSchema>;
