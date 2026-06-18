import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildAuthUrl, ownerOAuthConfigured } from "@/lib/youtube/owner";

/**
 * Start the "connect your channel" flow: send the signed-in creator to Google's
 * consent screen. A random `state` is stored in an httpOnly cookie and checked
 * in the callback (basic CSRF protection).
 */
export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  if (!isSupabaseConfigured() || !ownerOAuthConfigured()) {
    return NextResponse.redirect(`${origin}/progress?channel=unconfigured`);
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/signup?next=/progress`);

  const state = crypto.randomUUID();
  const res = NextResponse.redirect(buildAuthUrl(origin, state));
  res.cookies.set("yt_oauth_state", state, {
    httpOnly: true,
    secure: origin.startsWith("https"),
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes to complete consent
  });
  return res;
}
