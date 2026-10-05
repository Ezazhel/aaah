import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social";
import { FACEBOOK_URL, INSTAGRAM_URL } from "@/lib/association";
import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact" };

const networks = [
    { href: INSTAGRAM_URL, label: "Instagram", handle: "@asso_aaah", Icon: InstagramIcon },
    { href: FACEBOOK_URL, label: "Facebook", handle: "Le groupe de l'association", Icon: FacebookIcon },
];

export default async function Contact() {
    // Logged-in members: their email is filled in.
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const email = typeof data?.claims?.email === 'string' ? data.claims.email : undefined;

    return <>
        <PageHeader title="Contact" subtitle="Une question, une envie de nous rejoindre ? Écrivez-nous."/>
        <Container className="flex max-w-3xl flex-col gap-8 py-12">
            <ul className="grid gap-4 sm:grid-cols-2">
                {networks.map(({ href, label, handle, Icon }) => (
                    <li key={label}>
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 rounded-xl bg-white/90 p-6 shadow transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            <Icon className="size-10 shrink-0 text-brand-primary"/>
                            <span className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Via {label}</span>
                                <span className="font-bold text-brand-dark">{handle}</span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>

            <SectionCard title="Ou via le formulaire">
                <ContactForm defaultEmail={email}/>
            </SectionCard>
        </Container>
    </>
}
