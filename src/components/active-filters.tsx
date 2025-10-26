import React from "react";
import { X } from "lucide-react";
import type {
  GameFilters,
  GameCategory
} from "../types/filters";
import {
  DEFAULT_GAME_FILTERS,
  CATEGORY_LABELS
} from "../types/filters";

interface ActiveFiltersProps {
  filters: GameFilters;
  onRemoveFilter: (type: string, value?: string) => void;
  onClearAll?: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const tags: React.ReactNode[] = [];

  // Search filter
  if (filters.search && filters.search !== DEFAULT_GAME_FILTERS.search) {
    tags.push(
      <span
        key="search"
        className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium mr-2 mb-2"
      >
        Recherche: "{filters.search}"
        <button
          className="ml-2 text-orange-500 hover:text-orange-700 focus:outline-none"
          onClick={() => onRemoveFilter("search")}
          aria-label="Retirer le filtre de recherche"
          type="button"
        >
          <X size={14} />
        </button>
      </span>
    );
  }

  // Category filter
  if (filters.category && filters.category !== DEFAULT_GAME_FILTERS.category) {
    tags.push(
      <span
        key="category"
        className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium mr-2 mb-2"
      >
        {CATEGORY_LABELS[filters.category as GameCategory] || filters.category}
        <button
          className="ml-2 text-orange-500 hover:text-orange-700 focus:outline-none"
          onClick={() => onRemoveFilter("category")}
          aria-label="Retirer le filtre catégorie"
          type="button"
        >
          <X size={14} />
        </button>
      </span>
    );
  }

  // Mechanics filter
  if (Array.isArray(filters.mechanics) && filters.mechanics.length > 0) {
    filters.mechanics.forEach((mech) => {
      tags.push(
        <span
          key={`mech-${mech}`}
          className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium mr-2 mb-2"
        >
          {mech}
          <button
            className="ml-2 text-orange-500 hover:text-orange-700 focus:outline-none"
            onClick={() => onRemoveFilter("mechanics", mech)}
            aria-label={`Retirer la mécanique ${mech}`}
            type="button"
          >
            <X size={14} />
          </button>
        </span>
      );
    });
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center mt-3 mb-2">
      {tags}
      {onClearAll && (
        <button
          type="button"
          className="ml-2 mb-2 px-3 py-1 rounded-full bg-blue-200 text-blue-800 text-xs font-medium hover:bg-blue-300 transition focus:outline-none"
          onClick={onClearAll}
        >
          Effacer tout
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;
