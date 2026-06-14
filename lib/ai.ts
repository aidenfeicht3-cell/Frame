import Anthropic from "@anthropic-ai/sdk";
import type { BrandKit, ChannelToStudy, TitleRating } from "./ai-types";
import type { VideoStat } from "./analytics/types";
import type { EditingSetup, ProductionPlan } from "./builder/types";
import type {
  NextVideo,
  NextVideoContext,
  VideoEffort,
} from "./roadmap/types";
import type {
  RetentionAnalysis,
  RetentionRisk,
  RiskSeverity,
} from "./retention/types";
import { gradeForScore } from "./retention/store";
import {
  sampleBrandKit,
  sampleChannels,
  sampleNextVideos,
  samplePerformanceCoaching,
  sampleProductionPlan,
  sampleRetentionAnalysis,
  sampleTitleRating,
} from "./ai-samples";

/**
 * THE single place all Anthropic AI calls live.
 *
 * - Reads the key from the ANTHROPIC_API_KEY environment variable on the SERVER.
 *   Frame is a paid subscription product, so this is the BUSINESS's key — every
 *   subscriber gets live AI as part of their plan and never supplies a key.
 * - If there's NO key (e.g. local dev with none set), every function returns
 *   built-in sample answers, so the app still runs with zero setup.
 *
 * This file is server-only — it's imported by route handlers in app/api/*,
 * never by client components, so the key never reaches the browser.
 *
 * TODO: when you add real channel discovery, swap the canned "channels to
 * study" for the YouTube Data API (see lib/youtube.ts, coming later).
 */

// The user asked for the Sonnet family; this is the current Sonnet model.
const MODEL = "claude-sonnet-4-6";

export function aiIsLive(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  // Only constructed when a key exists (guarded by aiIsLive() at call sites).
  if (!client) client = new Anthropic();
  return client;
}

/** Ask Claude for plain text given a system + user prompt. */
async function ask(system: string, user: string): Promise<string> {
  const message = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: user }],
  });
  const block = message.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text : "";
}

/** Pull a JSON value out of a model response, tolerating stray prose/fences. */
function parseJSON<T>(text: string): T {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  // Grab from the first bracket to the last, in case of leading/trailing prose.
  const start = cleaned.search(/[[{]/);
  const end = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));
  const slice = start >= 0 && end >= 0 ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(slice) as T;
}

export async function getBrandKit(niche: string): Promise<BrandKit> {
  if (!aiIsLive()) return sampleBrandKit(niche);
  try {
    const text = await ask(
      "You are a warm, encouraging branding helper for complete-beginner YouTubers with zero subscribers. Keep everything simple and easy to act on.",
      `Return ONLY a JSON object (no markdown) shaped exactly like:
{"names":[string,string,string],"bio":string,"bannerConcept":string,"pfpConcept":string}
- names: 3 short, friendly channel-name ideas
- bio: a warm 2-sentence channel bio
- bannerConcept: 1-2 sentences describing a simple banner
- pfpConcept: 1-2 sentences describing a simple profile picture
The niche is: "${niche}".`,
    );
    const kit = parseJSON<BrandKit>(text);
    if (Array.isArray(kit.names) && kit.names.length && kit.bio) return kit;
    return sampleBrandKit(niche);
  } catch (err) {
    console.error("[ai] brand kit failed, using sample:", err);
    return sampleBrandKit(niche);
  }
}

export async function getChannelsToStudy(
  niche: string,
): Promise<ChannelToStudy[]> {
  if (!aiIsLive()) return sampleChannels(niche);
  try {
    const text = await ask(
      "You help complete-beginner YouTubers learn from existing creators. Be specific and practical. Never invent fake channels or subscriber counts.",
      `Return ONLY a JSON array (no markdown) of exactly 3 objects shaped like:
[{"name":string,"why":string,"steal":string,"searchUrl":string}]
- name: a TYPE/style of channel to study (an archetype or genuinely well-known example), not a made-up channel
- why: 1 sentence on why studying it helps a beginner
- steal: 1 concrete thing to borrow (hook, format, thumbnail style, ...)
- searchUrl: a https://www.youtube.com/results?search_query=... link to find examples
The niche is: "${niche}".`,
    );
    const list = parseJSON<ChannelToStudy[]>(text);
    if (Array.isArray(list) && list.length) {
      return list.slice(0, 3).map((c) => ({
        name: String(c.name ?? "Channels to study"),
        why: String(c.why ?? ""),
        steal: String(c.steal ?? ""),
        searchUrl:
          typeof c.searchUrl === "string" && c.searchUrl.startsWith("http")
            ? c.searchUrl
            : `https://www.youtube.com/results?search_query=${encodeURIComponent(niche)}`,
      }));
    }
    return sampleChannels(niche);
  } catch (err) {
    console.error("[ai] channels failed, using sample:", err);
    return sampleChannels(niche);
  }
}

