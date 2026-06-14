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

type WriteListener = (key: string, value: unknown) => void;
let writeListener: WriteListener | null = null;

/**
 * The sync layer (lib/sync) registers here so it can mirror local writes up to
 * the user's Supabase row. When nobody is registered (no account, or Supabase
 * not configured) this is a no-op and storage stays purely local.
 */
export function setWriteListener(fn: WriteListener | null): void {
  writeListener = fn;
}

function writeLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked — fail quietly so the UI never crashes
  }
}

export function writeJSON<T>(key: string, value: T): void {
  writeLocal(key, value);
  writeListener?.(key, value); // mirror up to the cloud, if syncing
}

/**
 * Write a value into the local cache WITHOUT notifying the sync layer. Used
 * when hydrating from the remote DB, so a pulled value doesn't immediately
 * echo back up as a write.
 */
export function hydrateLocal<T>(key: string, value: T): void {
  writeLocal(key, value);
}

/** Central list of storage keys so we never typo or collide. */
export const STORAGE_KEYS = {
  scheduledPosts: "frame:scheduledPosts",
  cadence: "frame:cadence",
  profile: "frame:profile",
  videoStats: "frame:videoStats",
  pathCompleted: "frame:pathCompleted",
  activeDates: "frame:activeDates",
  videoProjects: "frame:videoProjects",
  editingSetup: "frame:editingSetup",
  ideas: "frame:ideas",
  milestones: "frame:milestones",
  billing: "frame:billing",
  projectStages: "frame:projectStages",
  vaultFavorites: "frame:vaultFavorites",
  creatorScore: "frame:creatorScore", // last {score, at} for the daily delta
  nextVideos: "frame:nextVideos", // cached {hash, roadmap} for Next-Video Roadmap
  retention: "frame:retention", // cached {hash, script, analysis} for Retention Analyzer
  viral: "frame:viral", // cached {id, input, video, analysis} for Why It Went Viral
  // future: goals, ...
} as const;
