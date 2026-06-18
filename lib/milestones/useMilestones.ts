"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/storage";
import { SYNC_EVENT, type SyncedDetail } from "@/lib/sync/event";
import { getMilestones, saveMilestones } from "./store";
import type { Milestone } from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function useMilestones() {
  const [loaded, setLoaded] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    setMilestones(getMilestones());
    setLoaded(true);

    // Re-read when cloud sync pulls fresh milestones from another device.
    const onSynced = (e: Event) => {
      if ((e as CustomEvent<SyncedDetail>).detail?.key === STORAGE_KEYS.milestones) {
        setMilestones(getMilestones());
      }
    };
    window.addEventListener(SYNC_EVENT, onSynced);
    return () => window.removeEventListener(SYNC_EVENT, onSynced);
  }, []);

  useEffect(() => {
    if (loaded) saveMilestones(milestones);
  }, [milestones, loaded]);

  const addMilestone = useCallback(
    (label: string, target: number, current = 0) => {
      setMilestones((prev) => [
        ...prev,
        {
          id: uid(),
          label: label.trim() || "New goal",
          target: Math.max(1, target),
          current: Math.max(0, current),
          createdAt: new Date().toISOString(),
        },
      ]);
    },
    [],
  );

  const updateMilestone = useCallback(
    (id: string, patch: Partial<Omit<Milestone, "id">>) => {
      setMilestones((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      );
    },
    [],
  );

  const removeMilestone = useCallback((id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return {
    loaded,
    milestones,
    addMilestone,
    updateMilestone,
    removeMilestone,
  };
}
