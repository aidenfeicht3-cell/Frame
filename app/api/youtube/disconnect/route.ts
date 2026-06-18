import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { deleteToken } from "@/lib/youtube/tokens";

/** Forget this user's stored YouTube token (disconnects their channel). */
export async function POST() {
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true });
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await deleteToken(user.id);
  } catch {
    // tolerate failure — the user can retry
  }
  return NextResponse.json({ ok: true });
}
