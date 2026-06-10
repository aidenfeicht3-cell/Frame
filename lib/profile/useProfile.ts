"use client";

import { useCallback, useEffect, useState } from "react";
import { clearProfile, getProfile, saveProfile } from "./store";
import type { Profile } from "./types";

/** Loads the saved profile on mount and lets components save/clear it. */
export function useProfile() {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
    setLoaded(true);
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
