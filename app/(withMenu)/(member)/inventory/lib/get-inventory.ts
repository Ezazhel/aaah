import { createClient } from "@/lib/supabase/server";

/**
 * Catalog with the stock of each place (RLS: members who can sign in).
 * Items with no stock anywhere are left out.
 */
export const GetCatalog = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('inventory_items')
        .select('id, name, category, description, stock:inventory_stock(quantity, available, location:inventory_locations(id, name, address))')
        .order('name');

    if(error){
        throw new Error(error.message);
    }
    return data
        // available is a generated column: never null, but typed as nullable.
        .map((item) => ({ ...item, stock: item.stock.filter((row) => row.quantity > 0).map((row) => ({ ...row, available: row.available ?? 0 })) }))
        .filter((item) => item.stock.length > 0);
}

export type CatalogItem = Awaited<ReturnType<typeof GetCatalog>>[number];

/**
 * Loans of the connected user, newest first.
 */
export const GetMyLoans = async (userId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('inventory_loans')
        .select('id, quantity, status, message, decision_note, created_at, borrowed_at, returned_at, item:inventory_items(name), location:inventory_locations(name, address)')
        .eq('borrower_id', userId)
        .order('created_at', { ascending: false });

    if(error){
        throw new Error(error.message);
    }
    return data;
}
