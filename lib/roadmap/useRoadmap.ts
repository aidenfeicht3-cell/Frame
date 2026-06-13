"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SYNC_EVENT } from "@/lib/sync/event";
import type { FrameIQ } from "@/lib/frame-iq/types";
import type { NextVideoRoadmap } from "./types";
import {
  readCachedRoadmap,
  roadmapBasedOn,
  roadmapContext,
  roadmapInputHash,
  saveRoadmap,
} from "./store";

/**
 * Drives the Next-Video Roadmap page. It reads the cached roadmap on mount (and
 * when cloud sync pulls a fresh one), auto-generates once if the creator is
 * onboarded and nothing is cached, and exposes `generate()` for an explicit
 * "Regenerate". `stale` is true when the creator's data has moved on since the
 * cached roadmap was made — a gentle prompt to refresh, not an auto-call.
 */
export function useRoadmap(iq: FrameIQ | null) {
  const [loaded, setLoaded] = useState(false);
  const [roadmap, setRoadmap] = useState<NextVideoRoadmap | null>(null);
  const [cachedHash, setCachedHash] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(false);
  const autoTried = useRef(false);

  useEffect(() => {
    const read = () => {
      const c = readCachedRoadmap();
      setRoadmap(c?.roadmap ?? null);
      setCachedHash(c?.hash ?? null);
      setLoaded(true);
    };
    read();
    window.addEventListener(SYNC_EVENT, read);
    return () => window.removeEventListener(SYNC_EVENT, read);
  }, []);

  const generate = useCallback(async () => {
    if (!iq || generating) return;
    setGenerating(true);
    setError(false);
    try {
      const res = await fetch("/api/next-videos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(roadmapContext(iq)),
      });
      const data = await res.json();
      const next: NextVideoRoadmap = {
        videos: Array.isArray(data?.videos) ? data.videos : [],
        basedOn: roadmapBasedOn(iq),
        generatedAt: new Date().toISOString(),
      };
      if (next.videos.length === 0) throw new Error("empty roadmap");
      const hash = roadmapInputHash(iq);
      saveRoadmap(hash, next);
      setRoadmap(next);
      setCachedHash(hash);
    } catch {
      setError(true);
    } finally {
      setGenerating(false);
    }
  }, [iq, generating]);

  // Auto-generate once on first visit (onboarded + nothing cached).
  useEffect(() => {
    if (!loaded || !iq || !iq.onboarded) return;
    if (roadmap || generating || autoTried.current) return;
    autoTried.current = true;
    void generate();
  }, [loaded, iq, roadmap, generating, generate]);

  const stale = Boolean(iq && cachedHash && cachedHash !== roadmapInputHash(iq));

  return { loaded, roadmap, generating, error, stale, generate };
}
