import { createClient } from "@/lib/supabase/server";
import { OPEN_LOAN_STATUSES } from "@/app/model/inventory";

/**
 * Places managed by the user (one manager per place), with their stock and open loans.
 */
export const GetManagedLocations = async (userId: string) => {
    const supabase = await createClient();
    const { data: locations, error } = await supabase
        .from('inventory_locations')
        .select('id, name, address, description')
        .eq('manager_id', userId)
        .order('name');
    if(error){
        throw new Error(error.message);
    }

    const ids = locations.map((location) => location.id);
    if(!ids.length){
        return [];
    }

    const [stock, loans] = await Promise.all([
        supabase
            .from('inventory_stock')
            .select('location_id, item_id, quantity, reserved, available, item:inventory_items(name, category)')
            .in('location_id', ids),
        supabase
            .from('inventory_loans')
            .select('id, location_id, quantity, status, message, created_at, borrowed_at, item:inventory_items(name), borrower:members!inventory_loans_borrower_id_fkey(first_name, last_name)')
            .in('location_id', ids)
            .in('status', OPEN_LOAN_STATUSES)
            .order('created_at'),
    ]);
    if(stock.error || loans.error){
        throw new Error((stock.error ?? loans.error)!.message);
    }

    return locations.map((location) => ({
        ...location,
        stock: stock.data
            .filter((row) => row.location_id === location.id)
            // available is a generated column: never null, but typed as nullable.
            .map((row) => ({ ...row, available: row.available ?? 0 }))
            .sort((a, b) => (a.item?.name ?? '').localeCompare(b.item?.name ?? '', 'fr')),
        loans: loans.data.filter((loan) => loan.location_id === location.id),
    }));
}

export type ManagedLocation = Awaited<ReturnType<typeof GetManagedLocations>>[number];

/**
 * Whole catalog (to add an existing item to a place).
 */
export const GetCatalogItems = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('inventory_items').select('id, name, category').order('name');
    if(error){
        throw new Error(error.message);
    }
    return data;
}
