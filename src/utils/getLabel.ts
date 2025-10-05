/**
 * Generic function to retrieve a label from a mapping object.
 * @param mapping - The mapping object (e.g., MEMBER_ROLES, GAME_CATEGORIES, etc.)
 * @param key - The key to look up in the mapping.
 * @param fallback - Optional fallback value if key is not found. Defaults to 'N/A'.
 * @returns The label or the fallback value.
 */
export function getLabel<T extends Record<string, any>>(
  mapping: T,
  key: keyof T | string,
  fallback: string = 'N/A'
): any {
  if (Object.prototype.hasOwnProperty.call(mapping, key)) {
    return mapping[key];
  }
  return fallback;
}
