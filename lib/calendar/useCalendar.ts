"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/storage";
import { SYNC_EVENT, type SyncedDetail } from "@/lib/sync/event";
import {
  getCadence,
  getScheduledPosts,
  saveCadence,
  saveScheduledPosts,
} from "./store";
import type { Cadence, ScheduledPost } from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

/**
 * React hook that loads the calendar from storage on mount, keeps it in state,
 * and saves automatically whenever it changes. Components use this and never
 * worry about persistence themselves.
 */
export function useCalendar() {
  const [loaded, setLoaded] = useState(false);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [cadence, setCadence] = useState<Cadence>({ enabled: false, weekday: 2 });

  // Load once, on the client only.
  useEffect(() => {
    setPosts(getScheduledPosts());
    setCadence(getCadence());
    setLoaded(true);

    // When cloud sync pulls fresh calendar data (e.g. signing in on a new
    // device), re-read it so the UI reflects the synced value without a reload.
    const onSynced = (e: Event) => {
      const key = (e as CustomEvent<SyncedDetail>).detail?.key;
      if (key === STORAGE_KEYS.scheduledPosts) setPosts(getScheduledPosts());
      if (key === STORAGE_KEYS.cadence) setCadence(getCadence());
    };
    window.addEventListener(SYNC_EVENT, onSynced);
    return () => window.removeEventListener(SYNC_EVENT, onSynced);
  }, []);

  // Persist on change (but not before the initial load has run).
  useEffect(() => {
    if (loaded) saveScheduledPosts(posts);
  }, [posts, loaded]);
  useEffect(() => {
    if (loaded) saveCadence(cadence);
  }, [cadence, loaded]);

  const addPost = useCallback((post: Omit<ScheduledPost, "id">) => {
    setPosts((prev) => [...prev, { ...post, id: uid() }]);
  }, []);

  const updatePost = useCallback(
    (id: string, patch: Partial<Omit<ScheduledPost, "id">>) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      );
    },
    [],
  );

  const removePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    loaded,
    posts,
    cadence,
    addPost,
    updatePost,
    removePost,
    setCadence,
  };
}
