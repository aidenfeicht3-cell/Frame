/**
 * Retention store — the cache layer for the Retention Analyzer.
 *
 * Analyzing a script costs an AI credit, so we cache the result keyed by a hash
 * of the script text. The page only calls the AI when the pasted script is new
 * — re-analyzing an unchanged script reuses the cached result and costs nothing.
 * The cache lives in localStorage and (via SYNCED_KEYS) syncs to the user's
 * Supabase row, so an analysis made on one device shows up on another without
 * regenerating.
 */
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { RetentionAnalysis } from "./types";

export type RetentionCache = {
  hash: string; // hash of the analyzed script
  script: string; // the script that was analyzed (so we can prefill the textarea)
  analysis: RetentionAnalysis;
};

/**
 * A tiny, deterministic string hash (FNV-1a, base-36). Good enough to tell one
 * script from another as a cache key — not a security hash.
 */
export function hashText(input: string): string {
  let h = 2166136261; // FNV-1a 32-bit offset basis
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/** The cache key for a pasted script (whitespace-trimmed so stray edges don't matter). */
export function retentionInputHash(script: string): string {
  return hashText(script.trim());
}

/** Map a 0–100 score to a friendly letter grade. */
export function gradeForScore(score: number): string {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function readCachedRetention(): RetentionCache | null {
  return readJSON<RetentionCache | null>(STORAGE_KEYS.retention, null);
}

export function saveRetention(
  hash: string,
  script: string,
  analysis: RetentionAnalysis,
): void {
  writeJSON(STORAGE_KEYS.retention, { hash, script, analysis });
}
