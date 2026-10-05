import { Database } from "@/database.types";
import { createClient } from "@supabase/supabase-js";

// Secret key client: bypasses RLS and can use auth.admin. Server only, never import it in a client component.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
