import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { isMembershipActive } from "@/app/model/author";
import { requireAdmin } from "@/lib/route_requires";
import { GetAdminMembers, GetMembershipSettings } from "./lib/get-members";
import { MemberActions } from "./components/member-actions";
import { MembershipStartForm } from "./components/membership-start-form";

export const metadata: Metadata = { title: "Membres" };

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: 'Europe/Paris' }).format(new Date(value));

export default async function AdminMembersPage() {
    await requireAdmin();
    const [members, membership] = await Promise.all([GetAdminMembers(), GetMembershipSettings()]);

    return (<>
        <PageHeader title="Membres" subtitle="Rôles (auteur·ice, gestion de stock, admin) et adhésions."/>
        <Container className="flex max-w-6xl flex-col gap-6 py-10">
            <SectionCard title="Période d'adhésion">
                <div className="flex flex-col gap-4">
                    <p className="text-gray-700">
                        Période en cours : du <strong>{formatDate(membership.starts_on)}</strong> au <strong>{formatDate(membership.ends_on)}</strong>.
                        Désactiver un·e membre fait expirer son adhésion à la fin de la période précédente ; la réactiver la prolonge jusqu&apos;à la fin de la période en cours.
                    </p>
                    <MembershipStartForm month={membership.start_month} day={membership.start_day}/>
                </div>
            </SectionCard>

            <ul className="flex flex-col gap-4">
                {members.map((member) => {
                    const name = `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim();
                    const isAdmin = member.roles.includes('admin');
                    const isAuthor = member.roles.includes('author');
                    const isLocationManager = member.roles.includes('location_manager');
                    const isActive = isAdmin || isMembershipActive(member.member_ship_expired_at);

                    return (
                        <li key={member.id} className="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow md:flex-row md:items-start md:justify-between">
                            <div className="flex min-w-0 flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-xl font-bold break-words text-brand-dark">
                                        {name && member.slug && isActive && isAuthor
                                            ? <Link href={`/authors/${member.slug}`} className="hover:underline">{name}</Link>
                                            : name || <span className="text-gray-500 italic">Profil incomplet</span>}
                                    </h2>
                                    {isAdmin && <span className="rounded-full bg-brand-dark px-2.5 py-0.5 text-xs font-semibold text-white">Admin</span>}
                                    {isAuthor && <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-semibold text-brand-dark">Auteur·ice</span>}
                                    {isLocationManager && <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-brand-dark">Gestion de stock</span>}
                                    {!isActive && !isLocationManager && <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Adhésion expirée</span>}
                                </div>
                                <p className="break-all text-sm text-gray-600">{member.email}</p>
                                <p className="text-sm text-gray-600">
                                    {isAdmin
                                        ? "Admin : toujours actif·ve"
                                        : member.member_ship_expired_at
                                            ? `Adhésion ${isActive ? "jusqu'au" : "expirée le"} ${formatDate(member.member_ship_expired_at)}`
                                            : "Adhésion sans échéance"}
                                    {' · '}
                                    {member.last_sign_in_at ? `Dernière connexion le ${formatDate(member.last_sign_in_at)}` : "Jamais connecté·e"}
                                </p>
                            </div>
                            <div className="md:max-w-sm">
                                <MemberActions userId={member.id} isAdmin={isAdmin} isAuthor={isAuthor} isLocationManager={isLocationManager} isActive={isActive}/>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Container>
    </>)
}
