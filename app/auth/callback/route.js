import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  if (code) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.exchangeCodeForSession(code);
      } catch (err) {
        console.warn("Auth exchange code error:", err);
      }
    }
  }

  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/settings?tab=account`);
  }

  // Redirect to home dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}
