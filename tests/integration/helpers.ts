import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/database.types";

// Shared setup for the integration tests: only against the local Supabase stack.
export const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

if (!/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url ?? "")) {
  throw new Error(`Integration tests only run against a local Supabase (got ${url}).`);
}

const options = { auth: { persistSession: false, autoRefreshToken: false } };
export const admin = createClient<Database>(url, process.env.SUPABASE_SECRET_KEY!, options);
export const anon = () => createClient<Database>(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, options);

type Role = Database["public"]["Enums"]["app_role"];

export type TestUser = { id: string; email: string; client: SupabaseClient<Database> };

let counter = 0;

/**
 * Creates a user with the given roles (and names), signed in through a magic link.
 * expired: the membership ended yesterday.
 */
export async function createUser(prefix: string, roles: Role[], { expired = false, names = true } = {}): Promise<TestUser> {
  const email = `${prefix}-${Date.now()}-${counter++}@test.local`;
  const { data: created, error: createError } = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (createError) throw createError;
  const id = created.user.id;
  const { data: link, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (error) throw error;

  if (roles.length) {
    const { error: rolesError } = await admin.from("user_roles").insert(roles.map((role) => ({ user_id: id, role })));
    if (rolesError) throw rolesError;
  }
  const { error: memberError } = await admin.from("members").update({
    ...(names ? { first_name: "Test", last_name: prefix } : {}),
    member_ship_expired_at: expired ? new Date(Date.now() - 86_400_000).toISOString() : null,
  }).eq("id", id);
  if (memberError) throw memberError;

  const client = anon();
  const { error: otpError } = await client.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "magiclink" });
  if (otpError) throw otpError;

  return { id, email, client };
}

/** Deletes users and their member rows (members.id has no on delete cascade). */
export async function deleteUsers(users: (TestUser | undefined)[]) {
  for (const user of users) {
    if (!user) continue;
    await admin.from("members").delete().eq("id", user.id);
    await admin.auth.admin.deleteUser(user.id);
  }
}
