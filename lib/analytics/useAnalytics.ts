"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/storage";
import { SYNC_EVENT, type SyncedDetail } from "@/lib/sync/event";
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

    // Re-read when cloud sync pulls fresh video stats from another device.
    const onSynced = (e: Event) => {
      if ((e as CustomEvent<SyncedDetail>).detail?.key === STORAGE_KEYS.videoStats) {
        setVideos(getVideoStats());
      }
    };
    window.addEventListener(SYNC_EVENT, onSynced);
    return () => window.removeEventListener(SYNC_EVENT, onSynced);
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
