import Link from "next/link"
import { cn } from "@/lib/utils"
import { categoryStyle, visibleMechanics } from "@/app/model/category"
import { CategoryBadge } from "@/components/category-badge"
import { MechanicBadge } from "@/components/mechanic-badge"
import { GameMeta } from "./game-meta"
import { type GameSummary } from "../lib/get-games"

// Only shown to the authors (and admins): public lists only contain approved games.
const statusBadges = {
    pending: { label: "En attente de validation", className: "bg-orange-100 text-orange-800" },
    rejected: { label: "Refusé · à corriger", className: "bg-red-100 text-red-700" },
}

/**
 * Clickable game card used in the games grid, on the home page and on author pages.
 */
export const GameCard = ({game}: {game: GameSummary}) => {
    const authors = game.authors.map(({author}) => `${author.first_name} ${author.last_name}`).join(', ');
    const mechanics = visibleMechanics(game.mechanics);

    return (
        <Link
            href={`/games/${game.slug}`}
            // Left border in the category color, to spot the categories at a glance.
            style={categoryStyle(game.category?.color)}
            className="group flex w-full flex-col overflow-hidden rounded-xl border border-l-4 border-gray-200 border-l-(--category) bg-white shadow transition-all duration-200 hover:-translate-y-2 hover:border-primary hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
            <div className="flex h-50 items-center justify-center bg-placeholder" aria-hidden>
                <span className="text-5xl opacity-60 transition-transform group-hover:scale-110">🎲</span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                {game.status !== 'approved' && (
                    <span className={cn("self-start rounded-full px-2.5 py-0.5 text-xs font-semibold", statusBadges[game.status].className)}>
                        {statusBadges[game.status].label}
                    </span>
                )}
                {game.category && <CategoryBadge name={game.category.name} color={game.category.color} className="self-start"/>}
                <h2 className="truncate text-lg font-bold text-brand-dark md:text-xl">{game.name}</h2>
                {authors && <p className="truncate text-sm text-primary">par {authors}</p>}
                <p className="line-clamp-2 text-sm text-gray-700">{game.description}</p>
                {mechanics.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Mécaniques">
                        {mechanics.slice(0, 3).map(({id, name}) => <li key={id}><MechanicBadge>{name}</MechanicBadge></li>)}
                        {mechanics.length > 3 && <li><MechanicBadge className="text-gray-500">+{mechanics.length - 3}</MechanicBadge></li>}
                    </ul>
                )}
                <GameMeta game={game} className="mt-auto flex flex-wrap gap-2 pt-2"/>
            </div>
        </Link>
    )
}
