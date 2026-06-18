/**
 * The cloud-sync layer. localStorage stays the instant, offline-friendly cache;
 * each user's Supabase `app_state` row is the cross-device source of truth.
 *
 *   • On login it PULLS each synced key down (remote wins on a fresh device).
 *   • Every local write is mirrored UP in the background (debounced).
 *
 * It is opt-in per feature via SYNCED_KEYS, so we migrate one feature at a time.
 * With no account or no Supabase configured, none of this runs and Frame keeps
 * working in pure-localStorage mode exactly as before.
 */
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  STORAGE_KEYS,
  readJSON,
  hydrateLocal,
  setWriteListener,
} from "@/lib/storage";
import { SYNC_EVENT } from "./event";

/**
 * Storage keys that sync to the cloud. We add one per feature as each is
 * migrated and verified. Everything not listed here stays local-only.
 */
const SYNCED_KEYS: readonly string[] = [
  STORAGE_KEYS.profile,
  STORAGE_KEYS.activeDates, // streak / active days
  STORAGE_KEYS.nextVideos, // cached Next-Video Roadmap (so we don't regenerate per device)
  STORAGE_KEYS.retention, // cached Retention Analyzer result (so we don't re-analyze per device)
  STORAGE_KEYS.viral, // cached Why-It-Went-Viral breakdown (so we don't re-analyze per device)
  // --- data-layer migration (one feature at a time; remote-wins on a fresh device) ---
  STORAGE_KEYS.scheduledPosts, // calendar: scheduled uploads
  STORAGE_KEYS.cadence, // calendar: recurring cadence
  STORAGE_KEYS.pathCompleted, // path: completed levels
  STORAGE_KEYS.videoProjects, // builder: saved video projects
  STORAGE_KEYS.editingSetup, // builder: editing software/device
  STORAGE_KEYS.ideas, // idea vault entries
  STORAGE_KEYS.milestones, // progress milestones
  STORAGE_KEYS.projectStages, // projects: per-project stage progress
  STORAGE_KEYS.vaultFavorites, // vault: favorited items
  STORAGE_KEYS.videoStats, // analytics: logged video stats
  // NOTE: billing (frame:billing) is intentionally NOT synced here — the Stripe
  // webhook owns the plan once real checkout is live (see BACKEND_PROMPTS #1).
];

const TABLE = "app_state";
const PUSH_DEBOUNCE_MS = 400;

let started = false;
let cachedUserId: string | null = null;
const pushTimers: Record<string, ReturnType<typeof setTimeout>> = {};

/** The signed-in user's id (read from the local session — no network call). */
async function getUserId(): Promise<string | null> {
  if (cachedUserId) return cachedUserId;
  try {
    const { data } = await createClient().auth.getSession();
    cachedUserId = data.session?.user?.id ?? null;
  } catch {
    cachedUserId = null;
  }
  return cachedUserId;
}

/** Upsert one key's value into the user's row. Quietly tolerant of failures —
 *  the local copy is the buffer and we resync on the next login. */
async function pushNow(key: string, value: unknown): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;
  try {
    await createClient()
      .from(TABLE)
      .upsert(
        { user_id: userId, key, value: value ?? null },
        { onConflict: "user_id,key" },
      );
  } catch {
    // offline / transient — leave it; the next hydrate or write will resync.
  }
}

function schedulePush(key: string, value: unknown): void {
  if (!SYNCED_KEYS.includes(key)) return;
  clearTimeout(pushTimers[key]);
  pushTimers[key] = setTimeout(() => void pushNow(key, value), PUSH_DEBOUNCE_MS);
}

function announce(key: string): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }));
  }
}

/** Pull every synced key down once at startup. */
async function hydrate(): Promise<void> {
  const userId = await getUserId();
  if (!userId) return;
  const supabase = createClient();

  for (const key of SYNCED_KEYS) {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error) continue;

      if (data) {
        // Remote exists → it wins on this device. Write locally without
        // echoing back up, then let the feature's hook re-read.
        hydrateLocal(key, data.value);
        announce(key);
      } else {
        // Nothing in the cloud yet → seed it from whatever is local (this is
        // the first-time migration of pre-existing localStorage data).
        const local = readJSON<unknown>(key, null);
        if (local !== null) void pushNow(key, local);
      }
    } catch {
      // ignore a single key's failure; others still sync
    }
  }
}

/** Start mirroring + pull once. Safe to call on every app mount; runs once. */
export function startSync(): void {
  if (started) return;
  if (typeof window === "undefined" || !isSupabaseConfigured()) return;
  started = true;
  setWriteListener(schedulePush);
  void hydrate();
}
