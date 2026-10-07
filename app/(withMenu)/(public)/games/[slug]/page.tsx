import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AuthorAvatar } from "@/components/author-avatar";
import { GameCover } from "@/components/game-cover";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/layout/container";
import { SectionCard } from "@/components/section-card";
import { GameMeta } from "../components/game-meta";
import { Alert } from "@/components/alert";
import { isMembershipActive } from "@/app/model/author";
import { visibleMechanics } from "@/app/model/category";
import { CategoryBadge } from "@/components/category-badge";
import { MechanicBadge } from "@/components/mechanic-badge";
import { GetGame, GetLastReview, IsGameAuthor } from "../lib/get-game"

export async function generateMetadata({params}: PageProps<"/games/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const game = await GetGame(slug);
    return { title: game?.name };
}

export default async function Game({params}: PageProps<"/games/[slug]">){
    const { slug } = await params;
    const game = await GetGame(slug)

    if(!game){
        notFound();
    }

    const canEdit = await IsGameAuthor(game);
    // Only authors and admins can read a game that is not approved.
    const lastReview = game.status === 'rejected' ? await GetLastReview(game.id) : null;
    const authors = game.authors.map(({author}) => author);
    const mechanics = visibleMechanics(game.mechanics);

    return <Container className="flex max-w-6xl flex-col gap-8 py-8">
        <Breadcrumb items={[{label: "Jeux", href: "/games"}, {label: game.name}]}/>

        {game.status === 'pending' && (
            <Alert variant="warning">Ce jeu est en attente de validation : il n&apos;est pas encore visible sur le site.</Alert>
        )}
        {game.status === 'rejected' && (
            <Alert>
                <p className="font-semibold">Ce jeu a été refusé et n&apos;est pas visible sur le site.</p>
                {lastReview?.reason && <p className="mt-1 whitespace-pre-line">Raison : {lastReview.reason}</p>}
                {canEdit && <p className="mt-1">Modifiez-le pour le soumettre à nouveau.</p>}
            </Alert>
        )}

        <section className="flex flex-col gap-8 md:flex-row">
            <GameCover
                gameId={game.id}
                coverUpdatedAt={game.cover_updated_at}
                size="lg"
                fit="contain"
                className="h-64 rounded-xl shadow-lg md:h-80 md:w-1/2"
                diceClassName="text-7xl"
            />
            <div className="flex flex-col gap-4 rounded-xl bg-white/80 p-6 shadow-lg md:w-1/2">
                <h1 className="text-3xl font-extrabold break-words text-brand-dark md:text-4xl">{game.name}</h1>
                {authors.length > 0 && (
                    <p className="text-gray-600">
                        par{' '}
                        {authors.map((author, index) => (
                            <span key={author.id}>
                                {index > 0 && ', '}
                                {isMembershipActive(author.member_ship_expired_at)
                                    ? <Link href={`/authors/${author.slug}`} className="font-semibold text-primary hover:underline">{author.first_name} {author.last_name}</Link>
                                    : <span className="font-semibold">{author.first_name} {author.last_name}</span>}
                            </span>
                        ))}
                    </p>
                )}
                {game.category && <CategoryBadge name={game.category.name} color={game.category.color} className="self-start text-sm"/>}
                <GameMeta game={game} className="flex flex-wrap gap-2 [&>span]:text-sm"/>
                {mechanics.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <h2 className="text-sm font-semibold text-gray-700">Mécaniques</h2>
                        <ul className="flex flex-wrap gap-2">
                            {mechanics.map(({id, name, status}) => (
                                <li key={id}>
                                    <MechanicBadge className="text-sm">
                                        {name}
                                        {/* Only the suggester and admins see a pending mechanic. */}
                                        {status === 'pending' && <span className="ml-1 text-xs text-orange-700">(en attente de validation)</span>}
                                    </MechanicBadge>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {canEdit && (
                    <Link href={`/games/edit/${game.slug}`} className={buttonVariants({ variant: "outline", className: "mt-auto self-start" })}>
                        <Pencil/> Éditer
                    </Link>
                )}
            </div>
        </section>

        <SectionCard title="Description">
            <p className="whitespace-pre-line leading-7 text-gray-800">{game.description}</p>
        </SectionCard>

        {authors.length > 0 && (
            <section className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-primary">{authors.length > 1 ? "Les auteur·ices" : "L'auteur·ice"}</h2>
                <div className={authors.length > 1 ? "grid gap-6 md:grid-cols-2" : "grid gap-6"}>
                    {authors.map(author => (
                        <article key={author.id} className="flex flex-col items-center gap-6 rounded-xl bg-white/90 p-6 text-center shadow md:flex-row md:items-start md:text-left">
                            <AuthorAvatar authorId={author.id} firstName={author.first_name} lastName={author.last_name} avatarUpdatedAt={author.avatar_updated_at} className="shadow"/>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-bold">
                                    {isMembershipActive(author.member_ship_expired_at)
                                        ? <Link href={`/authors/${author.slug}`} className="text-primary hover:underline">{author.first_name} {author.last_name}</Link>
                                        : <>{author.first_name} {author.last_name}</>}
                                </h3>
                                {author.description && <p className="line-clamp-4 whitespace-pre-line text-gray-700">{author.description}</p>}
                                {isMembershipActive(author.member_ship_expired_at) && (
                                    <Link href={`/authors/${author.slug}`} className={buttonVariants({ className: "mt-2 self-center md:self-start" })}>Voir le profil</Link>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        )}
    </Container>
}
