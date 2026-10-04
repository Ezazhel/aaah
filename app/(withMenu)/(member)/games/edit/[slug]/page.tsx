import { notFound, redirect } from "next/navigation";
import { H1 } from "@/components/typography";
import { GetGame, IsGameAuthor } from "@/app/(withMenu)/(public)/games/lib/get-game";
import { GameForm } from "../../components/gameForm";
import { updateGame } from "../../lib/action";

export default async function EditGame({params}: PageProps<"/games/edit/[slug]">) {
    const { slug } = await params;
    const game = await GetGame(slug);

    if(!game){
        notFound();
    }

    // Only the authors of the game can edit it (same rule as the RLS policy).
    if(!(await IsGameAuthor(game))){
        redirect(`/games/${game.slug}`);
    }

    const { name, description, age_threshold, min_players, max_players, min_time_minutes, max_time_minutes } = game;

    return (<>
        <H1>Modifier {game.name}</H1>
        <GameForm
            action={updateGame.bind(null, game.id)}
            defaultValues={{ name, description, age_threshold, min_players, max_players, min_time_minutes, max_time_minutes }}
            submitLabel="Enregistrer"
        />
        </>
    )
}
