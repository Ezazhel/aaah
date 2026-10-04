import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { isMembershipActive } from "@/app/model/author";
import { requireAdmin } from "@/lib/route_requires";
import { GetAdminAuthors, GetMembershipSettings } from "./lib/get-authors";
import { AuthorActions } from "./components/author-actions";
import { MembershipStartForm } from "./components/membership-start-form";

export const metadata: Metadata = { title: "Auteur·ices" };

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: 'Europe/Paris' }).format(new Date(value));

export default async function AdminAuthorsPage() {
    await requireAdmin();
    const [authors, membership] = await Promise.all([GetAdminAuthors(), GetMembershipSettings()]);

    return (<>
        <PageHeader title="Auteur·ices" subtitle="Nommez des admins, désactivez ou réactivez les adhésions."/>
        <Container className="flex max-w-6xl flex-col gap-6 py-10">
            <SectionCard title="Période d'adhésion">
                <div className="flex flex-col gap-4">
                    <p className="text-gray-700">
                        Période en cours : du <strong>{formatDate(membership.starts_on)}</strong> au <strong>{formatDate(membership.ends_on)}</strong>.
                        Désactiver un·e auteur·ice fait expirer son adhésion à la fin de la période précédente ; la réactiver la prolonge jusqu&apos;à la fin de la période en cours.
                    </p>
                    <MembershipStartForm month={membership.start_month} day={membership.start_day}/>
                </div>
            </SectionCard>

            <ul className="flex flex-col gap-4">
                {authors.map((author) => {
                    const name = `${author.first_name ?? ''} ${author.last_name ?? ''}`.trim();
                    const isActive = author.is_admin || isMembershipActive(author.member_ship_expired_at);

                    return (
                        <li key={author.id} className="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow md:flex-row md:items-start md:justify-between">
                            <div className="flex min-w-0 flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-xl font-bold break-words text-brand-dark">
                                        {name && author.slug && isActive
                                            ? <Link href={`/authors/${author.slug}`} className="hover:underline">{name}</Link>
                                            : name || <span className="text-gray-500 italic">Profil incomplet</span>}
                                    </h2>
                                    {author.is_admin && <span className="rounded-full bg-brand-dark px-2.5 py-0.5 text-xs font-semibold text-white">Admin</span>}
                                    {!isActive && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Adhésion expirée</span>}
                                </div>
                                <p className="break-all text-sm text-gray-600">{author.email}</p>
                                <p className="text-sm text-gray-600">
                                    {author.is_admin
                                        ? "Admin : toujours actif·ve"
                                        : author.member_ship_expired_at
                                            ? `Adhésion ${isActive ? "jusqu'au" : "expirée le"} ${formatDate(author.member_ship_expired_at)}`
                                            : "Adhésion sans échéance"}
                                    {' · '}
                                    {author.last_sign_in_at ? `Dernière connexion le ${formatDate(author.last_sign_in_at)}` : "Jamais connecté·e"}
                                </p>
                            </div>
                            <div className="md:max-w-sm">
                                <AuthorActions userId={author.id} isAdmin={author.is_admin} isActive={isActive}/>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Container>
    </>)
}
