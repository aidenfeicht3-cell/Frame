import Anthropic from "@anthropic-ai/sdk";
import type { BrandKit, ChannelToStudy } from "./ai-types";
import type { VideoStat } from "./analytics/types";
import {
  sampleBrandKit,
  sampleChannels,
  samplePerformanceCoaching,
} from "./ai-samples";

/**
 * THE single place all Anthropic AI calls live.
 *
 * - Reads the key from the ANTHROPIC_API_KEY environment variable.
 * - If there's NO key, every function returns built-in sample answers, so the
 *   whole app works with zero setup. Add a key in .env.local to go live.
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
