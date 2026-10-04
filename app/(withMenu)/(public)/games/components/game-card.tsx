import Link from "next/link"
import { GameMeta } from "./game-meta"
import { type GameSummary } from "../lib/get-games"

/**
 * Clickable game card used in the games grid, on the home page and on author pages.
 */
export const GameCard = ({game}: {game: GameSummary}) => {
    const authors = game.authors.map(({author}) => `${author.first_name} ${author.last_name}`).join(', ');

    return (
        <Link
            href={`/games/${game.slug}`}
            className="group flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow transition-all duration-200 hover:-translate-y-2 hover:border-primary hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
            <div className="flex h-50 items-center justify-center bg-placeholder" aria-hidden>
                <span className="text-5xl opacity-60 transition-transform group-hover:scale-110">🎲</span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <h2 className="truncate text-lg font-bold text-brand-dark md:text-xl">{game.name}</h2>
                {authors && <p className="truncate text-sm text-primary">par {authors}</p>}
                <p className="line-clamp-2 text-sm text-gray-700">{game.description}</p>
                <GameMeta game={game} className="mt-auto flex flex-wrap gap-2 pt-2"/>
            </div>
        </Link>
    )
}
