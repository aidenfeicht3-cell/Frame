"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/storage";
import { SYNC_EVENT, type SyncedDetail } from "@/lib/sync/event";
import { clearProfile, getProfile, saveProfile } from "./store";
import type { Profile } from "./types";

/** Loads the saved profile on mount and lets components save/clear it. */
export function useProfile() {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
    setLoaded(true);

    // When cloud sync pulls a fresh profile (e.g. signing in on a new device),
    // re-read it so the UI reflects the synced value without a reload.
    const onSynced = (e: Event) => {
      const detail = (e as CustomEvent<SyncedDetail>).detail;
      if (detail?.key === STORAGE_KEYS.profile) setProfile(getProfile());
    };
    window.addEventListener(SYNC_EVENT, onSynced);
    return () => window.removeEventListener(SYNC_EVENT, onSynced);
  }, []);

  const save = useCallback((next: Profile) => {
    saveProfile(next);
    setProfile(next);
  }, []);

  const reset = useCallback(() => {
    clearProfile();
    setProfile(null);
  }, []);

  return { loaded, profile, save, reset };
}
