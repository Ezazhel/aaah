import type { CSSProperties } from "react";

export type Category = { id: number; name: string; color: string };
export type Mechanic = { id: number; name: string };

/**
 * Exposes the category color as the --category CSS variable.
 * Used with arbitrary Tailwind classes (bg-[color-mix(...var(--category)...)]) so no class is generated at runtime.
 */
export const categoryStyle = (color: string | null | undefined) =>
    ({ '--category': color ?? 'var(--color-gray-200)' }) as CSSProperties;

/**
 * Mechanics of a game visible by the current user: pending suggestions of other people
 * come back as null from the join (hidden by RLS).
 */
export const visibleMechanics = <T extends Mechanic>(links: { mechanic: T | null }[]) =>
    links.map(({ mechanic }) => mechanic).filter((mechanic): mechanic is T => mechanic !== null)
        .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
