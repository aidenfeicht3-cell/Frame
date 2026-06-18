import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ownerOAuthConfigured } from "@/lib/youtube/owner";
import { getConnection } from "@/lib/youtube/tokens";

// Per-user + reads env/auth at request time — never cache this.
export const dynamic = "force-dynamic";

/**
 * Tells the UI whether channel-connect is even available (`configured`) and
 * whether THIS user has connected (`connected`, plus the channel name). No
 * secrets are ever returned. Safe to call with nothing set up — it just
 * reports `configured: false`.
 */
export async function GET() {
  const configured = isSupabaseConfigured() && ownerOAuthConfigured();
  if (!configured) {
    return NextResponse.json({ configured: false, connected: false, channelTitle: null });
  }
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ configured: true, connected: false, channelTitle: null });
    }
    const conn = await getConnection(user.id);
    return NextResponse.json({
      configured: true,
      connected: Boolean(conn),
      channelTitle: conn?.channelTitle ?? null,
    });
  } catch {
    return NextResponse.json({ configured: true, connected: false, channelTitle: null });
  }
}
