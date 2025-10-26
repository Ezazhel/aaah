import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { GameCard } from "../components/game-card";
import { FilterDrawer } from "@/components/filter-drawer";
import { ActiveFilters } from "@/components/active-filters";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import type { GameFilters } from "@/types/filters";
import { DEFAULT_GAME_FILTERS } from "@/types/filters";
import { useGames } from "../api/get-games";


export default function Games() {
  // Data fetching
  const { data: gamesResponse, isLoading, error } = useGames();
  const games = gamesResponse?.data || [];

  // Filter state
  const [filters, setFilters] = useState<GameFilters>(DEFAULT_GAME_FILTERS);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filtering logic
  const filteredGames = games.filter((game) => {
    // Search filter
    const matchesSearch = filters.search
      ? game.name.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    // Category filter
    const matchesCategory = filters.category
      ? game.category === filters.category
      : true;
    // Mechanics filter
    const matchesMechanics =
      filters.mechanics.length > 0
        ? filters.mechanics.every((mech) => game.mechanics.includes(mech))
        : true;
    return matchesSearch && matchesCategory && matchesMechanics;
  });

  // Count active filters
  function countActiveFilters() {
    let count = 0;
    if (filters.search && filters.search !== DEFAULT_GAME_FILTERS.search) count++;
    if (filters.category && filters.category !== DEFAULT_GAME_FILTERS.category) count++;
    if (Array.isArray(filters.mechanics) && filters.mechanics.length > 0)
      count += filters.mechanics.length;
    return count;
  }

  // Remove a single filter
  function handleRemoveFilter(type: string, value?: string) {
    if (type === "search") {
      setFilters((prev) => ({ ...prev, search: "" }));
    } else if (type === "category") {
      setFilters((prev) => ({ ...prev, category: "" }));
    } else if (type === "mechanics" && value) {
      setFilters((prev) => ({
        ...prev,
        mechanics: prev.mechanics.filter((m) => m !== value),
      }));
    }
  }

  // Clear all filters
  function handleClearAll() {
    setFilters(DEFAULT_GAME_FILTERS);
  }

  // Loading state
  if (isLoading) {
    return (
      <LoadingSpinner 
        fullScreen 
        message="Chargement des prototypes…" 
        size="lg"
      />
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage 
        fullScreen
        title="Erreur de chargement"
        message="Impossible de charger les prototypes. Veuillez réessayer."
        onRetry={() => window.location.reload()}
        retryLabel="Recharger la page"
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-center text-[oklch(36%_0.13_250)] mb-4">
          Prototypes de Jeux
        </h1>
        <p className="text-lg md:text-xl text-center text-gray-600 mb-10">
          Découvrez et filtrez les prototypes créés par nos membres
        </p>

        {/* Filter Button */}
        <div className="flex justify-center md:justify-end mb-2">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center px-5 py-2 rounded-lg bg-[oklch(69%_0.19_41)] text-white font-semibold shadow hover:bg-[oklch(69%_0.19_41)]/80 transition focus:outline-none focus:ring-2 focus:ring-[oklch(69%_0.19_41)]"
          >
            <SlidersHorizontal className="mr-2" size={20} /> Filtres
            {countActiveFilters() > 0 && (
              <>
                <span className="ml-3 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-white text-[oklch(69%_0.19_41)]/90">
                  {countActiveFilters()}
                </span>
                {/* Orange dot indicator */}
                <span className="absolute top-1 right-1 block w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
              </>
            )}
          </button>
        </div>

         {/* Active filter tags */}
         <ActiveFilters
           filters={filters}
           onRemoveFilter={handleRemoveFilter}
           onClearAll={handleClearAll}
         />

         {/* Filter Drawer */}
         <FilterDrawer
           isOpen={isDrawerOpen}
           onClose={() => setIsDrawerOpen(false)}
           filters={filters}
           onFiltersChange={(newFilters: GameFilters) => setFilters(newFilters)}
         />

        {/* Games grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredGames.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-12">
              Aucun prototype ne correspond à vos filtres.
            </div>
          ) : (
            filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
