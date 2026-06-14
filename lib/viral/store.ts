/**
 * Viral store — the cache layer for "Why It Went Viral".
 *
 * Analyzing a video costs an AI credit (and a YouTube API call), so we cache the
 * result keyed by the video id. The page only calls the API when the pasted
 * video is new — re-analyzing the same video reuses the cached result and costs
 * nothing. The cache lives in localStorage and (via SYNCED_KEYS) syncs to the
 * user's Supabase row, so an analysis made on one device shows up on another.
 */
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { VideoSnapshot, ViralAnalysis } from "./types";

export type ViralCache = {
  id: string; // canonical video id that was analyzed (the cache key)
  input: string; // what the user pasted (so we can prefill the box)
  sampleVideo: boolean; // true when the stats are sample data (no YouTube key)
  video: VideoSnapshot;
  analysis: ViralAnalysis;
};

const ID_RE = /^[A-Za-z0-9_-]{11}$/;

/**
 * Pull a YouTube video id out of whatever the user pasted — a full watch URL, a
 * youtu.be / shorts / embed link, or a bare 11-character id. Returns null if we
 * can't find one. Pure string logic, so both the page and the API route use it.
 */
export function parseVideoId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (ID_RE.test(s)) return s; // already a bare id

  try {
    const url = new URL(s.startsWith("http") ? s : `https://${s}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      return ID_RE.test(id) ? id : null;
    }
    if (host.endsWith("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && ID_RE.test(v)) return v;
      // /shorts/<id>, /embed/<id>, /live/<id>, /v/<id>
      const parts = url.pathname.split("/").filter(Boolean);
      const i = parts.findIndex(
        (p) => p === "shorts" || p === "embed" || p === "live" || p === "v",
      );
      if (i >= 0 && parts[i + 1] && ID_RE.test(parts[i + 1])) return parts[i + 1];
    }
  } catch {
    // not a URL — fall through to the loose match below
  }

  // Last resort: any 11-char id-looking token in the string.
  const m = s.match(/[A-Za-z0-9_-]{11}/);
  return m ? m[0] : null;
}

export function readCachedViral(): ViralCache | null {
  return readJSON<ViralCache | null>(STORAGE_KEYS.viral, null);
}

export function saveViral(cache: ViralCache): void {
  writeJSON(STORAGE_KEYS.viral, cache);
}