/** Reads a video's numbers and returns 2-3 encouraging, specific next-video tips. */
export async function getPerformanceCoaching(
  input: Partial<VideoStat>,
): Promise<string[]> {
  const stat: VideoStat = {
    id: "",
    title: String(input.title ?? "your video"),
    date: String(input.date ?? ""),
    views: Number(input.views) || 0,
    likes: Number(input.likes) || 0,
    comments: Number(input.comments) || 0,
    retentionPct: Number(input.retentionPct) || 0,
  };

  if (!aiIsLive()) return samplePerformanceCoaching(stat);
  try {
    const text = await ask(
      "You are a warm, encouraging YouTube coach for a nervous beginner. Be specific and practical. Never guilt-trip; always point to the next action.",
      `A video titled "${stat.title}" got ${stat.views} views, ${stat.likes} likes, ${stat.comments} comments, and ${stat.retentionPct}% average retention.
Return ONLY a JSON array of 2-3 short strings — each a specific, encouraging tip for making the NEXT video better.`,
    );
    const tips = parseJSON<string[]>(text);
    if (Array.isArray(tips) && tips.length) {
      return tips.slice(0, 3).map((t) => String(t));
    }
    return samplePerformanceCoaching(stat);
  } catch (err) {
    console.error("[ai] coaching failed, using sample:", err);
    return samplePerformanceCoaching(stat);
  }
}

/** Builds a full, step-by-step production plan for one video idea. */
export async function getProductionPlan(
  idea: string,
  niche: string,
  setup: EditingSetup,
): Promise<ProductionPlan> {
  if (!aiIsLive()) return sampleProductionPlan(idea, niche, setup);
  try {
    const text = await ask(
      "You are a friendly producer helping a beginner YouTuber plan one video. Be concrete, encouraging, and easy to follow.",
      `Plan a video. Niche: "${niche}". Idea: "${idea}".
The creator edits with "${setup.software}" on ${setup.device === "mobile" ? "their phone" : "a computer"} — make the editChecklist specific to that.
Return ONLY a JSON object shaped exactly like:
{"hooks":[string,string,string],"titles":[string,string,string],"scriptOutline":[string,...],"shotList":[string,...],"bRoll":[string,...],"sound":[string,...],"editChecklist":[string,...],"publishChecklist":[string,...]}
Keep each array to 3-6 short, practical items.`,
    );
    const plan = parseJSON<ProductionPlan>(text);
    if (plan && Array.isArray(plan.hooks) && Array.isArray(plan.editChecklist)) {
      return plan;
    }
    return sampleProductionPlan(idea, niche, setup);
  } catch (err) {
    console.error("[ai] production plan failed, using sample:", err);
    return sampleProductionPlan(idea, niche, setup);
  }
}

/**
 * Suggests the creator's next 3 videos from their Frame IQ context. The caller
 * caches the result by an input hash (see lib/roadmap), so this runs at most
 * once per state change — never on a loop.
 */
const EFFORTS: VideoEffort[] = ["Quick", "Standard", "Ambitious"];
function normalizeEffort(v: unknown): VideoEffort {
  return EFFORTS.includes(v as VideoEffort) ? (v as VideoEffort) : "Standard";
}

export async function getNextVideos(
  ctx: NextVideoContext,
): Promise<NextVideo[]> {
  if (!aiIsLive()) return sampleNextVideos(ctx);
  try {
    const text = await ask(
      "You are a friendly YouTube strategist helping a beginner plan their next few videos. Suggest specific, achievable ideas that build on what's already working. Be concrete and encouraging.",
      `The creator makes "${ctx.niche || "general"}" videos. They've published ${ctx.publishedCount} video(s)${
        ctx.bestVideo ? `, and their best so far is "${ctx.bestVideo}"` : ""
      }. Average retention is ${ctx.avgRetentionPct}%. Stage: ${ctx.stage}.
Suggest exactly 3 strong next videos that fit this niche and build momentum.
Return ONLY a JSON array (no markdown) of 3 objects shaped like:
[{"title":string,"hook":string,"angle":string,"effort":"Quick"|"Standard"|"Ambitious"}]
- title: a clickable, specific video title
- hook: a one-sentence opening line that grabs attention
- angle: one sentence on why this video fits them / the angle to take
- effort: rough effort to make it (vary it across the three)
Keep everything beginner-friendly and achievable.`,
    );
    const list = parseJSON<NextVideo[]>(text);
    if (Array.isArray(list) && list.length) {
      return list.slice(0, 3).map((v) => ({
        title: String(v.title ?? "").trim() || "Your next video",
        hook: String(v.hook ?? "").trim(),
        angle: String(v.angle ?? "").trim(),
        effort: normalizeEffort(v.effort),
      }));
    }
    return sampleNextVideos(ctx);
  } catch (err) {
    console.error("[ai] next videos failed, using sample:", err);
    return sampleNextVideos(ctx);
  }
}

