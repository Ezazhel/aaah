import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { H1, Muted, P } from "@/components/typography";
import { GetGame, IsGameAuthor } from "../lib/get-game"


const Range = ({label, range}: {label:string, range: number[]}) => {
    return (
    <div className="inline-flex gap-2">
        <span>{label} : </span>
        <span>{range[0]}-{range[1]}</span>
    </div>)
}
export default async function Game({params}: PageProps<"/games/[slug]">){
    const { slug } = await params;
    const game = await GetGame(slug)

    if(!game){
        notFound();
    }

    const canEdit = await IsGameAuthor(game);

    return <div>
        <div className="flex items-center gap-4">
            <H1>{game.name}</H1>
            {canEdit && <Link href={`/games/edit/${game.slug}`} className={buttonVariants({ variant: "outline", size: "sm" })}>Éditer</Link>}
        </div>
        <Muted>
            Par{' '}
            {game.authors.map(({author}, index) => (
                <span key={author.id}>
                    {index > 0 && ', '}
                    <Link href={`/authors/${author.slug}`}>{author.first_name} {author.last_name}</Link>
                </span>
            ))}
        </Muted>
        <div>
            <Range label="Joueurs" range={[game.min_players, game.max_players]}/> - <Range label="Durée" range={[game.min_time_minutes, game.max_time_minutes]}/>{' '}(minutes) - À partir de {game.age_threshold} ans
        </div>
        <P className="whitespace-pre-line">{game.description}</P>
    </div>
}
