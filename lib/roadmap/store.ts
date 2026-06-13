/**
 * Roadmap store — the cache layer for the Next-Video Roadmap.
 *
 * Generating suggestions costs an AI credit, so we cache the result keyed by a
 * hash of the inputs that actually change the answer. The page only calls the
 * AI on the first visit or an explicit "Regenerate" — never automatically for
 * an unchanged state. The cache lives in localStorage and (via SYNCED_KEYS)
 * syncs to the user's Supabase row, so a roadmap made on one device shows up on
 * another without regenerating.
 */
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { FrameIQ } from "@/lib/frame-iq/types";
import type { NextVideoContext, NextVideoRoadmap } from "./types";

export type RoadmapCache = { hash: string; roadmap: NextVideoRoadmap };

/** A stable key from the Frame IQ signals that should change the suggestions. */
export function roadmapInputHash(iq: FrameIQ): string {
  return [iq.niche, iq.publishedCount, iq.bestVideo, iq.avgRetentionPct].join(
    "|",
  );
}

/** The compact, Frame-IQ-derived context sent to the AI. */
export function roadmapContext(iq: FrameIQ): NextVideoContext {
  return {
    niche: iq.niche,
    publishedCount: iq.publishedCount,
    bestVideo: iq.bestVideo,
    avgRetentionPct: iq.avgRetentionPct,
    stage: iq.stage,
  };
}

/** A plain-language note on what the roadmap was built from. */
export function roadmapBasedOn(iq: FrameIQ): string {
  const parts: string[] = [`your ${iq.niche || "creator"} niche`];
  if (iq.publishedCount > 0) {
    parts.push(`${iq.publishedCount} video${iq.publishedCount === 1 ? "" : "s"} shipped`);
  }
  if (iq.bestVideo) parts.push(`your top video “${iq.bestVideo}”`);
  return `Based on ${parts.join(", ")}.`;
}

export function readCachedRoadmap(): RoadmapCache | null {
  return readJSON<RoadmapCache | null>(STORAGE_KEYS.nextVideos, null);
}

export function saveRoadmap(hash: string, roadmap: NextVideoRoadmap): void {
  writeJSON(STORAGE_KEYS.nextVideos, { hash, roadmap });
}
