import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";

/** Favorited item keys (e.g. "idea:123", "project:abc"). Swappable later. */
export function getFavorites(): string[] {
  return readJSON<string[]>(STORAGE_KEYS.vaultFavorites, []);
}

export function saveFavorites(keys: string[]): void {
  writeJSON(STORAGE_KEYS.vaultFavorites, keys);
}
