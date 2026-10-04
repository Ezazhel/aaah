import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { GameForm } from "../components/gameForm";
import { createGame } from "../lib/action";

export const metadata: Metadata = { title: "Nouveau jeu" };

export default function NewGame() {
    return (<>
        <PageHeader
            top={<Breadcrumb tone="light" items={[{label: "Jeux", href: "/games"}, {label: "Nouveau jeu"}]}/>}
            title="Ajouter un nouveau jeu"
            subtitle="Présentez votre création aux visiteur·ices du site."
        />
        <Container className="max-w-6xl py-10">
            <GameForm action={createGame} submitLabel="Créer" cancelHref="/games"/>
        </Container>
        </>
    )
}
