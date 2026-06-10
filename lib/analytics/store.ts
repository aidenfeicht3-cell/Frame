import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { VideoStat } from "./types";

/**
 * Repository for logged video stats. UI goes through here only — swap the
 * insides for a real DB/API (or the YouTube API) later without touching screens.
 */
export function getVideoStats(): VideoStat[] {
  return readJSON<VideoStat[]>(STORAGE_KEYS.videoStats, []);
}

export function saveVideoStats(stats: VideoStat[]): void {
  writeJSON(STORAGE_KEYS.videoStats, stats);
}
