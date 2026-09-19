import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const hash = searchParams.get("token_hash");

  if (hash) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: hash,
      type: "email",
    });

    if (!error) {
      return NextResponse.redirect(`${origin}/authors`);
    }
    console.error(error);
  }
  return NextResponse.redirect(`${origin}/error`);
}
