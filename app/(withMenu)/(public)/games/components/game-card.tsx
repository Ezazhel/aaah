import Link from "next/link"
import { cn } from "@/lib/utils"
import { categoryStyle, visibleMechanics } from "@/app/model/category"
import { CategoryBadge } from "@/components/category-badge"
import { MechanicBadge } from "@/components/mechanic-badge"
import { GameCover } from "@/components/game-cover"
import { GameMeta } from "./game-meta"
import { type GameSummary } from "../lib/get-games"

// Only shown to the authors (and admins): public lists only contain approved games.
const statusBadges = {
    pending: { label: "En attente de validation", className: "bg-orange-100 text-orange-800" },
    rejected: { label: "Refusé · à corriger", className: "bg-red-100 text-red-700" },
}

/**
 * Clickable game card used in the games grid, on the home page and on author pages.
 * Laid out from its own width (container queries), since the grid decides its size:
 * narrow (< 24rem): square cover above short details; wider: square cover on the left, details on the right.
 */
export const GameCard = ({game}: {game: GameSummary}) => {
    const authors = game.authors.map(({author}) => `${author.first_name} ${author.last_name}`).join(', ');
    const mechanics = visibleMechanics(game.mechanics);

    return (
        <Link
            href={`/games/${game.slug}`}
            // Left border in the category color, to spot the categories at a glance; the whole border on hover.
            style={categoryStyle(game.category?.color)}
            className="group @container flex w-full overflow-hidden rounded-xl border border-l-4 border-gray-200 border-l-(--category) bg-white shadow transition-all duration-200 hover:-translate-y-2 hover:border-(--category) hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
            {/* A container cannot query itself: the layout lives in this child. */}
            <div className="flex w-full flex-col @sm:flex-row @sm:gap-4 @sm:p-4">
                <GameCover
                    gameId={game.id}
                    coverUpdatedAt={game.cover_updated_at}
                    size="sm"
                    fit="cover"
                    className="aspect-square shrink-0 @sm:w-40 @sm:self-start @sm:rounded-lg"
                    diceClassName="text-4xl transition-transform group-hover:scale-110 @sm:text-5xl"
                    imageClassName="transition-transform duration-200 group-hover:scale-105"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 @sm:gap-2 @sm:p-0">
                    {game.status !== 'approved' && (
                        <span className={cn("max-w-full self-start truncate rounded-full px-2.5 py-0.5 text-xs font-semibold", statusBadges[game.status].className)}>
                            {statusBadges[game.status].label}
                        </span>
                    )}
                    {game.category && <CategoryBadge name={game.category.name} color={game.category.color} className="self-start"/>}
                    <h2 className="truncate text-base font-bold text-brand-dark @sm:text-lg @lg:text-xl">{game.name}</h2>
                    {authors && <p className="truncate text-xs text-primary @sm:text-sm">par {authors}</p>}
                    <p className="line-clamp-2 text-xs text-gray-700 @sm:text-sm">{game.description}</p>
                    {/* Too wide for the narrow cards. */}
                    {mechanics.length > 0 && (
                        <ul className="hidden flex-wrap gap-1.5 @sm:flex" aria-label="Mécaniques">
                            {mechanics.slice(0, 3).map(({id, name}) => <li key={id}><MechanicBadge>{name}</MechanicBadge></li>)}
                            {mechanics.length > 3 && <li><MechanicBadge className="text-gray-500">+{mechanics.length - 3}</MechanicBadge></li>}
                        </ul>
                    )}
                    <GameMeta game={game} className="mt-auto flex flex-wrap gap-x-1.5 gap-y-1 pt-1 @sm:gap-2"/>
                </div>
            </div>
        </Link>
    )
}

/**
 * Grid of game cards. Mobile: 2 narrow cards per row.
 * From sm: RAM pattern (repeat, auto-fill, minmax), as many 24rem+ columns as fit,
 * so the cards switch to their wide layout. auto-fill keeps a lone card from stretching full width.
 */
export const GameGrid = ({games, className}: {games: GameSummary[]; className?: string}) => (
    <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,24rem),1fr))] sm:gap-6", className)}>
        {games.map(game => <li key={game.id} className="flex"><GameCard game={game}/></li>)}
    </ul>
)
