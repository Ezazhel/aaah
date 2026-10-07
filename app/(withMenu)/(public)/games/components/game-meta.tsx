import { Cake, Clock, Users } from "lucide-react"
import { MetaChip } from "@/components/meta-chip"

type GameMetaProps = {
    game: {
        min_players: number;
        max_players: number;
        min_time_minutes: number;
        max_time_minutes: number;
        age_threshold: number;
    };
    className?: string;
}

const range = (min: number, max: number) => min === max ? `${min}` : `${min}-${max}`;

// In a container narrower than 24rem (narrow game card): icon and numbers only, without the
// chip background; units stay for screen readers. Without a container ancestor, full chips.
const compactChip = "@max-sm:gap-0.5 @max-sm:bg-transparent @max-sm:p-0 @max-sm:[&>svg]:size-3";
const compactUnit = "@max-sm:sr-only";

/**
 * Players, duration and age chips of a game.
 */
export const GameMeta = ({game, className}: GameMetaProps) => (
    <div className={className ?? "flex flex-wrap gap-2"}>
        <MetaChip icon={Users} className={compactChip}>
            {range(game.min_players, game.max_players)}<span className={compactUnit}> joueur{game.max_players > 1 ? 's' : ''}</span>
        </MetaChip>
        <MetaChip icon={Clock} className={compactChip}>
            {range(game.min_time_minutes, game.max_time_minutes)}<span className={compactUnit}> min</span>
        </MetaChip>
        <MetaChip icon={Cake} className={compactChip}>
            {game.age_threshold}+<span className={compactUnit}> ans</span>
        </MetaChip>
    </div>
)
