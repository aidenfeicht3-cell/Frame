/**
 * The Creator Score engine. It turns the signals Frame IQ already aggregates
 * into a single 0–100 momentum score with a four-part breakdown — pure math,
 * no AI, no new data to collect. Screens never touch localStorage directly;
 * the only persisted bit is a tiny daily "baseline" used to show a delta.
 */
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import { toISODate } from "@/lib/calendar/dates";
import type { FrameIQ } from "@/lib/frame-iq/types";
import type { CreatorScore, ScorePart } from "./types";

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** 0–24 Spark · 25–49 Builder · 50–74 Momentum · 75–100 On fire */
export function tierFor(score: number): string {
  if (score >= 75) return "On fire";
  if (score >= 50) return "Momentum";
  if (score >= 25) return "Builder";
  return "Spark";
}

/**
 * Compute the score from a Frame IQ snapshot. Rubric (max = 100):
 *   Consistency 35 — streak (20) + this week's active days (15)
 *   Output      30 — videos published (22) + an active project (8)
 *   Pipeline    20 — ideas saved (8) + weekly cadence (6) + something scheduled (6)
 *   Insight     15 — videos with logged stats (8) + average retention (7)
 * Each part is rounded; the score is the sum of the rounded parts (so the
 * breakdown bars always add up to the number on screen). Delta is filled in by
 * the hook against the saved baseline — kept out of here so this stays pure.
 */
export function computeCreatorScore(iq: FrameIQ): CreatorScore {
  // Consistency — showing up
  const consistency =
    (Math.min(iq.streak, 14) / 14) * 20 + (iq.weekActiveCount / 7) * 15;

  // Output — shipping
  const output =
    (Math.min(iq.publishedCount, 8) / 8) * 22 + (iq.inProgressCount > 0 ? 8 : 0);

  // Pipeline — set up to keep going
  const pipeline =
    (Math.min(iq.ideaCount, 5) / 5) * 8 +
    (iq.cadenceShort === "weekly" ? 6 : 0) +
    (iq.upcomingUploads > 0 ? 6 : 0);

  // Insight — learning from results
  const insight =
    (Math.min(iq.videoCount, 4) / 4) * 8 +
    (iq.videoCount > 0 ? (iq.avgRetentionPct / 100) * 7 : 0);

  const parts: ScorePart[] = [
    {
      key: "consistency",
      label: "Consistency",
      points: Math.round(consistency),
      max: 35,
      hint: "Show up daily — a quick Path step keeps your streak going.",
      href: "/path",
    },
    {
      key: "output",
      label: "Output",
      points: Math.round(output),
      max: 30,
      hint: "Ship videos. Finishing the one closest to done lifts this most.",
      href: "/projects",
    },
    {
      key: "pipeline",
      label: "Pipeline",
      points: Math.round(pipeline),
      max: 20,
      hint: "Line up what's next — save ideas and set a weekly posting day.",
      href: "/calendar",
    },
    {
      key: "insight",
      label: "Insight",
      points: Math.round(insight),
      max: 15,
      hint: "Log each video's stats so Frame can learn what's working.",
      href: "/progress",
    },
  ];

  const score = clamp(
    parts.reduce((sum, p) => sum + p.points, 0),
    0,
    100,
  );

  return {
    score,
    tier: tierFor(score),
    parts,
    delta: null, // resolved by the hook against the saved daily baseline
    coachNote: coachNoteFor(parts),
    computedAt: new Date().toISOString(),
  };
}

/** The weakest area (lowest fill ratio) — what to nudge toward next. */
export function weakestPart(parts: ScorePart[]): ScorePart {
  return [...parts].sort((a, b) => a.points / a.max - b.points / b.max)[0];
}

const NOTE_BY_PART: Record<ScorePart["key"], string> = {
  consistency:
    "Your score climbs fastest when you show up. One quick Path step today keeps the streak alive.",
  output:
    "Shipping moves this the most — finish the video closest to done before starting a new one.",
  pipeline:
    "Set up your next moves: save a few ideas and lock in one weekly posting day.",
  insight:
    "Log each video's views and retention so Frame can learn what's working for you.",
};

/** A gentle, rule-based coach line pointing at the weakest area. */
function coachNoteFor(parts: ScorePart[]): string {
  const weakest = weakestPart(parts);
  if (weakest.points / weakest.max >= 0.85) {
    return "You're strong across the board — keep this rhythm and your score compounds.";
  }
  return NOTE_BY_PART[weakest.key];
}

/* ------------------------- daily delta baseline ------------------------- */

type LastScore = { score: number; at: string }; // at = YYYY-MM-DD

export function readLastScore(): LastScore | null {
  return readJSON<LastScore | null>(STORAGE_KEYS.creatorScore, null);
}

/**
 * Resolve "how much you've moved today" and anchor today's baseline. The
 * baseline is set the first time the score is computed each day, so the delta
 * stays consistent across the Today card and the full page instead of zeroing
 * out the moment one of them records a new value. Returns null until there's
 * real movement to show today. Stays local-only (key isn't in SYNCED_KEYS).
 */
export function resolveDelta(score: number): number | null {
  const today = toISODate(new Date());
  const last = readLastScore();
  if (!last || last.at !== today) {
    writeJSON(STORAGE_KEYS.creatorScore, { score, at: today });
    return null;
  }
  return score - last.score;
}
