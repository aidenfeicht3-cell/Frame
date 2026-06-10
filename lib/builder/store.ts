import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { EditingSetup, VideoProject } from "./types";

/** Repository for video projects + the saved editing setup. Swappable later. */
export function getProjects(): VideoProject[] {
  return readJSON<VideoProject[]>(STORAGE_KEYS.videoProjects, []);
}

export function saveProjects(projects: VideoProject[]): void {
  writeJSON(STORAGE_KEYS.videoProjects, projects);
}

const DEFAULT_SETUP: EditingSetup = { software: "CapCut", device: "mobile" };

export function getEditingSetup(): EditingSetup {
  return readJSON<EditingSetup>(STORAGE_KEYS.editingSetup, DEFAULT_SETUP);
}

export function saveEditingSetup(setup: EditingSetup): void {
  writeJSON(STORAGE_KEYS.editingSetup, setup);
}
