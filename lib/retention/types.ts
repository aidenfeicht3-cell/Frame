/**
 * Retention Analyzer — AI feedback on a script (or outline / transcript) for
 * watch-time. The creator pastes their script and Frame returns an overall
 * retention score + grade, what's working, the risky moments where viewers are
 * likely to drop (each with a concrete fix), and advice for the first 15
 * seconds. The result is cached by a hash of the script text (see
 * lib/retention/store) so re-analyzing the same script costs zero credits.
 */

export type RiskSeverity = "high" | "medium" | "low";

/** One spot where viewers are likely to drop off — and how to fix it. */
export type RetentionRisk = {
  moment: string; // where in the video this is (e.g. "The first 5–10 seconds")
  issue: string; // why viewers may leave here
  fix: string; // one concrete change that holds them
  severity: RiskSeverity; // how big a deal it is
};

export type RetentionAnalysis = {
  score: number; // overall retention score, 0–100
  grade: string; // letter grade derived from the score (A–F)
  verdict: string; // one-line plain-language summary
  strengths: string[]; // what's already working
  risks: RetentionRisk[]; // drop-off risks, each with a fix
  firstFifteen: string; // specific advice for the first 15 seconds
  generatedAt: string; // ISO timestamp
};
