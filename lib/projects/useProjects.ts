"use client";

import { useCallback, useEffect, useState } from "react";
import { getProjects } from "@/lib/builder/store";
import type { VideoProject } from "@/lib/builder/types";
import { celebrate } from "@/lib/celebrate";
import { STORAGE_KEYS } from "@/lib/storage";
import { SYNC_EVENT, type SyncedDetail } from "@/lib/sync/event";
import { getStageMap, saveStageMap, type StageMap } from "./store";
import { STAGE_COUNT, completionPct, type StageId } from "./types";

export type ProjectProgress = {
  project: VideoProject;
  doneStages: StageId[];
  pct: number;
  isPublished: boolean;
};

/**
 * Seed sensible defaults from data we already have (no AI, no extra work):
 * a project always has an idea, and if the builder's Publish step is done we
 * mark Upload + Published too.
 */
function seedStages(p: VideoProject): StageId[] {
  const stages: StageId[] = ["idea"];
  if (p.completedSteps?.includes("publish")) stages.push("upload", "published");
  return stages;
}

/**
 * Combines the builder's saved projects with their production-stage progress.
 * Pure local data — no network or AI calls.
 */
export function useProjects() {
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [stageMap, setStageMap] = useState<StageMap>({});

  useEffect(() => {
    const load = () => {
      const ps = getProjects();
      const map = getStageMap();
      // Give any project without an entry a sensible starting point, once.
      let changed = false;
      for (const p of ps) {
        if (!map[p.id]) {
          map[p.id] = seedStages(p);
          changed = true;
        }
      }
      if (changed) saveStageMap(map);
      setProjects(ps);
      setStageMap(map);
      setLoaded(true);
    };
    load();

    // Re-read when cloud sync pulls fresh stage progress (projectStages) or the
    // underlying projects list (videoProjects) from another device.
    const onSynced = (e: Event) => {
      const key = (e as CustomEvent<SyncedDetail>).detail?.key;
      if (key === STORAGE_KEYS.projectStages || key === STORAGE_KEYS.videoProjects) {
        load();
      }
    };
    window.addEventListener(SYNC_EVENT, onSynced);
    return () => window.removeEventListener(SYNC_EVENT, onSynced);
  }, []);

  const toggleStage = useCallback((projectId: string, stageId: StageId) => {
    setStageMap((prev) => {
      const current = prev[projectId] ?? [];
      const has = current.includes(stageId);
      const nextStages = has
        ? current.filter((s) => s !== stageId)
        : [...current, stageId];
      const next = { ...prev, [projectId]: nextStages };
      saveStageMap(next);
      if (!has && nextStages.length === STAGE_COUNT) {
        celebrate("Video published — that's the whole game! 🎉");
      }
      return next;
    });
  }, []);

  const progress: ProjectProgress[] = projects.map((p) => {
    const done = stageMap[p.id] ?? [];
    return {
      project: p,
      doneStages: done,
      pct: completionPct(done.length),
      isPublished: done.includes("published"),
    };
  });

  const inProgress = progress.filter(
    (x) => !x.isPublished && x.doneStages.length > 0,
  );
  const publishedCount = progress.filter((x) => x.isPublished).length;

  return { loaded, progress, inProgress, publishedCount, toggleStage };
}
