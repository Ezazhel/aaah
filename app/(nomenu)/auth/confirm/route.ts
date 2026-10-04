import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get('type') as EmailOtpType | null;

  console.log("CONFIRM:", {
    hasToken: !!token_hash,
    type,
  });

  if (token_hash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });
   console.log("VERIFY OTP:", {
    error,
    user: data.user?.id,
    hasSession: !!data.session,
  });

    if (!error) {
      // Membership expired: no session for this user.
      const { data: isActiveMember } = await supabase.rpc('is_active_member');
      if (isActiveMember !== true) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/auth/login?error=membership`);
      }
      return NextResponse.redirect(`${origin}`);
    }
    console.error(error);
  }
  return NextResponse.redirect(`${origin}/error`);
}
