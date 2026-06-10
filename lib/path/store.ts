import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";

/** Stores which Path level ids are completed. Swappable for a DB later. */
export function getCompleted(): string[] {
  return readJSON<string[]>(STORAGE_KEYS.pathCompleted, []);
}

export function saveCompleted(ids: string[]): void {
  writeJSON(STORAGE_KEYS.pathCompleted, ids);
}
