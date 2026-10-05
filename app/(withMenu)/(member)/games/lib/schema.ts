import { z } from "zod";

export const gameSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Le nom est obligatoire." })
      .max(100, { message: "Le nom ne peut pas dépasser 100 caractères." }),
    description: z
      .string()
      .trim()
      .min(1, { message: "La description est obligatoire." }),
    age_threshold: z
      .number({ message: "Indique un âge minimum." })
      .int({ message: "L'âge doit être un nombre entier." })
      .min(0, { message: "L'âge ne peut pas être négatif." }),
    min_players: z
      .number({ message: "Indique un nombre de joueurs." })
      .int({ message: "Le nombre de joueurs doit être un entier." })
      .positive({ message: "Il faut au moins 1 joueur." }),
    max_players: z
      .number({ message: "Indique un nombre de joueurs." })
      .int({ message: "Le nombre de joueurs doit être un entier." })
      .positive({ message: "Il faut au moins 1 joueur." }),
    min_time_minutes: z
      .number({ message: "Indique une durée en minutes." })
      .int({ message: "La durée doit être un nombre entier de minutes." })
      .positive({ message: "La durée doit être supérieure à 0." }),
    max_time_minutes: z
      .number({ message: "Indique une durée en minutes." })
      .int({ message: "La durée doit être un nombre entier de minutes." })
      .positive({ message: "La durée doit être supérieure à 0." }),
    category_id: z
      .number({ message: "Choisissez une catégorie." })
      .int({ message: "Choisissez une catégorie." }),
    mechanic_ids: z
      .array(z.number().int())
      .min(1, { message: "Choisissez au moins une mécanique." }),
  })
  // Same rules as the check constraints in the migration.
  .refine((game) => game.max_players >= game.min_players, {
    message: "Le maximum doit être supérieur ou égal au minimum.",
    path: ["max_players"],
  })
  .refine((game) => game.max_time_minutes >= game.min_time_minutes, {
    message: "La durée max doit être supérieure ou égale à la durée min.",
    path: ["max_time_minutes"],
  });

export type GameInput = z.infer<typeof gameSchema>;

export const mechanicNameSchema = z
  .string()
  .trim()
  .min(2, { message: "Le nom de la mécanique est trop court." })
  .max(80, { message: "Le nom de la mécanique ne peut pas dépasser 80 caractères." });
