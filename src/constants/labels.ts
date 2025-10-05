/**
 * Mappage des rôles de membres aux libellés français.
 */
export const MEMBER_ROLES = {
  member: 'Membre',
  honorific: "Membre d'honneur",
  admin: 'Administrateur',
  president: 'Président(e)',
  treasurer: 'Trésorier(ère)',
  secretary: 'Secrétaire',
} as const;

export type MemberRole = keyof typeof MEMBER_ROLES;

/**
 * Mappage des catégories de jeux aux libellés et descriptions en français.
 */
export const GAME_CATEGORIES = {
  familial: { label: 'Familial', description: 'Accessible à tous' },
  initie: { label: 'Initié', description: 'Pour joueurs expérimentés' },
  expert: { label: 'Expert', description: 'Pour joueurs confirmés' },
} as const;

export type GameCategory = keyof typeof GAME_CATEGORIES;

/**
 * Mappage des types d'événements aux libellés français.
 */
export const EVENT_TYPES = {
  association: "Événement de l'association",
  external: 'Événement externe',
} as const;

export type EventType = keyof typeof EVENT_TYPES;

/**
 * Mappage des statuts d'événements aux libellés français et couleurs associées.
 */
export const EVENT_STATUS = {
  upcoming: { label: 'À venir', color: 'blue' },
  ongoing: { label: 'En cours', color: 'green' },
  past: { label: 'Passé', color: 'gray' },
} as const;

export type EventStatus = keyof typeof EVENT_STATUS;
