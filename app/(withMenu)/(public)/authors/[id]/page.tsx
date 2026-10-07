import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorAvatar } from "@/components/author-avatar";
import { Breadcrumb } from "@/components/breadcrumb";
import { Container } from "@/components/layout/container";
import { SectionCard } from "@/components/section-card";
import { H2 } from "@/components/typography";
import { GameCard } from "../../games/components/game-card";
import { GetAuthorGames } from "../../games/lib/get-games";
import { GetAuthor } from "../lib/get-author";

export async function generateMetadata({params}: PageProps<"/authors/[id]">): Promise<Metadata> {
    const { id } = await params;
    const author = await GetAuthor(id);
    return { title: author ? `${author.first_name} ${author.last_name}` : undefined };
}

export default async function AuthorDetailPage({params}: PageProps<"/authors/[id]">) {
    const { id } = await params;
    const author = await GetAuthor(id);

    if(!author){
        notFound();
    }

    const games = await GetAuthorGames(author.id);
    const name = `${author.first_name} ${author.last_name}`;

    return <Container className="flex flex-col gap-10 py-8">
        <Breadcrumb items={[{label: "Auteur·ices", href: "/authors"}, {label: name}]}/>

        <section className="flex flex-col items-center gap-8 rounded-xl bg-surface-light p-6 shadow md:flex-row md:items-start md:gap-12 md:p-10">
            <AuthorAvatar size="xl" authorId={author.id} firstName={author.first_name} lastName={author.last_name} avatarUpdatedAt={author.avatar_updated_at}/>
            <div className="flex flex-col gap-4 text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-brand-dark md:text-4xl">{name}</h1>
                {author.description && <p className="whitespace-pre-line text-gray-700">{author.description}</p>}
            </div>
        </section>

        <section className="flex flex-col gap-6">
            <H2>{games.length > 1 ? "Ses jeux" : "Son jeu"}</H2>
            {games.length ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {games.map(game => <GameCard key={game.id} game={game}/>)}
                </div>
            ) : (
                <SectionCard className="text-gray-600">Aucun jeu pour le moment.</SectionCard>
            )}
        </section>
    </Container>
}
