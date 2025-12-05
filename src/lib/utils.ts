import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import slugify from "slugify"

/**
 * Combine class names with Tailwind class merging
 * Permet de fusionner intelligemment les classes Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-safe slug from text
 * Génère un slug sécurisé pour les URLs à partir d'un texte
 *
 * @param text - The text to slugify
 * @returns A lowercase, URL-safe slug with special characters removed
 *
 * @example
 * generateSlug("Jean-Pierre Martin") // "jean-pierre-martin"
 * generateSlug("Café & Thé") // "cafe-the"
 */
export function generateSlug(text: string): string {
  return slugify(text, { lower: true, strict: true })
}

/**
 * Format author name from firstname and lastname
 * Formate le nom complet d'un auteur à partir du prénom et nom
 *
 * @param author - Object with firstname and lastname properties
 * @returns Full name string
 *
 * @example
 * formatAuthorName({ firstname: "Jean", lastname: "Martin" }) // "Jean Martin"
 */
export function formatAuthorName(author: { firstname: string; lastname: string }): string {
  return `${author.firstname} ${author.lastname}`.trim()
}