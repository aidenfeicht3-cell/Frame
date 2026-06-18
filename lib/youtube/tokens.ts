/**
 * SERVER-ONLY storage for each user's YouTube refresh token, kept in the locked
 * `youtube_tokens` Supabase table (RLS denies the browser; the service-role
 * client used here bypasses RLS). Never import this from client code.
 *
 * All functions are gated on `adminConfigured()` and tolerant of failure, so
 * with no service-role key the connection simply reads as "not connected".
 */
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

const TABLE = "youtube_tokens";

export async function saveRefreshToken(
  userId: string,
  refreshToken: string,
  channel: { id: string; title: string } | null,
): Promise<void> {
  if (!adminConfigured()) return;
  try {
    await createAdminClient()
      .from(TABLE)
      .upsert(
        {
          user_id: userId,
          refresh_token: refreshToken,
          channel_id: channel?.id ?? null,
          channel_title: channel?.title ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
  } catch (err) {
    console.error("[youtube/tokens] saveRefreshToken failed:", err);
  }
}

export async function getRefreshToken(userId: string): Promise<string | null> {
  if (!adminConfigured()) return null;
  try {
    const { data } = await createAdminClient()
      .from(TABLE)
      .select("refresh_token")
      .eq("user_id", userId)
      .maybeSingle();
    return data?.refresh_token ? String(data.refresh_token) : null;
  } catch (err) {
    console.error("[youtube/tokens] getRefreshToken failed:", err);
    return null;
  }
}

/** Lightweight "is this user connected, and to what channel" — no secrets. */
export async function getConnection(
  userId: string,
): Promise<{ channelTitle: string | null } | null> {
  if (!adminConfigured()) return null;
  try {
    const { data } = await createAdminClient()
      .from(TABLE)
      .select("channel_title")
      .eq("user_id", userId)
      .maybeSingle();
    return data ? { channelTitle: data.channel_title ?? null } : null;
  } catch (err) {
    console.error("[youtube/tokens] getConnection failed:", err);
    return null;
  }
}

export async function deleteToken(userId: string): Promise<void> {
  if (!adminConfigured()) return;
  try {
    await createAdminClient().from(TABLE).delete().eq("user_id", userId);
  } catch (err) {
    console.error("[youtube/tokens] deleteToken failed:", err);
  }
}
