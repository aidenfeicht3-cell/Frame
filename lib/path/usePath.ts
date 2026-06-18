"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/storage";
import { SYNC_EVENT, type SyncedDetail } from "@/lib/sync/event";
import { getCompleted, saveCompleted } from "./store";
import { PHASE1_LEVELS } from "./curriculum";
import { markActiveToday } from "@/lib/streak";
import { celebrate } from "@/lib/celebrate";

/**
 * Drives the Path: which levels are done, which is current, which are locked.
 * Levels unlock sequentially — the "current" level is the first one not yet
 * completed. Completing it also marks today active (feeds the streak).
 */
export function usePath() {
  const [loaded, setLoaded] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(getCompleted());
    setLoaded(true);

    // Re-read when cloud sync pulls fresh Path progress from another device.
    const onSynced = (e: Event) => {
      if ((e as CustomEvent<SyncedDetail>).detail?.key === STORAGE_KEYS.pathCompleted) {
        setCompleted(getCompleted());
      }
    };
    window.addEventListener(SYNC_EVENT, onSynced);
    return () => window.removeEventListener(SYNC_EVENT, onSynced);
  }, []);

  useEffect(() => {
    if (loaded) saveCompleted(completed);
  }, [completed, loaded]);

  const levels = PHASE1_LEVELS;
  const completedSet = new Set(completed);
  const currentIndex = levels.findIndex((l) => !completedSet.has(l.id)); // -1 = all done

  const isCompleted = (id: string) => completedSet.has(id);
  const isCurrent = (id: string) =>
    currentIndex >= 0 && levels[currentIndex].id === id;
  const isLocked = (id: string) => {
    if (currentIndex < 0) return false; // all complete
    const idx = levels.findIndex((l) => l.id === id);
    return idx > currentIndex;
  };

  const complete = useCallback(
    (id: string) => {
      if (completed.includes(id)) return;
      const willFinishPhase = completed.length + 1 === levels.length;
      setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
      markActiveToday();
      celebrate(
        willFinishPhase ? "Phase 1 complete! 🎉" : "Step done — nice! 🔥",
      );
    },
    [completed, levels.length],
  );

  return {
    loaded,
    levels,
    currentIndex,
    doneCount: completed.length,
    total: levels.length,
    isCompleted,
    isCurrent,
    isLocked,
    complete,
  };
}
