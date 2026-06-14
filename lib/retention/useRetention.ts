"use client";

import { useCallback, useEffect, useState } from "react";
import { SYNC_EVENT } from "@/lib/sync/event";
import type { RetentionAnalysis, RetentionRisk } from "./types";
import {
  readCachedRetention,
  retentionInputHash,
  saveRetention,
} from "./store";

/**
 * Drives the Retention Analyzer page. It reads the cached analysis on mount (and
 * when cloud sync pulls a fresh one) and exposes `analyze(script, niche)` for an
 * explicit click. It only calls the AI when the script is new — if the script's
 * hash matches what's already cached, it reuses the cached result for free. This
 * is on-demand, never on a loop.
 */
export function useRetention() {
  const [loaded, setLoaded] = useState(false);
  const [analysis, setAnalysis] = useState<RetentionAnalysis | null>(null);
  const [cachedScript, setCachedScript] = useState("");
  const [cachedHash, setCachedHash] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const read = () => {
      const c = readCachedRetention();
      setAnalysis(c?.analysis ?? null);
      setCachedScript(c?.script ?? "");
      setCachedHash(c?.hash ?? null);
      setLoaded(true);
    };
    read();
    window.addEventListener(SYNC_EVENT, read);
    return () => window.removeEventListener(SYNC_EVENT, read);
  }, []);

  const analyze = useCallback(
    async (script: string, niche: string) => {
      const trimmed = script.trim();
      if (!trimmed || analyzing) return;
      const hash = retentionInputHash(trimmed);
      // Re-analyzing an unchanged script is free — just keep the cached result.
      if (hash === cachedHash && analysis) return;
      setAnalyzing(true);
      setError(false);
      try {
        const res = await fetch("/api/retention", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ script: trimmed, niche }),
        });
        const data = await res.json();
        const risks: RetentionRisk[] = Array.isArray(data?.risks)
          ? data.risks
          : [];
        const next: RetentionAnalysis = {
          score: Number(data?.score) || 0,
          grade: String(data?.grade ?? ""),
          verdict: String(data?.verdict ?? ""),
          strengths: Array.isArray(data?.strengths) ? data.strengths : [],
          risks,
          firstFifteen: String(data?.firstFifteen ?? ""),
          generatedAt:
            typeof data?.generatedAt === "string"
              ? data.generatedAt
              : new Date().toISOString(),
        };
        if (!next.grade && next.risks.length === 0 && !next.verdict) {
          throw new Error("empty analysis");
        }
        saveRetention(hash, trimmed, next);
        setAnalysis(next);
        setCachedScript(trimmed);
        setCachedHash(hash);
      } catch {
        setError(true);
      } finally {
        setAnalyzing(false);
      }
    },
    [analyzing, cachedHash, analysis],
  );

  return {
    loaded,
    analysis,
    cachedScript,
    cachedHash,
    analyzing,
    error,
    analyze,
  };
}
