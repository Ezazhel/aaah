import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Mail, Users } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { requireAdmin } from "@/lib/route_requires";
import { GetPendingCount } from "./lib/get-pending-count";

export const metadata: Metadata = { title: "Administration" };

export default async function AdminPage() {
    await requireAdmin();
    const pendingCount = await GetPendingCount();

    const cards = [
        { href: "/admin/authors", icon: Users, title: "Gérer les auteur·ices", text: "Nommer des admins, désactiver ou réactiver les adhésions." },
        { href: "/admin/invite", icon: Mail, title: "Inviter un·e auteur·ice", text: "Envoyer un lien d'inscription par e-mail." },
        {
            href: "/admin/validation",
            icon: ClipboardCheck,
            title: "Valider les jeux",
            text: pendingCount > 0 ? `${pendingCount} jeu${pendingCount > 1 ? 'x' : ''} en attente de validation.` : "Aucun jeu en attente.",
        },
    ];

    return (<>
        <PageHeader title="Administration" subtitle="Invitez des auteur·ices et validez les jeux proposés."/>
        <Container className="grid max-w-6xl gap-6 py-10 md:grid-cols-3">
            {cards.map(({href, icon: Icon, title, text}) => (
                <Link key={href} href={href} className="flex items-start gap-4 rounded-xl bg-white/90 p-6 shadow transition hover:-translate-y-2 hover:shadow-2xl">
                    <Icon className="size-8 shrink-0 text-primary" aria-hidden/>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-bold text-brand-dark">{title}</h2>
                        <p className="text-gray-600">{text}</p>
                    </div>
                </Link>
            ))}
        </Container>
    </>)
}
