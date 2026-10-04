import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionCard } from "@/components/section-card";
import { H2, P } from "@/components/typography";
import { GameCard } from "./games/components/game-card";
import { GetGames } from "./games/lib/get-games";

export default async function Home() {
  const games = await GetGames(3);

  return (
    <>
      <section className="bg-hero px-4 py-16 text-center text-white md:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <h1 className="mb-4 text-3xl font-extrabold drop-shadow-lg md:text-5xl">Créateurs de Jeux Passionnés</h1>
          <p className="mb-8 text-lg font-medium md:text-2xl">
            Les auteur·ices de jeux de société autour et en Hérault, et leurs créations.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/games" className={buttonVariants({ size: "lg" })}>Découvrir les jeux</Link>
            <Link href="/authors" className={buttonVariants({ variant: "hero-outline", size: "lg" })}>Nos auteur·ices</Link>
          </div>
        </div>
      </section>

      <Container className="flex flex-col gap-12 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <SectionCard title="Présentation">
            <P>Présentation de l&apos;association à venir.</P>
          </SectionCard>
          <SectionCard title="Missions">
            <P>Les missions de l&apos;association à venir.</P>
          </SectionCard>
          <SectionCard title="Pourquoi adhérer ?">
            <P>Les avantages de l&apos;adhésion à venir.</P>
          </SectionCard>
        </div>

        {games.length > 0 && (
          <section className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <H2 className="text-3xl md:text-4xl">Quelques jeux</H2>
              <Link href="/games" className={buttonVariants({ variant: "outline" })}>Voir tous les jeux</Link>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {games.map(game => <GameCard key={game.id} game={game}/>)}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
