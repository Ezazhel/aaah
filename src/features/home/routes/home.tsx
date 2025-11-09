import { Hero } from "../components/hero";
import { Stats } from "../components/stats";
import { GameCard } from "@/features/games/components/game-card";
import { useFeaturedGames } from "@/features/games/api/get-games";

export default function Home() {
  // Dummy data for Stats
  const statsData = {
    authors: 42,
    prototypes: 87,
    publishedGames: 0, // Not used in MVP but required by StatsProps
  };

  // Fetch the last 3 created games (prototypes récents)
  const {
    data: gamesResponse,
    isLoading: gamesLoading,
    error: gamesError,
  } = useFeaturedGames();

  const recentGames = gamesResponse?.data ?? [];

  return (
    <div className="bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)]">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Qui sommes-nous ? */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[oklch(36%_0.13_250)] mb-12">
            Qui sommes-nous ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                Notre association rassemble des passionnés de jeux de société, qu’ils soient auteurs débutants ou confirmés, pour partager, créer et s’entraider.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-xs aspect-square bg-gray-200 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-6xl text-gray-400">🎲</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats */}
      <div className="py-10">
        <Stats {...statsData} />
      </div>

      {/* 4. Prototypes récents */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[oklch(36%_0.13_250)] mb-12">
            Prototypes récents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gamesLoading && (
              <>
                <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
              </>
            )}
            {gamesError && (
              <div className="col-span-3 text-center text-red-500">
                Erreur lors du chargement des prototypes.
              </div>
            )}
            {!gamesLoading &&
              !gamesError &&
              recentGames.map((game) => (
                <GameCard key={game.id} variant="featured" game={game} />
              ))}
          </div>
        </div>
      </section>

      {/* MVP: Articles et événements masqués pour le MVP */}
    </div>
  );
}
