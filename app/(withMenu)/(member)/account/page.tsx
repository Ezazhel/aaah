import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { H2 } from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { GameGrid } from "@/app/(withMenu)/(public)/games/components/game-card";
import { GetAuthorGames } from "@/app/(withMenu)/(public)/games/lib/get-games";
import AccountForm from "./account-form";
import { hasRole } from "@/lib/route_requires";

export const metadata: Metadata = { title: "Mon profil" };

export default async function Account(){
    const supabase = await createClient();
    const {data: claimsData} = await supabase.auth.getClaims();

    if(!claimsData?.claims){
        redirect('/auth/login');
    }

    const [{data: author}, games, isAuthor] = await Promise.all([
        supabase
            .from('members')
            .select('first_name, last_name, description, avatar_updated_at, slug')
            .eq('id', claimsData.claims.sub)
            .maybeSingle(),
        // Own profile: every status, so rejected games can be fixed and resubmitted.
        GetAuthorGames(claimsData.claims.sub, {allStatuses: true}),
        hasRole('author'),
    ]);

    return <>
        <PageHeader title="Mon profil" subtitle={isAuthor ? "Votre prénom et votre nom sont nécessaires pour accéder au site." : "Vos informations de contact."}/>
        <Container className="flex flex-col gap-12 py-10">
            <div className="mx-auto w-full max-w-3xl">
                <AccountForm
                    defaultValues={{
                        first_name: author?.first_name ?? '',
                        last_name: author?.last_name ?? '',
                        description: author?.description ?? '',
                    }}
                    authorId={claimsData.claims.sub}
                    avatarUpdatedAt={author?.avatar_updated_at ?? null}
                    slug={author?.slug ?? null}
                />
            </div>

            {isAuthor && <section className="flex flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <H2>Mes jeux</H2>
                    <Link href="/games/new" className={buttonVariants()}><Plus/> Nouveau jeu</Link>
                </div>
                {games.length ? (
                    <GameGrid games={games}/>
                ) : (
                    <SectionCard className="text-gray-600">Vous n&apos;avez pas encore de jeu.</SectionCard>
                )}
            </section>}
        </Container>
    </>
}
