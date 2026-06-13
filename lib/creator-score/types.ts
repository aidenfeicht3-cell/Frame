/**
 * Creator Score — one momentum number (0–100) for a beginner creator, plus the
 * four areas it's built from. It's pure rule-based math derived from Frame IQ
 * (no AI, no credits in v1), so it can be computed anywhere, anytime.
 */

/** One of the four areas that make up the score. */
export type ScorePart = {
  key: "consistency" | "output" | "pipeline" | "insight";
  label: string;
  points: number; // earned (rounded)
  max: number; // possible
  hint: string; // what lifts it
  href: string; // where to act on it
};

export type CreatorScore = {
  score: number; // 0–100 (rounded)
  tier: string; // Spark | Builder | Momentum | On fire
  parts: ScorePart[];
  delta: number | null; // movement today vs the saved baseline (null = nothing to show yet)
  coachNote: string; // rule-based default; AI-enhanced + cached when enabled later
  computedAt: string; // ISO timestamp of this computation
};
