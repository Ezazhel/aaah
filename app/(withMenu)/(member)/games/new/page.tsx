import { H1 } from "@/components/typography";
import { GameForm } from "../components/gameForm";
import { createGame } from "../lib/action";

export default function NewGame() {
    return (<>
        <H1>Nouveau Jeu</H1>
        <GameForm action={createGame} submitLabel="Créer"/>
        </>
    )
}
