import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { GetGame, IsGameAuthor } from "@/app/(withMenu)/(public)/games/lib/get-game";
import { GameForm } from "../../components/gameForm";
import { updateGame } from "../../lib/action";

export const metadata: Metadata = { title: "Modifier un jeu" };

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
        <PageHeader
            top={<Breadcrumb tone="light" items={[{label: "Jeux", href: "/games"}, {label: game.name, href: `/games/${game.slug}`}, {label: "Modifier"}]}/>}
            title={`Modifier ${game.name}`}
            subtitle="Mettez à jour les informations de votre jeu."
        />
        <Container className="max-w-6xl py-10">
            <GameForm
                action={updateGame.bind(null, game.id)}
                defaultValues={{ name, description, age_threshold, min_players, max_players, min_time_minutes, max_time_minutes }}
                submitLabel="Enregistrer"
                cancelHref={`/games/${game.slug}`}
            />
        </Container>
        </>
    )
}
