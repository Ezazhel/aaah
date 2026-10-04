import Link from "next/link";
import { H1 } from "@/components/typography";
import { GetGames } from "./lib/get-games";

export default async function Games() {
  const games = await GetGames();

  return (
    <>
      <H1>Jeux</H1>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/games/${game.slug}`}>{game.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
