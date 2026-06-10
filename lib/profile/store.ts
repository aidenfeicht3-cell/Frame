import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { Profile } from "./types";

/**
 * The profile "repository" — the only place the UI reads/writes the profile.
 * Swap these internals for a real DB/API later without touching any screen.
 */
export function getProfile(): Profile | null {
  return readJSON<Profile | null>(STORAGE_KEYS.profile, null);
}

export function saveProfile(profile: Profile): void {
  writeJSON(STORAGE_KEYS.profile, profile);
}

export function clearProfile(): void {
  writeJSON<Profile | null>(STORAGE_KEYS.profile, null);
}
