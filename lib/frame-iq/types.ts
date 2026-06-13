import type { Device } from "@/lib/builder/types";

/** A gentle, rule-based nudge derived from the creator's own data — no AI. */
export type IQTip = {
  id: string;
  text: string;
  href: string; // where to act on it
  cta: string; // short button label
};

/**
 * Frame IQ — a single, compact "creator profile" DERIVED (computed, never
 * stored) from everything Frame already knows: the saved profile, editing
 * setup, and history (projects, ideas, video stats, streak, calendar).
 *
 * It's written in plain language for the user AND kept small + flat on purpose,
 * so the later AI features can read it as cheap context instead of re-reading
 * every store themselves.
 */
export type FrameIQ = {
  onboarded: boolean;

  // Who they are (from lib/profile)
  channelName: string;
  niche: string;
  goalLabel: string;
  weeklyHours: number;

  // How they work (from lib/builder editingSetup)
  editingApp: string;
  device: Device;
  deviceLabel: string; // "phone" | "computer"

  // What they've done (history signals)
  projectCount: number;
  publishedCount: number;
  inProgressCount: number;
  ideaCount: number;
  videoCount: number; // videos with logged stats
  totalViews: number;
  avgViews: number;
  avgRetentionPct: number;
  bestVideo: string; // title of the top-viewed logged video ("" if none)
  streak: number;
  weekActiveCount: number;
  upcomingUploads: number;
  cadenceLabel: string; // "weekly on Tuesdays" | "no set schedule yet"
  cadenceShort: string; // "weekly" | "now and then"

  // Derived
  stage: string; // short, encouraging status — e.g. "Shipping videos"
  summary: string; // the one-paragraph, plain-language sentence
  tips: IQTip[]; // 2–3 gentle, rule-based tips
};
