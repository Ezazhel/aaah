import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { requireAdmin } from "@/lib/route_requires";
import { InviteForm } from "./invite-form";

export const metadata: Metadata = { title: "Inviter un·e membre" };

export default async function InvitePage() {
    await requireAdmin();

    return (<>
        <PageHeader title="Inviter un·e membre" subtitle="Choisissez ses rôles : il ou elle recevra un lien par e-mail."/>
        <Container className="max-w-xl py-10">
            <SectionCard>
                <InviteForm/>
            </SectionCard>
        </Container>
    </>)
}
