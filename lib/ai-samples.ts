import type { BrandKit, ChannelToStudy, TitleRating } from "./ai-types";
import type { VideoStat } from "./analytics/types";
import type { EditingSetup, ProductionPlan } from "./builder/types";

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

/** Editor-specific edit tips so the "Edit" step adapts to the user's tools. */
function editTips(setup: EditingSetup): string[] {
  const deviceTip =
    setup.device === "mobile"
      ? "Editing on your phone is totally fine — keep clips short and export at 1080p."
      : "On your computer, export at 1080p H.264 — best balance of quality and file size.";

  const bySoftware: Record<string, string> = {
    CapCut:
      "In CapCut: run Auto Captions, then bump your key words bigger and bolder.",
    iMovie:
      "In iMovie: use the magnetic timeline to drag clips tight, and add a title over your hook.",
    "Premiere Pro":
      "In Premiere: cut with the razor (C) to kill dead air, and use the Essential Graphics panel for captions.",
    "DaVinci Resolve":
      "In DaVinci: cut on the Edit page, then lightly even out skin tones on the Color page.",
    "Final Cut Pro":
      "In Final Cut: use the magnetic timeline and the built-in captions for fast, clean subtitles.",
    Filmora:
      "In Filmora: use Auto Captions and one simple transition between sections — don't overdo effects.",
  };
  const softwareTip =
    bySoftware[setup.software] ??
    "Whatever editor you use: cut tight, add captions, and keep transitions simple.";

  return [
    "Watch it once and cut every 'um' and dead pause first — it tightens the whole video.",
    softwareTip,
    "Add captions — most people watch on mute.",
    deviceTip,
    "Keep it as short as it can be while still being good. Shorter usually wins early on.",
  ];
}

export function sampleProductionPlan(
  idea: string,
  niche: string,
  setup: EditingSetup,
): ProductionPlan {
  const topic = idea.trim() || `your ${niche || "video"} idea`;

  return {
    hooks: [
      `"Most people get ${topic} wrong — here's the simple way."`,
      `"In 60 seconds, you'll know exactly how to ${topic.toLowerCase()}."`,
      `"I wish someone told me this about ${topic} when I started."`,
    ],
    titles: [
      `${topic} (the beginner-friendly way)`,
      `How to ${topic.toLowerCase()} — even if you're brand new`,
      `${topic}: what I wish I knew first`,
    ],
    scriptOutline: [
      "Hook: open with the payoff or a bold promise (first 5 seconds).",
      "Why it matters: one sentence on why the viewer should care.",
      "The steps: walk through your 3–4 main points, one at a time.",
      "A quick example or demo so it feels real.",
      "Wrap-up: recap in one line and tell them what to watch next.",
    ],
    shotList: [
      "Talking-head intro for the hook (eye-level, window light).",
      "Main explanation to camera for each point.",
      "A close-up or screen recording of the example/demo.",
      "A short outro shot for your call-to-subscribe.",
    ],
    bRoll: [
      `A few clips that show ${niche || "your topic"} in action to cut to while you talk.`,
      "Close-ups of anything you mention (hands, screen, objects).",
      "One establishing shot to set the scene at the start.",
    ],
    sound: [
      "Mood: upbeat but calm — energetic enough to hold attention, not distracting.",
      "Grab a free track from Pixabay or YouTube Audio Library and keep it low under your voice.",
      "Add 1–2 subtle sound effects (a soft whoosh on transitions) — don't overdo it.",
    ],
    editChecklist: editTips(setup),
    publishChecklist: [
      "Final title: clear, specific, and clickable (no clickbait you can't deliver).",
      "Thumbnail: one clear subject + a few big readable words.",
      "Description: one sentence on what the video is, plus any links.",
      "Add 3–5 relevant tags and pick the right category.",
      "Watch the first 10 seconds one last time — then hit publish. 🎉",
    ],
  };
}

const POWER_WORDS =
  /(how|why|secret|mistake|stop|never|best|easy|fast|ultimate|beginner|honest|truth|tried|guide|simple)/;

export function sampleTitleRating(text: string): TitleRating {
  const t = text.trim();
  const lower = t.toLowerCase();

  let score = 5;
  if (/\d/.test(t)) score += 1; // a number adds specificity
  if (POWER_WORDS.test(lower)) score += 1; // curiosity / power word
  if (t.length >= 20 && t.length <= 60) score += 1; // clickable length
  if (t.length > 72) score -= 1; // too long for mobile
  if (t.includes("?")) score += 1; // a question pulls curiosity
  if (!t) score = 1;
  score = Math.max(1, Math.min(10, score));

  const verdict =
    score >= 8
      ? "Strong — this would make me click."
      : score >= 6
        ? "Decent — a small tweak could push it higher."
        : "Needs work — let's make it pull people in.";

  const base = t.replace(/[?.!]+$/, "") || "your topic";
  const rewrites = [
    `How to ${base.toLowerCase()} (the easy way)`,
    `${base}: 5 mistakes beginners make`,
    `I tried ${base.toLowerCase()} so you don't have to`,
  ];

  return { score, verdict, rewrites };
}
