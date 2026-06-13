/**
 * Fired (as a CustomEvent<{ key: string }>) after the sync layer pulls a fresh
 * value down from Supabase into the local cache. Feature hooks listen for it so
 * cross-device changes show up live, without a page reload.
 */
export const SYNC_EVENT = "frame:synced";

export type SyncedDetail = { key: string };
