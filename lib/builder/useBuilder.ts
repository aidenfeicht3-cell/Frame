"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/storage";
import { SYNC_EVENT, type SyncedDetail } from "@/lib/sync/event";
import {
  getEditingSetup,
  getProjects,
  saveEditingSetup,
  saveProjects,
} from "./store";
import type { EditingSetup, ProductionPlan, VideoProject } from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function useBuilder() {
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [editingSetup, setEditingSetup] = useState<EditingSetup>({
    software: "CapCut",
    device: "mobile",
  });

  useEffect(() => {
    setProjects(getProjects());
    setEditingSetup(getEditingSetup());
    setLoaded(true);

    // Re-read when cloud sync pulls fresh builder data from another device.
    const onSynced = (e: Event) => {
      const key = (e as CustomEvent<SyncedDetail>).detail?.key;
      if (key === STORAGE_KEYS.videoProjects) setProjects(getProjects());
      if (key === STORAGE_KEYS.editingSetup) setEditingSetup(getEditingSetup());
    };
    window.addEventListener(SYNC_EVENT, onSynced);
    return () => window.removeEventListener(SYNC_EVENT, onSynced);
  }, []);

  useEffect(() => {
    if (loaded) saveProjects(projects);
  }, [projects, loaded]);
  useEffect(() => {
    if (loaded) saveEditingSetup(editingSetup);
  }, [editingSetup, loaded]);

  /** Create a project from a generated plan; returns the new id. */
  const createProject = useCallback(
    (idea: string, setup: EditingSetup, plan: ProductionPlan): string => {
      const id = uid();
      const project: VideoProject = {
        id,
        idea: idea.trim() || "Untitled video",
        createdAt: new Date().toISOString(),
        setup,
        plan,
        completedSteps: [],
      };
      setProjects((prev) => [project, ...prev]);
      setEditingSetup(setup);
      return id;
    },
    [],
  );

  const completeStep = useCallback((projectId: string, stepId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId && !p.completedSteps.includes(stepId)
          ? { ...p, completedSteps: [...p.completedSteps, stepId] }
          : p,
      ),
    );
  }, []);

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    loaded,
    projects,
    editingSetup,
    createProject,
    completeStep,
    removeProject,
  };
}
