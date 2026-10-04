import { createClient } from "@/lib/supabase/server"

/**
 * Every user with their email, role and membership (admin only, checked by the SQL function).
 */
export const GetAdminAuthors = async () => {
    const supabase = await createClient();
    const {data, error} = await supabase.rpc('admin_list_authors');

    if(error){
        throw new Error(error.message);
    }
    return data;
}

export type AdminAuthor = Awaited<ReturnType<typeof GetAdminAuthors>>[number];

/**
 * Start of the membership period (settings) and the current period.
 */
export const GetMembershipSettings = async () => {
    const supabase = await createClient();
    const [settings, period] = await Promise.all([
        supabase.from('membership_settings').select('start_month, start_day').single(),
        supabase.rpc('current_membership_period').single(),
    ]);

    if(settings.error || period.error){
        throw new Error((settings.error ?? period.error)!.message);
    }
    return { ...settings.data, ...period.data };
}
