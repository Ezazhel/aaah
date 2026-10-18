import { z } from "zod";

/**
 * Filters of the games list, stored in the URL so a filtered list can be shared or reloaded:
 * ?category=1,2&mechanic=3,4&players=4&duration=60&age=8
 */
export type GameFilters = {
    categories: number[];
    mechanics: number[];
    // Games playable with this number of players (min_players <= n <= max_players).
    players?: number;
    // Games lasting at most this many minutes (max_time_minutes).
    duration?: number;
    // Games suited to this age (age_threshold <= age).
    age?: number;
}

type SearchParams = Record<string, string | string[] | undefined>;

const positiveInt = z.coerce.number().int().positive();

// Repeated params (?category=1&category=2) and comma lists (?category=1,2) both work.
const values = (param: string | string[] | undefined) =>
    [param ?? []].flat().flatMap((value) => value.split(','));

// Invalid values are dropped: a hand-edited URL shows more games, never an error.
const ids = (param: string | string[] | undefined) => [...new Set(
    values(param).map((value) => positiveInt.safeParse(value).data).filter((id) => id !== undefined),
)];

const number = (param: string | string[] | undefined) => positiveInt.safeParse(values(param)[0]).data;

export const parseGameFilters = (searchParams: SearchParams): GameFilters => ({
    categories: ids(searchParams.category),
    mechanics: ids(searchParams.mechanic),
    players: number(searchParams.players),
    duration: number(searchParams.duration),
    age: number(searchParams.age),
});

export const toSearchParams = ({categories, mechanics, players, duration, age}: GameFilters) => {
    const params = new URLSearchParams();
    if(categories.length) params.set('category', categories.join(','));
    if(mechanics.length) params.set('mechanic', mechanics.join(','));
    if(players) params.set('players', `${players}`);
    if(duration) params.set('duration', `${duration}`);
    if(age) params.set('age', `${age}`);
    return params;
}

export const countActiveFilters = ({categories, mechanics, players, duration, age}: GameFilters) =>
    categories.length + mechanics.length + [players, duration, age].filter(Boolean).length;