/**
 * Analyzes a pasted script (or outline / transcript) for watch-time: an overall
 * retention score + grade, what's working, the risky drop-off moments (each with
 * a fix), and first-15-seconds advice. The caller caches the result by a hash of
 * the script (see lib/retention), so this runs once per unique script.
 */
const SEVERITIES: RiskSeverity[] = ["high", "medium", "low"];
function normalizeSeverity(v: unknown): RiskSeverity {
  return SEVERITIES.includes(v as RiskSeverity) ? (v as RiskSeverity) : "medium";
}

export async function getRetentionAnalysis(
  script: string,
  niche: string,
): Promise<RetentionAnalysis> {
  const trimmed = script.trim();
  if (!aiIsLive() || !trimmed) return sampleRetentionAnalysis(trimmed, niche);
  // Bound the prompt so a very long script can't run up credits.
  const clipped = trimmed.slice(0, 8000);
  try {
    const text = await ask(
      "You are a YouTube retention and watch-time expert coaching a nervous beginner. You read a script the way the analytics graph reads the finished video — you find exactly where viewers will drop and give one concrete fix for each. Be specific, honest, and encouraging; never vague.",
      `Analyze this ${niche ? `"${niche}" ` : ""}video script for retention / watch-time.
Script:
"""
${clipped}
"""
Return ONLY a JSON object (no markdown) shaped exactly like:
{"score": number 0-100, "verdict": one short sentence, "strengths": [2-3 short strings on what's working], "risks": [{"moment": string, "issue": string, "fix": string, "severity": "high"|"medium"|"low"}], "firstFifteen": one short paragraph of advice for the first 15 seconds}
- score: overall likelihood this holds viewers (be honest; a slow intro or weak hook should cost a lot)
- risks: 2-4 specific spots where viewers will drop, each with ONE concrete fix; severity = how much it hurts retention
- firstFifteen: the most important thing to fix or keep in the opening 15 seconds
Keep everything beginner-friendly and actionable.`,
    );
    const raw = parseJSON<{
      score?: unknown;
      verdict?: unknown;
      strengths?: unknown;
      risks?: unknown;
      firstFifteen?: unknown;
    }>(text);

    const risks: RetentionRisk[] = Array.isArray(raw.risks)
      ? (raw.risks as unknown[]).slice(0, 5).map((r) => {
          const o = (r ?? {}) as Record<string, unknown>;
          return {
            moment: String(o.moment ?? "").trim() || "A drop-off moment",
            issue: String(o.issue ?? "").trim(),
            fix: String(o.fix ?? "").trim(),
            severity: normalizeSeverity(o.severity),
          };
        })
      : [];

    if (typeof raw.score === "number" && (risks.length > 0 || raw.verdict)) {
      const score = Math.max(0, Math.min(100, Math.round(raw.score)));
      return {
        score,
        grade: gradeForScore(score),
        verdict: String(raw.verdict ?? "").trim(),
        strengths: Array.isArray(raw.strengths)
          ? (raw.strengths as unknown[]).slice(0, 4).map((s) => String(s).trim())
          : [],
        risks,
        firstFifteen: String(raw.firstFifteen ?? "").trim(),
        generatedAt: new Date().toISOString(),
      };
    }
    return sampleRetentionAnalysis(trimmed, niche);
  } catch (err) {
    console.error("[ai] retention analysis failed, using sample:", err);
    return sampleRetentionAnalysis(trimmed, niche);
  }
}

/** Rates a hook/title 1-10 and suggests stronger rewrites. */
export async function getTitleRating(text: string): Promise<TitleRating> {
  if (!aiIsLive()) return sampleTitleRating(text);
  try {
    const out = await ask(
      "You are a YouTube title/hook expert helping a beginner. Be honest but encouraging.",
      `Rate this video title or hook for click-appeal and suggest stronger versions.
Title/hook: "${text}"
Return ONLY a JSON object: {"score": number 1-10, "verdict": one short sentence, "rewrites": [2-3 stronger versions as strings]}`,
    );
    const r = parseJSON<TitleRating>(out);
    if (typeof r.score === "number" && Array.isArray(r.rewrites)) {
      return {
        score: Math.max(1, Math.min(10, Math.round(r.score))),
        verdict: String(r.verdict ?? ""),
        rewrites: r.rewrites.slice(0, 3).map((s) => String(s)),
      };
    }
    return sampleTitleRating(text);
  } catch (err) {
    console.error("[ai] title rating failed, using sample:", err);
    return sampleTitleRating(text);
  }
}
