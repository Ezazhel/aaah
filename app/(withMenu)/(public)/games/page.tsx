import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { isActiveAuthor } from "@/lib/route_requires";
import { GameGrid } from "./components/game-card";
import { GamesFilterSheet } from "./components/games-filter-sheet";
import { countActiveFilters, parseGameFilters } from "./lib/filters";
import { GetGames } from "./lib/get-games";
import { GetTags } from "./lib/get-tags";

export const metadata: Metadata = { title: "Jeux" };

export default async function Games({ searchParams }: PageProps<'/games'>) {
  const filters = parseGameFilters(await searchParams);
  const [games, tags, canCreate] = await Promise.all([GetGames({ filters }), GetTags(), isActiveAuthor()]);
  const isFiltered = countActiveFilters(filters) > 0;

  return (
    <>
      <PageHeader
        title="Les jeux"
        subtitle="Les créations et prototypes des auteur·ices de l'association."
        actions={canCreate && <Link href="/games/new" className={buttonVariants({ size: "lg" })}><Plus/> Nouveau jeu</Link>}
      />
      <Container className="py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">{games.length} jeu{games.length > 1 ? 'x' : ''}</p>
          <GamesFilterSheet
            categories={tags.categories}
            // RLS also returns the user's own pending suggestions: no game can be approved with them.
            mechanics={tags.mechanics.filter(({status}) => status === 'approved')}
            filters={filters}
          />
        </div>
        {games.length ? (
          <GameGrid games={games}/>
        ) : isFiltered ? (
          <SectionCard className="flex flex-col items-center gap-4 text-center text-gray-600">
            Aucun jeu ne correspond à ces filtres.
            <Link href="/games" className={buttonVariants({ variant: "outline" })}>Effacer les filtres</Link>
          </SectionCard>
        ) : (
          <SectionCard className="text-center text-gray-600">Aucun jeu pour le moment.</SectionCard>
        )}
      </Container>
    </>
  );
}
