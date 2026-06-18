/**
 * Owner-level YouTube integration: the creator connects THEIR OWN channel via
 * Google OAuth, so Frame can read their real channel stats + daily views.
 *
 * This is the "connect your channel → live analytics" backend. It is SERVER-ONLY
 * (reads client secret from env, called from app/api/youtube/* routes) and fully
 * gated: with no Google OAuth keys, `ownerOAuthConfigured()` is false and every
 * screen falls back to the manual / sample flow exactly as before.
 *
 * Read-only scopes only — this never posts or writes anything to YouTube.
 * Uses plain fetch (no googleapis dependency), matching lib/youtube.ts.
 */

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";

/** Read-only owner scopes: channel data + analytics. No write scope. */
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
];

export type OwnerChannel = {
  id: string;
  title: string;
  subscribers: number;
  views: number;
  videos: number;
};

export type DailyViewPoint = { date: string; views: number };

/** True once the Google OAuth client id + secret are set in the env. */
export function ownerOAuthConfigured(): boolean {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}

/** Where Google sends the user back. Must match a redirect URI registered on
 *  the OAuth client in Google Cloud Console. We derive it from the request
 *  origin so it works on both localhost and the deployed site. */
export function redirectUri(origin: string): string {
  return `${origin}/api/youtube/callback`;
}

/** The Google consent URL we send the creator to when they click "Connect". */
export function buildAuthUrl(origin: string, state: string): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri(origin),
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline", // ask for a refresh token
    prompt: "consent", // force the refresh token even on re-connect
    include_granted_scopes: "true",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/** Trade the one-time `code` from the callback for a refresh token. */
export async function exchangeCodeForRefreshToken(
  code: string,
  origin: string,
): Promise<string | null> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: redirectUri(origin),
        grant_type: "authorization_code",
      }).toString(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.refresh_token ? String(data.refresh_token) : null;
  } catch (err) {
    console.error("[youtube/owner] code exchange failed:", err);
    return null;
  }
}

/** Mint a short-lived access token from a stored refresh token. */
async function accessTokenFromRefresh(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
      }).toString(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.access_token ? String(data.access_token) : null;
  } catch (err) {
    console.error("[youtube/owner] token refresh failed:", err);
    return null;
  }
}

/** The connected channel's headline stats (subscribers, views, video count). */
export async function getOwnerChannel(
  refreshToken: string,
): Promise<OwnerChannel | null> {
  const access = await accessTokenFromRefresh(refreshToken);
  if (!access) return null;
  try {
    const res = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      { headers: { Authorization: `Bearer ${access}` } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const item = data?.items?.[0];
    if (!item) return null;
    const st = item.statistics ?? {};
    return {
      id: String(item.id ?? ""),
      title: String(item.snippet?.title ?? ""),
      subscribers: Number(st.subscriberCount) || 0,
      views: Number(st.viewCount) || 0,
      videos: Number(st.videoCount) || 0,
    };
  } catch (err) {
    console.error("[youtube/owner] getOwnerChannel failed:", err);
    return null;
  }
}

/** Daily views for the last `days` days, oldest → newest. null when unavailable
 *  so callers keep the manual flow. */
export async function getOwnerDailyViews(
  refreshToken: string,
  days = 30,
): Promise<DailyViewPoint[] | null> {
  const access = await accessTokenFromRefresh(refreshToken);
  if (!access) return null;
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 864e5);
  const day = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD
  try {
    const params = new URLSearchParams({
      ids: "channel==MINE",
      startDate: day(start),
      endDate: day(end),
      metrics: "views",
      dimensions: "day",
      sort: "day",
    });
    const res = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?${params.toString()}`,
      { headers: { Authorization: `Bearer ${access}` } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const rows: unknown[] = Array.isArray(data?.rows) ? data.rows : [];
    return rows.map((r) => {
      const row = r as [string, number];
      return { date: String(row[0]), views: Number(row[1]) || 0 };
    });
  } catch (err) {
    console.error("[youtube/owner] getOwnerDailyViews failed:", err);
    return null;
  }
}
