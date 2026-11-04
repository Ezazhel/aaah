import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/route_requires";
import { LOAN_STATUS_LABELS, OPEN_LOAN_STATUSES, memberName } from "@/app/model/inventory";

export const metadata: Metadata = { title: "Inventaire" };

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' }).format(new Date(value));

const REASONS = { adjustment: "Ajustement", loan: "Prêt", return: "Retour" } as const;

export default async function AdminInventoryPage() {
    await requireAdmin();
    const supabase = await createClient();

    const [loans, movements] = await Promise.all([
        supabase
            .from('inventory_loans')
            .select('id, quantity, status, created_at, borrowed_at, item:inventory_items(name), location:inventory_locations(name), borrower:members!inventory_loans_borrower_id_fkey(first_name, last_name)')
            .in('status', OPEN_LOAN_STATUSES)
            .order('created_at', { ascending: false }),
        supabase
            .from('inventory_movements')
            .select('id, delta, reason, created_at, item:inventory_items(name), location:inventory_locations(name), actor:members(first_name, last_name)')
            .order('created_at', { ascending: false })
            .limit(100),
    ]);
    if(loans.error || movements.error){
        throw new Error((loans.error ?? movements.error)!.message);
    }

    return (<>
        <PageHeader title="Inventaire" subtitle="Prêts en cours et derniers mouvements de stock, tous lieux confondus."/>
        <Container className="flex max-w-6xl flex-col gap-6 py-10">
            <SectionCard title="Prêts en cours">
                {loans.data.length ? (
                    <ul className="flex flex-col divide-y divide-gray-200">
                        {loans.data.map((loan) => (
                            <li key={loan.id} className="flex flex-wrap justify-between gap-2 py-2">
                                <span><strong>{loan.quantity} × {loan.item?.name}</strong> · {loan.location?.name} · {memberName(loan.borrower)}</span>
                                <span className="text-sm text-gray-600">{LOAN_STATUS_LABELS[loan.status]} · {formatDate(loan.borrowed_at ?? loan.created_at)}</span>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-600">Aucun prêt en cours.</p>}
            </SectionCard>

            <SectionCard title="Derniers mouvements">
                {movements.data.length ? (
                    <ul className="flex flex-col divide-y divide-gray-200">
                        {movements.data.map((movement) => (
                            <li key={movement.id} className="flex flex-wrap justify-between gap-2 py-2">
                                <span>
                                    <strong className={movement.delta < 0 ? "text-red-700" : "text-green-700"}>{movement.delta > 0 ? `+${movement.delta}` : movement.delta}</strong>
                                    {' '}{movement.item?.name} · {movement.location?.name} · {REASONS[movement.reason]}
                                </span>
                                <span className="text-sm text-gray-600">{memberName(movement.actor)} · {formatDate(movement.created_at)}</span>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-600">Aucun mouvement.</p>}
            </SectionCard>
        </Container>
    </>)
}
