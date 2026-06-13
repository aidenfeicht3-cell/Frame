import { getProfile } from "@/lib/profile/store";
import { GOAL_LABELS } from "@/lib/profile/types";
import { getEditingSetup, getProjects } from "@/lib/builder/store";
import type { VideoProject } from "@/lib/builder/types";
import { getStageMap } from "@/lib/projects/store";
import type { StageId } from "@/lib/projects/types";
import { getIdeas } from "@/lib/ideas/store";
import { getVideoStats } from "@/lib/analytics/store";
import { computeStreak, getActiveDates, weekActiveCount } from "@/lib/streak";
import { getCadence, getScheduledPosts } from "@/lib/calendar/store";
import { toISODate, WEEKDAY_LABELS } from "@/lib/calendar/dates";
import type { FrameIQ, IQTip } from "./types";

/**
 * A project counts as published once its production tracker reaches "published"
 * — or, for older projects with no tracker entry yet, once the builder's
 * Publish step is done (the same seed rule lib/projects uses).
 */
function isPublished(p: VideoProject, stages: StageId[] | undefined): boolean {
  if (stages?.includes("published")) return true;
  return p.completedSteps?.includes("publish") ?? false;
}

/** A short, encouraging label for where the creator is right now. */
function deriveStage(publishedCount: number, projectCount: number): string {
  if (publishedCount >= 4) return "Finding your rhythm";
  if (publishedCount >= 1) return "Shipping videos";
  if (projectCount >= 1) return "Building your first video";
  return "Just getting started";
}

/**
 * Build 2–3 gentle, rule-based tips from the signals. Ordered by what helps a
 * beginner most; we keep the top three. Always returns at least one (a positive
 * note when there's nothing to fix) so the card never looks broken.
 */
function buildTips(iq: {
  ideaCount: number;
  projectCount: number;
  inProgressCount: number;
  publishedCount: number;
  videoCount: number;
  avgRetentionPct: number;
  weeklyHours: number;
  cadenceEnabled: boolean;
  streak: number;
}): IQTip[] {
  const tips: IQTip[] = [];

  if (iq.ideaCount === 0) {
    tips.push({
      id: "ideas",
      text: "Your idea vault is empty — jot down 3 video ideas so you never start from a blank page.",
      href: "/ideas",
      cta: "Add ideas",
    });
  }
  if (iq.projectCount === 0) {
    tips.push({
      id: "first-video",
      text: "You haven't planned a video yet. Frame breaks your first one into small, doable steps.",
      href: "/builder",
      cta: "Plan a video",
    });
  }
  if (iq.inProgressCount > 0) {
    tips.push({
      id: "finish",
      text: `You have ${iq.inProgressCount} video${iq.inProgressCount > 1 ? "s" : ""} in progress — finishing one beats starting three.`,
      href: "/projects",
      cta: "Finish it",
    });
  }
  if (iq.streak === 0) {
    tips.push({
      id: "streak",
      text: "Your streak is at zero. One small Path step today lights the flame.",
      href: "/path",
      cta: "Do a step",
    });
  }
  if (!iq.cadenceEnabled && iq.weeklyHours >= 4) {
    tips.push({
      id: "cadence",
      text: `You've set aside ~${iq.weeklyHours}h a week — pick a weekly posting day so that time turns into videos.`,
      href: "/calendar",
      cta: "Set a cadence",
    });
  }
  if (iq.publishedCount >= 1 && iq.videoCount === 0) {
    tips.push({
      id: "log-stats",
      text: "Log your published videos' stats so Frame can spot what's actually working.",
      href: "/progress",
      cta: "Log stats",
    });
  }
  if (iq.videoCount > 0 && iq.avgRetentionPct > 0 && iq.avgRetentionPct < 40) {
    tips.push({
      id: "retention",
      text: `Your average retention is ${iq.avgRetentionPct}%. A stronger first 10 seconds is the fastest way to lift it.`,
      href: "/title-tester",
      cta: "Test a hook",
    });
  }

  if (tips.length === 0) {
    tips.push(
      iq.streak >= 3
        ? {
            id: "keep-going",
            text: `${iq.streak}-day streak and ${iq.publishedCount} videos shipped — you're building real momentum. Keep the rhythm.`,
            href: "/path",
            cta: "Continue",
          }
        : {
            id: "next-video",
            text: "You're set up and moving. Plan your next video to keep the momentum going.",
            href: "/builder",
            cta: "Plan next",
          },
    );
  }

  return tips.slice(0, 3);
}

