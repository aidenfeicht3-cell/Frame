import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { StageId } from "./types";

/**
 * Repository for production-stage progress. We store it separately from the
 * builder's projects (a map of projectId -> finished stage ids) so the existing
 * VideoProject model is untouched and the DB swap stays small.
 */
export type StageMap = Record<string, StageId[]>;

export function getStageMap(): StageMap {
  return readJSON<StageMap>(STORAGE_KEYS.projectStages, {});
}

export function saveStageMap(map: StageMap): void {
  writeJSON(STORAGE_KEYS.projectStages, map);
}
