"use client";

import { useCallback, useEffect, useState } from "react";
import { SYNC_EVENT } from "@/lib/sync/event";
import type { VideoSnapshot, ViralAnalysis, ViralReason } from "./types";
import { parseVideoId, readCachedViral, saveViral } from "./store";

/** Why an analyze attempt failed — drives a friendly inline message. */
export type ViralError = "invalid" | "notfound" | "failed";

/**
 * Drives the "Why It Went Viral" page. It reads the cached analysis on mount
 * (and when cloud sync pulls a fresh one) and exposes `analyze(input, niche)`
 * for an explicit click. It only calls the API when the video is new — if the
 * pasted video's id matches what's already cached, it reuses the cached result
 * for free. On-demand, never on a loop.
 */
export function useViral() {
  const [loaded, setLoaded] = useState(false);
  const [video, setVideo] = useState<VideoSnapshot | null>(null);
  const [analysis, setAnalysis] = useState<ViralAnalysis | null>(null);
  const [cachedInput, setCachedInput] = useState("");
  const [cachedId, setCachedId] = useState<string | null>(null);
  const [sampleVideo, setSampleVideo] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<ViralError | null>(null);

  useEffect(() => {
    const read = () => {
      const c = readCachedViral();
      setVideo(c?.video ?? null);
      setAnalysis(c?.analysis ?? null);
      setCachedInput(c?.input ?? "");
      setCachedId(c?.id ?? null);
      setSampleVideo(Boolean(c?.sampleVideo));
      setLoaded(true);
    };
    read();
    window.addEventListener(SYNC_EVENT, read);
    return () => window.removeEventListener(SYNC_EVENT, read);
  }, []);

  const analyze = useCallback(
    async (input: string, niche: string) => {
      const raw = input.trim();
      if (!raw || analyzing) return;
      const id = parseVideoId(raw);
      if (!id) {
        setError("invalid");
        return;
      }
      // Re-analyzing the same video is free — keep the cached result.
      if (id === cachedId && analysis) {
        setError(null);
        return;
      }
      setAnalyzing(true);
      setError(null);
      try {
        const res = await fetch("/api/viral", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ input: raw, niche }),
        });
        if (!res.ok) {
          setError(
            res.status === 404
              ? "notfound"
              : res.status === 400
                ? "invalid"
                : "failed",
          );
          return;
        }
        const data = await res.json();
        const v = data?.video ?? {};
        const nextVideo: VideoSnapshot = {
          id: String(v.id ?? id),
          title: String(v.title ?? ""),
          channelTitle: String(v.channelTitle ?? ""),
          description: String(v.description ?? ""),
          thumbnailUrl: String(v.thumbnailUrl ?? ""),
          publishedAt: String(v.publishedAt ?? ""),
          views: Number(v.views) || 0,
          likes: Number(v.likes) || 0,
          comments: Number(v.comments) || 0,
          tags: Array.isArray(v.tags) ? v.tags.map(String) : [],
        };
        const a = data?.analysis ?? {};
        const reasons: ViralReason[] = Array.isArray(a.reasons) ? a.reasons : [];
        const nextAnalysis: ViralAnalysis = {
          verdict: String(a.verdict ?? ""),
          reasons,
          repeatable: Array.isArray(a.repeatable) ? a.repeatable : [],
          generatedAt:
            typeof a.generatedAt === "string"
              ? a.generatedAt
              : new Date().toISOString(),
        };
        if (!nextAnalysis.verdict && nextAnalysis.reasons.length === 0) {
          throw new Error("empty analysis");
        }
        const isSample = Boolean(data?.sampleVideo);
        saveViral({
          id,
          input: raw,
          sampleVideo: isSample,
          video: nextVideo,
          analysis: nextAnalysis,
        });
        setVideo(nextVideo);
        setAnalysis(nextAnalysis);
        setCachedInput(raw);
        setCachedId(id);
        setSampleVideo(isSample);
      } catch {
        setError("failed");
      } finally {
        setAnalyzing(false);
      }
    },
    [analyzing, cachedId, analysis],
  );

  return {
    loaded,
    video,
    analysis,
    cachedInput,
    cachedId,
    sampleVideo,
    analyzing,
    error,
    analyze,
  };
}
