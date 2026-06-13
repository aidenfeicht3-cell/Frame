"use client";

import { useEffect } from "react";
import { startSync } from "@/lib/sync/state";

/**
 * Kicks off cloud sync once the app shell mounts (i.e. the user is inside the
 * app, signed in). Renders nothing. No-op when Supabase isn't configured.
 */
export function SyncProvider() {
  useEffect(() => {
    startSync();
  }, []);
  return null;
}
