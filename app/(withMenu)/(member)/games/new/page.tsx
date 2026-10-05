import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { GameForm } from "../components/gameForm";
import { createGame } from "../lib/action";
import { GetTags } from "@/app/(withMenu)/(public)/games/lib/get-tags";

export const metadata: Metadata = { title: "Nouveau jeu" };

export default async function NewGame() {
    const tags = await GetTags();

    return (<>
        <PageHeader
            top={<Breadcrumb tone="light" items={[{label: "Jeux", href: "/games"}, {label: "Nouveau jeu"}]}/>}
            title="Ajouter un nouveau jeu"
            subtitle="Présentez votre création aux visiteur·ices du site."
        />
        <Container className="max-w-6xl py-10">
            <GameForm action={createGame} tags={tags} submitLabel="Créer" cancelHref="/games"/>
        </Container>
        </>
    )
}
