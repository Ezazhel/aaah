import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { Alert } from "@/components/alert";
import { GetGame, GetLastReview, IsGameAuthor } from "@/app/(withMenu)/(public)/games/lib/get-game";
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

    const lastReview = game.status === 'rejected' ? await GetLastReview(game.id) : null;

    const { name, description, age_threshold, min_players, max_players, min_time_minutes, max_time_minutes } = game;

    return (<>
        <PageHeader
            top={<Breadcrumb tone="light" items={[{label: "Jeux", href: "/games"}, {label: game.name, href: `/games/${game.slug}`}, {label: "Modifier"}]}/>}
            title={`Modifier ${game.name}`}
            subtitle="Mettez à jour les informations de votre jeu."
        />
        <Container className="flex max-w-6xl flex-col gap-6 py-10">
            {game.status === 'rejected' && (
                <Alert>
                    <p className="font-semibold">Ce jeu a été refusé.</p>
                    {lastReview?.reason && <p className="mt-1 whitespace-pre-line">Raison : {lastReview.reason}</p>}
                    <p className="mt-1">En enregistrant vos corrections, il repassera automatiquement en attente de validation.</p>
                </Alert>
            )}
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
