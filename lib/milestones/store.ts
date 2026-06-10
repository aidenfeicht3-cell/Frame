import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { Milestone } from "./types";

export function getMilestones(): Milestone[] {
  return readJSON<Milestone[]>(STORAGE_KEYS.milestones, []);
}

export function saveMilestones(milestones: Milestone[]): void {
  writeJSON(STORAGE_KEYS.milestones, milestones);
}
