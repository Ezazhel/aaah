import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { memberName } from "@/app/model/inventory";
import { sendNotification } from "./notify";

export type LoanEvent = 'requested' | 'declared' | 'approved' | 'rejected' | 'returned';

/**
 * Emails the people concerned by a loan event, after the response:
 * - request / direct take: the manager of the place (and the admins for a direct take);
 * - decision / return: the borrower.
 * The emails are read with the service role (inventory_notify_targets), never sent to the browser.
 */
export function notifyLoanEvent(loanId: string, event: LoanEvent) {
    after(async () => {
        try {
            const supabase = createAdminClient();
            const [{ data: loan }, { data: targets }] = await Promise.all([
                supabase
                    .from('inventory_loans')
                    .select('quantity, message, decision_note, item:inventory_items(name), location:inventory_locations(name), borrower:members!inventory_loans_borrower_id_fkey(first_name, last_name)')
                    .eq('id', loanId)
                    .single(),
                supabase.rpc('inventory_notify_targets', { p_loan: loanId }),
            ]);
            if(!loan || !targets){
                return console.warn("[email] prêt introuvable pour la notification", loanId);
            }

            const managers = targets.filter((t) => t.target === 'manager').map((t) => t.email);
            const borrower = targets.filter((t) => t.target === 'borrower').map((t) => t.email);
            const what = `${loan.quantity} × « ${loan.item?.name} »`;
            const where = `« ${loan.location?.name} »`;
            const who = memberName(loan.borrower);
            const message = loan.message ? [`Son message : ${loan.message}`] : [];
            const note = loan.decision_note ? [`Note : ${loan.decision_note}`] : [];

            switch(event){
                case 'requested':
                    return sendNotification({
                        to: managers,
                        subject: `Demande de prêt : ${loan.item?.name}`,
                        title: "Nouvelle demande de prêt",
                        paragraphs: [`${who} souhaite emprunter ${what} à ${where}.`, ...message, "Acceptez ou refusez la demande depuis votre stock."],
                        path: '/stock',
                        ctaLabel: "Ouvrir mon stock",
                    });
                case 'declared': {
                    const contact = process.env.CONTACT_EMAIL;
                    return sendNotification({
                        to: contact ? [...managers, contact] : managers,
                        subject: `Matériel emprunté : ${loan.item?.name}`,
                        title: "Matériel emprunté",
                        paragraphs: [`${who} a pris ${what} à ${where}. Le stock a été mis à jour.`, ...message, "Marquez le prêt comme rendu quand le matériel revient."],
                        path: '/stock',
                        ctaLabel: "Ouvrir le stock",
                    });
                }
                case 'approved':
                    return sendNotification({
                        to: borrower,
                        subject: `Demande acceptée : ${loan.item?.name}`,
                        title: "Votre demande est acceptée",
                        paragraphs: [`Votre demande de ${what} à ${where} est acceptée : le matériel vous est réservé.`, ...note, "Contactez le lieu pour venir le chercher."],
                        path: '/inventory',
                        ctaLabel: "Voir mes prêts",
                    });
                case 'rejected':
                    return sendNotification({
                        to: borrower,
                        subject: `Demande refusée : ${loan.item?.name}`,
                        title: "Votre demande est refusée",
                        paragraphs: [`Votre demande de ${what} à ${where} n'a pas pu être acceptée.`, ...note],
                        path: '/inventory',
                        ctaLabel: "Voir le matériel",
                    });
                case 'returned':
                    return sendNotification({
                        to: borrower,
                        subject: `Retour enregistré : ${loan.item?.name}`,
                        title: "Merci, le matériel est rendu",
                        paragraphs: [`Le retour de ${what} à ${where} est enregistré.`],
                        path: '/inventory',
                        ctaLabel: "Voir mes prêts",
                    });
            }
        } catch(err){
            console.error("[email] échec de la notification de prêt", loanId, event, err);
        }
    });
}
