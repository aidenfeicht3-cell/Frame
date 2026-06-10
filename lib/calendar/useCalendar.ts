"use client";

import { useCallback, useEffect, useState } from "react";
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
