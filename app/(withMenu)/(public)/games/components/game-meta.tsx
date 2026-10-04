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

/**
 * Players, duration and age chips of a game.
 */
export const GameMeta = ({game, className}: GameMetaProps) => (
    <div className={className ?? "flex flex-wrap gap-2"}>
        <MetaChip icon={Users}>{range(game.min_players, game.max_players)} joueur{game.max_players > 1 ? 's' : ''}</MetaChip>
        <MetaChip icon={Clock}>{range(game.min_time_minutes, game.max_time_minutes)} min</MetaChip>
        <MetaChip icon={Cake}>{game.age_threshold}+ ans</MetaChip>
    </div>
)