/**
 * Derive the whole Frame IQ profile from the stores we already keep. Pure read,
 * no AI, no new storage — SSR-safe (the underlying readJSON returns fallbacks
 * on the server, so this yields an empty/"not onboarded" profile there).
 */
export function getFrameIQ(): FrameIQ {
  const profile = getProfile();
  const setup = getEditingSetup();
  const projects = getProjects();
  const stageMap = getStageMap();
  const ideas = getIdeas();
  const stats = getVideoStats();
  const activeDates = getActiveDates();
  const cadence = getCadence();
  const posts = getScheduledPosts();

  // Projects + stages
  let publishedCount = 0;
  for (const p of projects) {
    if (isPublished(p, stageMap[p.id])) publishedCount++;
  }
  const projectCount = projects.length;
  const inProgressCount = projectCount - publishedCount;

  // Logged video stats
  const videoCount = stats.length;
  const totalViews = stats.reduce((sum, s) => sum + (s.views || 0), 0);
  const avgViews = videoCount ? Math.round(totalViews / videoCount) : 0;
  const avgRetentionPct = videoCount
    ? Math.round(stats.reduce((sum, s) => sum + (s.retentionPct || 0), 0) / videoCount)
    : 0;
  const bestVideo = videoCount
    ? [...stats].sort((a, b) => (b.views || 0) - (a.views || 0))[0].title
    : "";

  // Streak / activity
  const streak = computeStreak(activeDates);
  const week = weekActiveCount(activeDates);

  // Calendar cadence + upcoming
  const todayIso = toISODate(new Date());
  const upcomingUploads = posts.filter(
    (p) => p.status !== "published" && p.date >= todayIso,
  ).length;
  const cadenceLabel = cadence.enabled
    ? `weekly on ${WEEKDAY_LABELS[cadence.weekday]}s`
    : "no set schedule yet";
  const cadenceShort = cadence.enabled ? "weekly" : "now and then";

  // Setup
  const deviceLabel = setup.device === "mobile" ? "phone" : "computer";
  const editingApp = setup.software;

  // Identity
  const niche = profile?.niche?.trim() || "";
  const channelName = profile?.channelName?.trim() || "";
  const goalLabel = profile?.goal ? GOAL_LABELS[profile.goal] : "";
  const weeklyHours = profile?.weeklyHours ?? 0;

  const stage = deriveStage(publishedCount, projectCount);

  // The one-line, plain-language summary — the compact context AI will read.
  const nicheWord = niche || "new";
  const shipped = `${publishedCount} video${publishedCount === 1 ? "" : "s"} shipped`;
  const summary = `You're a ${nicheWord} creator editing in ${editingApp} on a ${deviceLabel}, posting ${cadenceShort}. ${shipped}, ${streak}-day streak.`;

  const tips = buildTips({
    ideaCount: ideas.length,
    projectCount,
    inProgressCount,
    publishedCount,
    videoCount,
    avgRetentionPct,
    weeklyHours,
    cadenceEnabled: cadence.enabled,
    streak,
  });

  return {
    onboarded: Boolean(profile),
    channelName,
    niche,
    goalLabel,
    weeklyHours,
    editingApp,
    device: setup.device,
    deviceLabel,
    projectCount,
    publishedCount,
    inProgressCount,
    ideaCount: ideas.length,
    videoCount,
    totalViews,
    avgViews,
    avgRetentionPct,
    bestVideo,
    streak,
    weekActiveCount: week,
    upcomingUploads,
    cadenceLabel,
    cadenceShort,
    stage,
    summary,
    tips,
  };
}
