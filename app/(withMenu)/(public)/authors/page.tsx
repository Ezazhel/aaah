import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { GetAuthors } from "./lib/get-authors";
import AuthorCard from "./card";

export const metadata: Metadata = { title: "Auteur·ices" };

export default async function Authors() {
    const authors = await GetAuthors();

    return <>
        <PageHeader title="Nos auteur·ices" subtitle="Découvrez les créateur·ices de jeux de l'association."/>
        <Container className="py-12">
            {authors.length ? (
                <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {authors.map(author => (
                        <li key={author.id}><AuthorCard author={author}/></li>
                    ))}
                </ul>
            ) : (
                <SectionCard className="text-center text-gray-600">Il n&apos;y a actuellement pas d&apos;auteur·ices.</SectionCard>
            )}
        </Container>
    </>
}
