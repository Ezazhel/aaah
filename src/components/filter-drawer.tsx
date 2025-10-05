import React, { useEffect, useRef, useState } from "react";
import type { 
  GameFilters 
} from "../types/filters";
import { 
  DEFAULT_GAME_FILTERS, 
  CATEGORIES, 
  MECHANICS 
} from "../types/filters";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: GameFilters;
  onFiltersChange: (filters: GameFilters) => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = useState<GameFilters>(filters);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Sync local state with incoming filters when opening
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, filters]);

  // Escape key closes drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handlers
  const handleChange = (field: keyof GameFilters, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMechanicToggle = (mech: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      mechanics: prev.mechanics.includes(mech as any)
        ? prev.mechanics.filter((m) => m !== mech)
        : [...prev.mechanics, mech as any],
    }));
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_GAME_FILTERS);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  // Animation classes
  const backdropClass = isOpen
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";
  const drawerClass = isOpen
    ? "translate-x-0"
    : "translate-x-full";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${backdropClass}`}
        aria-hidden={isOpen ? "false" : "true"}
        onClick={onClose}
        tabIndex={-1}
      />
      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-0 right-0 z-50 h-full
          w-full max-w-[400px] bg-white shadow-2xl
          flex flex-col
          transition-transform duration-300
          ${drawerClass}
          focus:outline-none
          md:rounded-l-xl
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Filtres"
        tabIndex={-1}
        style={{ width: "100vw", maxWidth: 400 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[oklch(36%_0.13_250)]" id="drawer-title">
            Filtres
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer les filtres"
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]"
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={localFilters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              placeholder="Nom du jeu..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]"
              aria-label="Recherche par nom de jeu"
            />
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]"
              aria-label="Catégorie"
            >
              <option value="">Toutes</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Mechanics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mécaniques
            </label>
            <div className="flex flex-wrap gap-2">
              {MECHANICS.map((mech) => (
                <button
                  key={mech}
                  type="button"
                  onClick={() => handleMechanicToggle(mech)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150
                    ${
                      localFilters.mechanics.includes(mech)
                        ? "bg-[oklch(69%_0.19_41)] text-white border-[oklch(69%_0.19_41)]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-[oklch(96%_0.01_250)]"
                    }
                    focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]
                  `}
                  aria-pressed={localFilters.mechanics.includes(mech)}
                >
                  {mech}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold bg-white hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-4 py-2 rounded-lg bg-[oklch(69%_0.19_41)] text-white font-semibold shadow hover:bg-[oklch(69%_0.19_41)]/80 transition focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]"
          >
            Appliquer
          </button>
        </div>
      </aside>
    </>
  );
};
