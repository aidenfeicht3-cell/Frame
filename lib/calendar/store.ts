import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { Cadence, ScheduledPost } from "./types";

/**
 * The calendar's data "repository". The UI only ever calls these functions —
 * so to move to a real database/API later, we change the insides here (and in
 * lib/storage.ts) WITHOUT touching any screen.
 */

export function getScheduledPosts(): ScheduledPost[] {
  return readJSON<ScheduledPost[]>(STORAGE_KEYS.scheduledPosts, []);
}

export function saveScheduledPosts(posts: ScheduledPost[]): void {
  writeJSON(STORAGE_KEYS.scheduledPosts, posts);
}

const DEFAULT_CADENCE: Cadence = { enabled: false, weekday: 2 }; // Tuesday

export function getCadence(): Cadence {
  return readJSON<Cadence>(STORAGE_KEYS.cadence, DEFAULT_CADENCE);
}

export function saveCadence(cadence: Cadence): void {
  writeJSON(STORAGE_KEYS.cadence, cadence);
}
