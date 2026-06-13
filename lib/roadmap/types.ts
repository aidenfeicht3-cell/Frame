/**
 * Next-Video Roadmap — the AI's suggestion for the next few videos to make,
 * derived from the creator's Frame IQ. The result is cached (keyed by a hash of
 * its inputs) so we never regenerate for the same state — see lib/roadmap/store.
 */

export type VideoEffort = "Quick" | "Standard" | "Ambitious";

export type NextVideo = {
  title: string; // a clickable, specific title
  hook: string; // a one-line opening hook
  angle: string; // why this video fits them / the angle to take
  effort: VideoEffort; // rough effort to make it
};

export type NextVideoRoadmap = {
  videos: NextVideo[]; // ~3 suggestions
  basedOn: string; // plain-language note on what it was built from
  generatedAt: string; // ISO timestamp
};

/** The compact context we feed the AI — all of it comes straight from Frame IQ. */
export type NextVideoContext = {
  niche: string;
  publishedCount: number;
  bestVideo: string;
  avgRetentionPct: number;
  stage: string;
};
