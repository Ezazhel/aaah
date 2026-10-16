import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { ASSOCIATION_NAME, ASSOCIATION_SHORT_NAME, LEGAL } from "@/lib/association";

export const metadata: Metadata = { title: "Mentions légales" };

const linkClass = "font-semibold text-brand-primary underline-offset-4 hover:underline";

export default function Legal() {
    return <>
        <PageHeader title="Mentions légales"/>
        <Container className="flex max-w-3xl flex-col gap-8 py-12 [&_p]:leading-relaxed">
            <SectionCard title="Éditeur du site">
                <ul className="flex flex-col gap-1">
                    <li><strong>{ASSOCIATION_NAME}</strong> ({ASSOCIATION_SHORT_NAME}), association loi 1901</li>
                    <li>Siège social : {LEGAL.address}</li>
                    <li>Numéro RNA : {LEGAL.rna}</li>
                    <li>Directeur·ice de la publication : {LEGAL.publicationDirector}</li>
                    <li>Contact : <a href={`mailto:${LEGAL.email}`} className={linkClass}>{LEGAL.email}</a> ou via la <Link href="/contact" className={linkClass}>page contact</Link></li>
                </ul>
            </SectionCard>

            <SectionCard title="Hébergement">
                <p>
                    Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
                    (<a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className={linkClass}>vercel.com</a>).
                </p>
                <p className="mt-2">
                    Les données (comptes, profils, jeux) sont stockées par Supabase Inc.
                    (<a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className={linkClass}>supabase.com</a>).
                </p>
            </SectionCard>

            <SectionCard title="Propriété intellectuelle">
                <p>
                    Les textes, logos et éléments graphiques du site appartiennent à l&apos;association. Les présentations
                    et visuels des jeux restent la propriété de leurs auteur·ices et éditeurs. Toute reproduction sans
                    autorisation est interdite.
                </p>
            </SectionCard>

            <SectionCard title="Données personnelles">
                <p>
                    L&apos;association collecte uniquement les données nécessaires à son fonctionnement : adresse e-mail,
                    prénom, nom et présentation des membres, jeux publiés, messages envoyés via le formulaire de contact.
                    Elles ne sont ni vendues ni cédées à des tiers.
                </p>
                <p className="mt-2">
                    Prestataires utilisés : Supabase (base de données et connexion), Brevo (envoi des e-mails),
                    Cloudflare Turnstile (protection anti-spam du formulaire de contact) et HelloAsso (paiement des adhésions).
                </p>
                <p className="mt-2">
                    Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos
                    données. Pour l&apos;exercer, écrivez à <a href={`mailto:${LEGAL.email}`} className={linkClass}>{LEGAL.email}</a>.
                    Vous pouvez aussi adresser une réclamation à la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={linkClass}>CNIL</a>.
                </p>
            </SectionCard>

            <SectionCard title="Cookies">
                <p>
                    Le site n&apos;utilise aucun cookie publicitaire ni de mesure d&apos;audience. Seuls des cookies
                    techniques, indispensables à la connexion des membres, sont déposés.
                </p>
            </SectionCard>
        </Container>
    </>
}
