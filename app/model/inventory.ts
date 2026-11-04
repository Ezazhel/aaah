import type { Database } from "@/database.types";

export type LoanStatus = Database["public"]["Enums"]["loan_status"];

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
    pending: "En attente",
    approved: "Acceptée, à retirer",
    rejected: "Refusée",
    cancelled: "Annulée",
    borrowed: "Empruntée",
    returned: "Rendue",
};

/** Loans still taking material (or about to). */
export const OPEN_LOAN_STATUSES: LoanStatus[] = ['pending', 'approved', 'borrowed'];

/**
 * French message for an error raised by the inventory SQL functions.
 */
export function inventoryErrorMessage(error: { code?: string; message: string }, fallback: string) {
    if(error.message.includes('not_enough_stock')){
        return "Quantité disponible insuffisante.";
    }
    if(error.message.includes('invalid_status')){
        return "Ce prêt a changé entre-temps : rechargez la page.";
    }
    if(error.message.includes('reserved_above_quantity')){
        return "Une partie de ce stock est réservée pour des prêts acceptés : la quantité ne peut pas être plus basse.";
    }
    if(error.code === '42501'){
        return "Vous n'avez pas les droits pour cette action.";
    }
    return fallback;
}

export const memberName = (member: { first_name: string | null; last_name: string | null } | null) =>
    [member?.first_name, member?.last_name].filter(Boolean).join(' ') || "Un·e membre";
