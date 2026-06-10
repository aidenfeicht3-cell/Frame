"use client";

import { useCallback, useEffect, useState } from "react";
import { getVideoStats, saveVideoStats } from "./store";
import type { VideoStat } from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

/** Loads logged videos, keeps them in state, and auto-saves on change. */
export function useAnalytics() {
  const [loaded, setLoaded] = useState(false);
  const [videos, setVideos] = useState<VideoStat[]>([]);

  useEffect(() => {
    setVideos(getVideoStats());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveVideoStats(videos);
  }, [videos, loaded]);

  const addVideo = useCallback((v: Omit<VideoStat, "id">) => {
    setVideos((prev) => [...prev, { ...v, id: uid() }]);
  }, []);

  const updateVideo = useCallback(
    (id: string, patch: Partial<Omit<VideoStat, "id">>) => {
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
    },
    [],
  );

  const removeVideo = useCallback((id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return { loaded, videos, addVideo, updateVideo, removeVideo };
}
