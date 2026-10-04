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
import { GameCard } from "@/app/(withMenu)/(public)/games/components/game-card";
import { GetAuthorGames } from "@/app/(withMenu)/(public)/games/lib/get-games";
import AccountForm from "./account-form";

export const metadata: Metadata = { title: "Mon profil" };

export default async function Account(){
    const supabase = await createClient();
    const {data: claimsData} = await supabase.auth.getClaims();

    if(!claimsData?.claims){
        redirect('/auth/login');
    }

    const [{data: author}, games] = await Promise.all([
        supabase
            .from('authors')
            .select('first_name, last_name, description, avatar_url, slug')
            .eq('id', claimsData.claims.sub)
            .maybeSingle(),
        // Own profile: every status, so rejected games can be fixed and resubmitted.
        GetAuthorGames(claimsData.claims.sub, {allStatuses: true}),
    ]);

    return <>
        <PageHeader title="Mon profil" subtitle="Votre prénom et votre nom sont nécessaires pour accéder au site."/>
        <Container className="flex flex-col gap-12 py-10">
            <div className="mx-auto w-full max-w-3xl">
                <AccountForm
                    defaultValues={{
                        first_name: author?.first_name ?? '',
                        last_name: author?.last_name ?? '',
                        description: author?.description ?? '',
                    }}
                    avatarUrl={author?.avatar_url ?? null}
                    slug={author?.slug ?? null}
                />
            </div>

            <section className="flex flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <H2>Mes jeux</H2>
                    <Link href="/games/new" className={buttonVariants()}><Plus/> Nouveau jeu</Link>
                </div>
                {games.length ? (
                    <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {games.map(game => <li key={game.id} className="flex"><GameCard game={game}/></li>)}
                    </ul>
                ) : (
                    <SectionCard className="text-gray-600">Vous n&apos;avez pas encore de jeu.</SectionCard>
                )}
            </section>
        </Container>
    </>
}
