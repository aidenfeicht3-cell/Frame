import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { Idea } from "./types";

export function getIdeas(): Idea[] {
  return readJSON<Idea[]>(STORAGE_KEYS.ideas, []);
}

export function saveIdeas(ideas: Idea[]): void {
  writeJSON(STORAGE_KEYS.ideas, ideas);
}
