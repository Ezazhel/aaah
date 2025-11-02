// Shared types for filtering system

export type GameCategory = 'familial' | 'initie' | 'expert';

export interface CategoryOption {
  value: GameCategory | '';
  label: string;
}

// Filters used in Games.tsx (simplified version)
export interface GameFilters {
  search: string;
  category: GameCategory | '';
  mechanics: string[]; // Mechanic names as strings for filtering
}

// Extended filters used in FilterDrawer and ActiveFilters (with player/duration ranges)
export interface ExtendedGameFilters extends GameFilters {
  minPlayers: number;
  maxPlayers: number;
  minDuration: number;
  maxDuration: number;
}

export const CATEGORIES: CategoryOption[] = [
  { value: 'familial', label: 'Familial' },
  { value: 'initie', label: 'Initié' },
  { value: 'expert', label: 'Expert' },
];

export const CATEGORY_LABELS: Record<GameCategory, string> = {
  familial: 'Familial',
  initie: 'Initié',
  expert: 'Expert',
};

// Default filter values
export const DEFAULT_GAME_FILTERS: GameFilters = {
  search: '',
  category: '',
  mechanics: [],
};

export const DEFAULT_EXTENDED_FILTERS: ExtendedGameFilters = {
  ...DEFAULT_GAME_FILTERS,
  minPlayers: 1,
  maxPlayers: 6,
  minDuration: 15,
  maxDuration: 120,
};
