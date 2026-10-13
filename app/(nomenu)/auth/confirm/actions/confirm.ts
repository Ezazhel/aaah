'use server'

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const linkSchema = z.object({
  token_hash: z.string().min(1),
  type: z.enum(["invite", "magiclink", "email", "signup", "recovery", "email_change"]),
});

/**
 * Verifies the email link. Only called on click (POST): mail scanners that open
 * links (GET) no longer consume the single-use token.
 */
export async function confirmLink(formData: FormData) {
  const parsed = linkSchema.safeParse({
    token_hash: formData.get("token_hash"),
    type: formData.get("type"),
  });
  if (!parsed.success) {
    redirect("/error");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp(parsed.data);

  if (error) {
    console.error(error);
    // Expired or already used link (invitation or magic link): the account exists,
    // so the user can request a new link from the login page.
    redirect(error.code === "otp_expired" ? "/auth/login?error=expired" : "/error");
  }

  // Membership expired: no session for this user.
  const { data: isActiveMember } = await supabase.rpc("is_active_member");
  if (isActiveMember !== true) {
    await supabase.auth.signOut();
    redirect("/auth/login?error=membership");
  }
  redirect("/");
}
