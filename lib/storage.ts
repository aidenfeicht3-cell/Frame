/**
 * The lowest level of Frame's data layer: a tiny, SSR-safe wrapper around
 * the browser's localStorage.
 *
 * IMPORTANT: screens never call this directly — they go through a "store"
 * (e.g. lib/calendar/store.ts). That means when we later swap localStorage
 * for a real database/API, we only change these few functions and the stores,
 * and every screen keeps working untouched.
 */

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback; // server render: no storage
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked — fail quietly so the UI never crashes
  }
}

/** Central list of storage keys so we never typo or collide. */
export const STORAGE_KEYS = {
  scheduledPosts: "frame:scheduledPosts",
  cadence: "frame:cadence",
  profile: "frame:profile",
  // future: goals, videos, streak, ...
} as const;
