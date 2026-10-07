import Link from "next/link";
import { AuthorAvatar } from "@/components/author-avatar";

type AuthorCardProps = {
    author: {
        id: string;
        slug: string | null;
        first_name: string | null;
        last_name: string | null;
        description: string | null;
        avatar_updated_at: string | null;
    };
}

export default function AuthorCard({author}: AuthorCardProps) {
    return (
        <Link
            href={`/authors/${author.slug}`}
            className="group flex h-full flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow transition duration-200 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:ring-2 hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
            <AuthorAvatar size="lg" authorId={author.id} firstName={author.first_name} lastName={author.last_name} avatarUpdatedAt={author.avatar_updated_at} className="transition-transform group-hover:scale-105 group-hover:shadow-lg"/>
            <h2 className="text-lg font-bold text-brand-dark">{author.first_name} {author.last_name}</h2>
            {author.description && <p className="line-clamp-2 text-sm text-gray-600">{author.description}</p>}
            <span className="mt-auto w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition-opacity pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-visible:opacity-100">
                Voir le profil
            </span>
        </Link>
    )
}
