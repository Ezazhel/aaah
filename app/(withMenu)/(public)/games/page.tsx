import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { requireUser } from "@/lib/route_requires";
import { GameCard } from "./components/game-card";
import { GetGames } from "./lib/get-games";

export const metadata: Metadata = { title: "Jeux" };

export default async function Games() {
  const [games, isLoggedIn] = await Promise.all([GetGames(), requireUser()]);

  return (
    <>
      <PageHeader
        title="Les jeux"
        subtitle="Les créations et prototypes des auteur·ices de l'association."
        actions={isLoggedIn && <Link href="/games/new" className={buttonVariants({ size: "lg" })}><Plus/> Nouveau jeu</Link>}
      />
      <Container className="py-12">
        {games.length ? (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => <li key={game.id} className="flex"><GameCard game={game}/></li>)}
          </ul>
        ) : (
          <SectionCard className="text-center text-gray-600">Aucun jeu pour le moment.</SectionCard>
        )}
      </Container>
    </>
  );
}
