import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/route_requires";
import { GameMeta } from "@/app/(withMenu)/(public)/games/components/game-meta";
import { GetPendingGames } from "./lib/get-pending-games";
import { ReviewForm } from "./components/review-form";

export const metadata: Metadata = { title: "Validation des jeux" };

export default async function ValidationPage() {
    await requireAdmin();
    const games = await GetPendingGames();

    return (<>
        <PageHeader title="Validation des jeux" subtitle="Les jeux proposés n'apparaissent sur le site qu'une fois validés."/>
        <Container className="flex max-w-6xl flex-col gap-6 py-10">
            {games.length === 0 && (
                <p className="rounded-xl bg-white/90 p-6 text-center text-gray-600 shadow">Aucun jeu en attente de validation.</p>
            )}
            {games.map((game) => (
                <article key={game.id} className="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow md:flex-row md:justify-between">
                    <div className="flex min-w-0 flex-col gap-2 md:w-2/3">
                        <h2 className="text-2xl font-bold break-words text-brand-dark">
                            <Link href={`/games/${game.slug}`} className="hover:underline">{game.name}</Link>
                        </h2>
                        {game.authors.length > 0 && (
                            <p className="text-sm text-gray-600">
                                par {game.authors.map(({author}) => `${author.first_name ?? ''} ${author.last_name ?? ''}`.trim()).join(', ')}
                            </p>
                        )}
                        <GameMeta game={game}/>
                        <p className="line-clamp-3 whitespace-pre-line text-gray-800">{game.description}</p>
                    </div>
                    <div className="md:w-1/3">
                        <ReviewForm gameId={game.id}/>
                    </div>
                </article>
            ))}
        </Container>
    </>)
}
