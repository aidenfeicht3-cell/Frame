import type { BrandKit, ChannelToStudy } from "./ai-types";
import type { VideoStat } from "./analytics/types";

/**
 * Built-in sample answers used when there's NO Anthropic API key.
 * They're tailored to the user's niche so the app feels alive immediately,
 * with zero setup. Add a key (Settings) to get real AI-generated versions.
 */

function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function search(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function sampleBrandKit(niche: string): BrandKit {
  const n = niche.trim() || "your topic";
  const t = titleCase(n);
  return {
    names: [`${t} Lab`, `The ${t} Corner`, `${t}, Simplified`],
    bio: `Helping total beginners get into ${n} without the overwhelm. New, friendly videos every week — come learn with me.`,
    bannerConcept: `Your channel name in big bold text on a deep-blue background, a simple ${n} icon on the right, and "New videos weekly" underneath so visitors instantly know what they get.`,
    pfpConcept: `A bright, friendly profile photo — your face (or one bold ${n} symbol) centered on a solid blue circle, kept simple so it stays clear at tiny sizes.`,
  };
}

export function sampleChannels(niche: string): ChannelToStudy[] {
  const n = niche.trim() || "your topic";
  const t = titleCase(n);
  return [
    {
      name: `Top ${t} creators`,
      why: `See what already works in ${n} — the formats, lengths, and thumbnails that pull people in.`,
      steal: `Study their first 10 seconds (the hook) and how each title promises one clear thing.`,
      searchUrl: search(`best ${n} youtube channels`),
    },
    {
      name: `Beginner-friendly ${t} channels`,
      why: `Channels that explain ${n} simply are the closest model for your early videos.`,
      steal: `Copy how they turn a big topic into one small, do-able lesson per video.`,
      searchUrl: search(`${n} for beginners`),
    },
    {
      name: `New & fast-growing ${t} channels`,
      why: `Smaller, newer channels show what's working right now for people starting from zero.`,
      steal: `Look at their thumbnails and titles — simple, high-contrast, one idea each.`,
      searchUrl: search(`new ${n} channel`),
    },
  ];
}

export function samplePerformanceCoaching(stat: VideoStat): string[] {
  const tips: string[] = [];

  // Retention is the biggest signal for a beginner.
  if (stat.retentionPct > 0 && stat.retentionPct < 40) {
    tips.push(
      "Your hook is the biggest lever right now — open with the payoff in the first 5 seconds, then explain how you got there.",
    );
  } else if (stat.retentionPct >= 40) {
    tips.push(
      `Strong retention at ${Math.round(stat.retentionPct)}% — notice what kept people watching and do more of that next time.`,
    );
  } else {
    tips.push(
      "Add your retention % next time (YouTube Studio → Analytics) — it's the single best number for improving your hooks.",
    );
  }

  // Likes relative to views = how much it resonated.
  const likeRate = stat.views ? (stat.likes / stat.views) * 100 : 0;
  if (likeRate < 3) {
    tips.push(
      "Ask for the like at a natural high point — right after you deliver something useful, not at the very start.",
    );
  } else {
    tips.push(
      "People are engaging well — add one clear 'subscribe for [the next thing]' so they come back.",
    );
  }

  tips.push(
    `Reuse what worked: keep the title pattern from "${stat.title}" and change only the topic for your next video.`,
  );

  return tips.slice(0, 3);
}
