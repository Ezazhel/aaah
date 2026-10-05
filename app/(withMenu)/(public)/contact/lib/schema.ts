import { z } from "zod";

export const contactSchema = z.object({
    first_name: z.string().trim().min(1, "Le prénom est obligatoire").max(50, "50 caractères maximum"),
    last_name: z.string().trim().min(1, "Le nom est obligatoire").max(50, "50 caractères maximum"),
    email: z.email("Adresse e-mail invalide"),
    subject: z.string().trim().min(3, "L'objet est trop court").max(120, "120 caractères maximum"),
    message: z.string().trim().min(10, "Le message est trop court").max(5000, "5000 caractères maximum"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
