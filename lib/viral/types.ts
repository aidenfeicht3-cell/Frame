/**
 * Why It Went Viral — paste a public YouTube video (URL or ID) and Frame pulls
 * its public stats (lib/youtube getVideoById) and an AI explains *why it likely
 * went viral* — across the title, thumbnail, hook, format, and timing — plus
 * what's repeatable for the creator's own channel. The result is cached by the
 * video id (see lib/viral/store) so re-analyzing the same video costs zero
 * credits.
 */

/** A public YouTube video's snapshot, mapped from the Data API. */
export type VideoSnapshot = {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string; // ISO date the video was published
  views: number;
  likes: number;
  comments: number;
  tags: string[];
};

/** The five levers we explain a hit through. */
export type ViralFactor = "title" | "thumbnail" | "hook" | "format" | "timing";

/** One reason the video likely took off. */
export type ViralReason = {
  factor: ViralFactor;
  label: string; // short heading, e.g. "A curiosity-gap title"
  insight: string; // 1–2 sentences on how this drove views
};

export type ViralAnalysis = {
  verdict: string; // one-line plain-language summary of the biggest driver
  reasons: ViralReason[]; // the drivers (title / thumbnail / hook / format / timing)
  repeatable: string[]; // concrete things the creator can copy for their own channel
  generatedAt: string; // ISO timestamp
};
