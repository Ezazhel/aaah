// src/lib/getLabel.ts - Version améliorée

/**
 * Generic function to retrieve a label from a mapping object.
 * @param mapping - The mapping object (e.g., MEMBER_ROLES, GAME_CATEGORIES, etc.)
 * @param key - The key to look up in the mapping.
 * @param fallback - Optional fallback value if key is not found. Defaults to 'N/A'.
 * @returns The label string or the fallback value.
 */
export function getLabel<T extends Record<string, any>>(
  mapping: T,
  key: keyof T | string,
  fallback: string = 'N/A'
): string {
  const value = mapping[key];
  
  // Si la valeur est un objet avec une propriété 'label', retourner le label
  if (value && typeof value === 'object' && 'label' in value) {
    return value.label;
  }
  
  // Sinon retourner la valeur directement ou le fallback
  return value ?? fallback;
}

/**
 * Get the full object (label + description) from a mapping.
 * Useful when you need both label and description.
 */
export function getLabelObject<T extends Record<string, any>>(
  mapping: T,
  key: keyof T | string,
  fallback?: { label: string; description?: string }
): any {
  return mapping[key] ?? fallback;
}