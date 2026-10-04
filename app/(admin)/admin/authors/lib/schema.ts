import { z } from "zod";

// Same rule as the membership_settings_valid_day constraint: a date that exists every year.
const daysInMonth = (month: number) => month === 2 ? 28 : [4, 6, 9, 11].includes(month) ? 30 : 31;

export const membershipStartSchema = z.object({
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1),
}).refine(({month, day}) => day <= daysInMonth(month), {
    message: "Cette date n'existe pas tous les ans",
    path: ['day'],
});

export type MembershipStartInput = z.infer<typeof membershipStartSchema>;
