import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAuthor } from "@/lib/route_requires";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { H2 } from "@/components/typography";
import { LOAN_STATUS_LABELS } from "@/app/model/inventory";
import { GetCatalog, GetMyLoans } from "./lib/get-inventory";
import { BorrowForm } from "./components/borrow-form";
import { CancelLoanButton } from "./components/cancel-loan-button";

export const metadata: Metadata = { title: "Emprunter du matériel" };

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeZone: 'Europe/Paris' }).format(new Date(value));

export default async function InventoryPage() {
    await requireAuthor();
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getClaims();
    if(!auth?.claims){
        redirect('/auth/login');
    }

    const [catalog, loans] = await Promise.all([GetCatalog(), GetMyLoans(auth.claims.sub)]);

    return (<>
        <PageHeader title="Emprunter du matériel" subtitle="Boîtes, dés, pions… prêtés par l'association et ses lieux partenaires. Pensez à les rendre."/>
        <Container className="flex flex-col gap-12 py-10">
            <section className="flex flex-col gap-6">
                <H2>Mes prêts</H2>
                {loans.length ? (
                    <ul className="flex flex-col gap-3">
                        {loans.map((loan) => (
                            <li key={loan.id} className="flex flex-col gap-2 rounded-xl bg-white/90 p-4 shadow sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-1">
                                    <p className="font-semibold text-brand-dark">{loan.quantity} × {loan.item?.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {loan.location?.name} · demandé le {formatDate(loan.created_at)}
                                        {loan.returned_at && ` · rendu le ${formatDate(loan.returned_at)}`}
                                    </p>
                                    {loan.decision_note && <p className="text-sm text-gray-700">Note du lieu : {loan.decision_note}</p>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-semibold text-brand-dark">{LOAN_STATUS_LABELS[loan.status]}</span>
                                    {(loan.status === 'pending' || loan.status === 'approved') && <CancelLoanButton loanId={loan.id}/>}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <SectionCard className="text-gray-600">Aucun prêt pour le moment.</SectionCard>
                )}
            </section>

            <section className="flex flex-col gap-6">
                <H2>Matériel disponible</H2>
                {catalog.length ? (
                    <ul className="grid gap-6 md:grid-cols-2">
                        {catalog.map((item) => (
                            <li key={item.id} className="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow">
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-xl font-bold text-brand-dark">{item.name}</h3>
                                        {item.category && <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-brand-dark">{item.category}</span>}
                                    </div>
                                    {item.description && <p className="text-gray-700">{item.description}</p>}
                                    <ul className="mt-1 flex flex-col gap-1 text-sm text-gray-600">
                                        {item.stock.map((row) => row.location && (
                                            <li key={row.location.id} className="flex items-start gap-1.5">
                                                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden/>
                                                <span>{row.location.name}{row.location.address && ` (${row.location.address})`} : <strong>{row.available}</strong> disponible{row.available > 1 ? 's' : ''} sur {row.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <BorrowForm item={item}/>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <SectionCard className="text-gray-600">Aucun matériel en stock pour le moment.</SectionCard>
                )}
            </section>
        </Container>
    </>)
}
