import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getOwnerDailyViews, ownerOAuthConfigured } from "@/lib/youtube/owner";
import { getRefreshToken } from "@/lib/youtube/tokens";

// Per-user + reads env/auth at request time — never cache this.
export const dynamic = "force-dynamic";

/**
 * Live daily views (last 30 days) for the connected channel. Returns
 * `{ connected: false, points: null }` whenever anything isn't ready, so the
 * Progress chart silently falls back to manually-logged numbers.
 */
export async function GET() {
  if (!isSupabaseConfigured() || !ownerOAuthConfigured()) {
    return NextResponse.json({ connected: false, points: null });
  }
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ connected: false, points: null });

    const refresh = await getRefreshToken(user.id);
    if (!refresh) return NextResponse.json({ connected: false, points: null });

    const points = await getOwnerDailyViews(refresh, 30);
    return NextResponse.json({ connected: true, points: points ?? null });
  } catch {
    return NextResponse.json({ connected: false, points: null });
  }
}
