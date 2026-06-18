import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  exchangeCodeForRefreshToken,
  getOwnerChannel,
} from "@/lib/youtube/owner";
import { saveRefreshToken } from "@/lib/youtube/tokens";

/**
 * Where Google sends the creator back after they approve access. We verify the
 * state cookie, trade the code for a refresh token, look up their channel, and
 * store the token server-side (locked table). Read-only — nothing is posted.
 */
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const back = (status: string) =>
    NextResponse.redirect(`${origin}/progress?channel=${status}`);

  if (!isSupabaseConfigured()) return back("unconfigured");

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const expected = cookies().get("yt_oauth_state")?.value;
  // User declined, or the state doesn't match → bail without doing anything.
  if (!code || !state || !expected || state !== expected) return back("error");

  const refreshToken = await exchangeCodeForRefreshToken(code, origin);
  if (!refreshToken) return back("error");

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return back("error");

  const channel = await getOwnerChannel(refreshToken);
  await saveRefreshToken(
    user.id,
    refreshToken,
    channel ? { id: channel.id, title: channel.title } : null,
  );

  const res = back("connected");
  res.cookies.delete("yt_oauth_state");
  return res;
}
