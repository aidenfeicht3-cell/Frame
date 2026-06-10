import type { BrandKit } from "@/lib/ai-types";

export type Goal = "first_video" | "post_weekly" | "1k_subs";

export type Profile = {
  hasChannel: boolean; // "I have a channel" vs "starting fresh"
  niche: string;
  channelName: string; // the name they picked
  bio: string;
  goal: Goal | null;
  weeklyHours: number; // rough hours/week they can commit
  brandKit?: BrandKit; // the full AI brand kit, for later editing
  onboardedAt: string; // ISO timestamp
};

export const GOAL_LABELS: Record<Goal, string> = {
  first_video: "Post my first video",
  post_weekly: "Post every week",
  "1k_subs": "Reach 1,000 subscribers",
};
