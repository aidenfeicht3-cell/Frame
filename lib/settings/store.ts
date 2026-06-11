import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { AppSettings } from "./types";
import { EMPTY_SETTINGS } from "./types";

/**
 * The settings "repository" — the only place the UI reads/writes app settings.
 * Swap these internals for a real DB/API later without touching any screen.
 */
export function getSettings(): AppSettings {
  return readJSON<AppSettings>(STORAGE_KEYS.settings, EMPTY_SETTINGS);
}

export function saveSettings(settings: AppSettings): void {
  writeJSON(STORAGE_KEYS.settings, settings);
}

/** Show only a hint of a key, e.g. "sk-ant…a1b2" — never the whole thing. */
export function maskKey(key: string): string {
  const k = key.trim();
  if (!k) return "";
  if (k.length <= 8) return "•".repeat(k.length);
  return `${k.slice(0, 6)}…${k.slice(-4)}`;
}
