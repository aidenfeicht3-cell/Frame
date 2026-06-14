/**
 * STUB — real YouTube integration goes here later.
 *
 * This is the clearly-labeled boundary for "paste your channel → live
 * analytics". It's a stub today so the rest of the app works with manually
 * logged numbers; when we add the backend we fill these in WITHOUT changing
 * any screen.
 *
 * Public single-video stats (videos.list) ARE wired up below — they only need a
 * YOUTUBE_API_KEY, so "Why It Went Viral" works on any public video.
 *
 * TODO: still to come.
 *   - Channel snapshots (getChannelSnapshot) — also key-only; left as a stub.
 *   - Owner analytics (retention, impressions, CTR) need Google OAuth as the
 *     channel owner.
 * Read keys from environment variables — never hard-code them.
 */

import type { VideoSnapshot } from "@/lib/viral/types";

export type ChannelSnapshot = {
  handle: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
};

/** True once a YouTube key is configured (public-stats calls work). */
export function youtubeIsConnected(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY);
}

/** Placeholder. Returns null until the real API is wired up. */
export async function getChannelSnapshot(
  _handle: string,
): Promise<ChannelSnapshot | null> {
  // TODO: fetch https://www.googleapis.com/youtube/v3/channels?part=statistics
  //       &forHandle=<handle>&key=<YOUTUBE_API_KEY> and map the response.
  return null;
}

/**
 * A believable sample video for the no-key case, so "Why It Went Viral" still
 * works with zero setup. We point the thumbnail at the pasted id, so when the
 * user pastes a REAL link the real thumbnail still loads even without a key.
 */
export function sampleVideoSnapshot(id: string): VideoSnapshot {
  return {
    id,
    title: "I Tried This for 30 Days (Here's What Happened)",
    channelTitle: "Sample Creator",
    description:
      "In this video I share everything I learned from a 30-day experiment — the wins, the mistakes, and exactly what I'd do differently. Timestamps and resources below.",
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    publishedAt: new Date(Date.now() - 45 * 864e5).toISOString(), // ~45 days ago
    views: 1284903,
    likes: 73210,
    comments: 4120,
    tags: ["challenge", "30 day", "experiment", "how to", "beginner"],
  };
}

/**
 * Fetch one public video's stats via the YouTube Data API. Needs a
 * YOUTUBE_API_KEY — with none set we return a sample so the app runs key-free.
 * Returns null when a key IS set but the video can't be found (private/removed/
 * bad id), so the caller can show a "couldn't find that video" message.
 */
export async function getVideoById(id: string): Promise<VideoSnapshot | null> {
  if (!id) return null;
  // No key → key-free dev/demo mode: a sample video so the page still works.
  if (!youtubeIsConnected()) return sampleVideoSnapshot(id);

  try {
    const url =
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics` +
      `&id=${encodeURIComponent(id)}&key=${process.env.YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const item = data?.items?.[0];
    if (!item) return null; // no such public video

    const sn = item.snippet ?? {};
    const st = item.statistics ?? {};
    const thumbs = sn.thumbnails ?? {};
    const thumb =
      thumbs.maxres ?? thumbs.standard ?? thumbs.high ?? thumbs.medium ?? thumbs.default ?? {};

    return {
      id: String(item.id ?? id),
      title: String(sn.title ?? ""),
      channelTitle: String(sn.channelTitle ?? ""),
      description: String(sn.description ?? ""),
      thumbnailUrl: String(thumb.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`),
      publishedAt: String(sn.publishedAt ?? ""),
      views: Number(st.viewCount) || 0,
      likes: Number(st.likeCount) || 0,
      comments: Number(st.commentCount) || 0,
      tags: Array.isArray(sn.tags) ? sn.tags.slice(0, 15).map(String) : [],
    };
  } catch (err) {
    console.error("[youtube] getVideoById failed:", err);
    return null;
  }
}
