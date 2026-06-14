import type { BrandKit, ChannelToStudy, TitleRating } from "./ai-types";
import type { VideoStat } from "./analytics/types";
import type { EditingSetup, ProductionPlan } from "./builder/types";
import type { NextVideo, NextVideoContext } from "./roadmap/types";
import type { RetentionAnalysis, RetentionRisk } from "./retention/types";
import { gradeForScore } from "./retention/store";
import type {
  VideoSnapshot,
  ViralAnalysis,
  ViralReason,
} from "./viral/types";

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

/**
 * Three niche-aware "next video" ideas for the no-key case. They mix a low-lift
 * list video, a personal challenge, and an evergreen guide so a beginner always
 * has an easy, a fun, and an anchor option to pick from.
 */
export function sampleNextVideos(ctx: NextVideoContext): NextVideo[] {
  const n = ctx.niche.trim() || "your topic";
  const t = titleCase(n);
  const lowRetention = ctx.avgRetentionPct > 0 && ctx.avgRetentionPct < 40;

  return [
    {
      title: `5 ${t} mistakes beginners make`,
      hook: lowRetention
        ? `"If your ${n} isn't working yet, it's probably one of these five things."`
        : `"If you're new to ${n}, you're probably making at least one of these."`,
      angle:
        "List videos are quick to script and easy to follow — high value for low effort, perfect while you build momentum.",
      effort: "Quick",
    },
    {
      title: `I tried ${n} for 7 days — here's what happened`,
      hook: `"Everyone says ${n} is worth it, so I put it to the test for a week."`,
      angle:
        "A personal challenge format builds trust fast and is genuinely fun to watch — lean into your own story.",
      effort: "Standard",
    },
    {
      title: ctx.bestVideo
        ? `The complete beginner's guide to ${n} (everything I've learned)`
        : `The complete beginner's guide to ${n}`,
      hook: `"Everything you need to start ${n}, in one video."`,
      angle:
        "A flagship guide keeps pulling in new viewers for months — your evergreen anchor video.",
      effort: "Ambitious",
    },
  ];
}

/**
 * Rule-based retention feedback for the no-key case. It reads the pasted script
 * the way a coach skims it: is the intro slow, is the hook weak, are there walls
 * of text, are there any pattern interrupts to re-grab attention? Each problem
 * it spots becomes a risk card with a concrete fix, and it scores the script out
 * of 100. Niche-aware so the advice feels written for this creator.
 */
export function sampleRetentionAnalysis(
  script: string,
  niche: string,
): RetentionAnalysis {
  const text = script.trim();
  const n = niche.trim() || "your topic";
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const openingLower = words.slice(0, 40).join(" ").toLowerCase();
  const questions = (text.match(/\?/g) || []).length;

  const risks: RetentionRisk[] = [];
  const strengths: string[] = [];
  let score = 80; // start strong, deduct for each drop-off risk we spot

  // 1) Slow / housekeeping intro — the #1 early-drop cause for beginners.
  const slowIntro =
    /(hey guys|hey everyone|what'?s up guys|welcome back|in this video,? i'?m going to|in today'?s video|before we (get )?start|don'?t forget to (like|subscribe)|smash that|make sure to (like|subscribe)|my name is)/.test(
      openingLower,
    );
  if (slowIntro) {
    score -= 16;
    risks.push({
      moment: "The first 5–10 seconds",
      issue:
        "The video opens with a greeting or housekeeping instead of a reason to keep watching — this is exactly where most viewers leave.",
      fix: "Cut the intro and open on the payoff: the result, the boldest claim, or the question the video answers. Save the welcome and the subscribe ask for later.",
      severity: "high",
    });
  } else {
    strengths.push(
      "Your opening skips the generic intro and gets going — that protects those fragile first seconds.",
    );
  }

  // 2) Weak hook — no curiosity trigger in the first line.
  const strongHook =
    /\?|\byou\b|\byour\b|\bhow\b|\bwhy\b|\bnever\b|\bstop\b|\bmistake\b|\bsecret\b|\d/.test(
      openingLower,
    );
  if (!strongHook) {
    score -= 12;
    risks.push({
      moment: "The hook (first line)",
      issue:
        "The first line doesn't create curiosity or speak to the viewer — there's no question, promise, or stakes to pull them in.",
      fix: `Rewrite line one as a promise or a question, e.g. “Here's the ${n} mistake that's quietly costing you views.”`,
      severity: "high",
    });
  } else {
    strengths.push(
      "There's a curiosity trigger up front (a question, a “you”, or a number) — that earns the next few seconds.",
    );
  }

  // 3) Walls of text — long unbroken stretches with no visual change.
  const longParas = paragraphs.filter(
    (p) => p.split(/\s+/).filter(Boolean).length > 80,
  );
  if (longParas.length > 0) {
    score -= 9;
    risks.push({
      moment: `${longParas.length} long stretch${longParas.length > 1 ? "es" : ""} of unbroken talking`,
      issue:
        "One or more sections run on without a break, so there's nothing to reset attention and viewers drift.",
      fix: "Split each long block into shorter beats and plan a visual change — a cut, b-roll, or on-screen text — every 5–10 seconds.",
      severity: "medium",
    });
  } else if (paragraphs.length >= 3) {
    strengths.push(
      "Your script is broken into short, digestible sections instead of one wall of text.",
    );
  }

  // 4) Missing pattern interrupts across a long script.
  if (wordCount > 180 && questions === 0) {
    score -= 9;
    risks.push({
      moment: "The middle third",
      issue:
        "There are no questions or pattern interrupts to re-grab attention, so the middle can sag and lose people.",
      fix: "Add a rhetorical question or a quick “but here's the thing…” turn every 30–45 seconds to reset attention.",
      severity: "medium",
    });
  } else if (questions > 0) {
    strengths.push(
      "You ask the viewer questions — small pattern interrupts that pull people back in.",
    );
  }

  // 5) Very long script — pacing risk.
  if (wordCount > 1200) {
    score -= 6;
    risks.push({
      moment: "Overall length",
      issue: `At ~${wordCount} words this is a long watch, and retention usually slides the longer it runs.`,
      fix: "Cut anything that doesn't serve the one promise of the video. A tighter, shorter cut almost always retains better early on.",
      severity: "low",
    });
  }

  // 6) Too short to judge well — gentle note, not a real penalty.
  if (wordCount < 40) {
    risks.push({
      moment: "Whole script",
      issue:
        "There isn't much text here yet, so this is a light read rather than a full analysis.",
      fix: "Paste your full script, outline, or transcript for sharper, moment-by-moment feedback.",
      severity: "low",
    });
  }

  // Strength: the call-to-action lands later, once it's been earned.
  const tail = lower.slice(Math.floor(lower.length * 0.6));
  if (/(subscribe|comment|let me know|check out|next video|down below)/.test(tail)) {
    strengths.push(
      "Your call-to-action lands later in the video, once you've earned it — good placement.",
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "You've got a real draft down — that's the hard part. The fixes below are small, high-leverage tweaks.",
    );
  }
  if (risks.length === 0) {
    strengths.push(
      "No major drop-off risks jumped out — your structure is doing its job.",
    );
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const verdict =
    score >= 80
      ? "Strong retention shape — a couple of tweaks and this holds attention well."
      : score >= 60
        ? "Solid bones, with a few spots where viewers may drift."
        : score >= 40
          ? "Some real drop-off risks here — the fixes below will lift your watch-time."
          : "The opening and pacing need work before this will hold viewers.";

  const firstFifteen =
    slowIntro || !strongHook
      ? `Open cold on the single most interesting moment of your ${n} video — no “hey guys”, no channel intro. Make the very first sentence the promise or the question, flash where it's heading, then start. Earn the next 15 seconds before you ask for anything.`
      : `Your first 15 seconds already lead with substance — now tighten them: make the opening sentence the clearest version of your promise, drop any throat-clearing words, and tease what's coming so viewers stay for the whole ${n} video.`;

  return {
    score,
    grade: gradeForScore(score),
    verdict,
    strengths: strengths.slice(0, 4),
    risks: risks.slice(0, 5),
    firstFifteen,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Rule-based "why it went viral" analysis for the no-key case. It reads the
 * video's real title + public stats and reasons about the five levers (title,
 * thumbnail, hook, format, timing) the way a coach would, then turns each into a
 * reason card plus a short list of repeatable moves for the creator's niche.
 * The thumbnail reason is explicitly an inference (we can't see the image).
 */
export function sampleViralAnalysis(
  video: VideoSnapshot,
  niche: string,
): ViralAnalysis {
  const n = niche.trim() || "your topic";
  const title = video.title.trim() || "this video";
  const lower = title.toLowerCase();

  const hasNumber = /\d/.test(title);
  const isQuestion = title.includes("?");
  const hasBracket = /[[(].+[\])]/.test(title);
  const isHowTo = /(how to|how i|guide|tutorial|step[- ]by[- ]step)/.test(lower);
  const isChallenge =
    /(\b\d+\s*(day|days|hour|hours|week|weeks)\b|i tried|i spent|challenge|for \d+)/.test(
      lower,
    );
  const isVs = /(\bvs\b|versus|tier list|ranking|ranked|worst|best)/.test(lower);
  const hasPowerWord =
    /(secret|mistake|truth|honest|never|stop|ultimate|easy|fast|nobody|everyone|why|finally|insane|crazy|wish)/.test(
      lower,
    );

  const views = video.views;
  const likeRate = views ? (video.likes / views) * 100 : 0;
  const commentRate = views ? (video.comments / views) * 100 : 0;

  const reasons: ViralReason[] = [];

  // 1) Title — the single biggest click-through lever.
  const titleBits: string[] = [];
  if (hasNumber) titleBits.push("a specific number");
  if (isQuestion) titleBits.push("an open question");
  if (hasBracket) titleBits.push("a bracketed promise");
  if (hasPowerWord) titleBits.push("a curiosity word");
  reasons.push({
    factor: "title",
    label: titleBits.length
      ? `The title leans on ${titleBits.join(" + ")}`
      : "A clear, specific title",
    insight: `"${title}" makes one concrete promise you can grasp in a second${
      hasNumber ? " — the number sets a clear expectation" : ""
    }. Specific beats clever for click-through.`,
  });

  // 2) Thumbnail — inferred, since we can't see the image.
  reasons.push({
    factor: "thumbnail",
    label: "A thumbnail that pairs with — not repeats — the title",
    insight:
      "Videos at this scale almost always pair a high-contrast, single-subject thumbnail with the title so the two together tell one story. Picture one bold focal point and 1–3 huge words.",
  });

  // 3) Hook — the first 5 seconds.
  reasons.push({
    factor: "hook",
    label: isChallenge ? "A stakes-driven opening" : "A payoff-first opening",
    insight: isChallenge
      ? "The format implies the first seconds set the stakes — what was attempted and what's on the line — so viewers stay to see how it ends."
      : "Hits this size almost always open on the payoff or boldest claim in the first 5 seconds, with no slow intro, which protects early retention.",
  });

  // 4) Format — the repeatable container.
  const formatLabel = isChallenge
    ? "A challenge / experiment format"
    : isVs
      ? "A comparison / ranking format"
      : isHowTo
        ? "A focused how-to format"
        : "A proven, repeatable format";
  reasons.push({
    factor: "format",
    label: formatLabel,
    insight: isChallenge
      ? "Challenge formats build narrative tension — a beginning, a struggle, a result — that pulls people to the end, and they template again easily."
      : isVs
        ? "Comparisons and rankings invite the viewer to take a side, which lifts both watch-time and comments."
        : isHowTo
          ? "A focused how-to delivers obvious value, so it keeps earning views from search and suggested long after upload."
          : "It uses a structure viewers already know how to watch, which lowers the effort to press play.",
  });

  // 5) Timing / momentum — engagement is the proof the algorithm leaned on.
  const proof =
    likeRate >= 4
      ? `An unusually high like rate (~${likeRate.toFixed(1)}% of views) told the algorithm people loved it, so it kept getting pushed.`
      : commentRate >= 0.5
        ? `A strong comment rate (~${commentRate.toFixed(2)}% of views) signalled a conversation worth surfacing.`
        : `Steady engagement against its ${views.toLocaleString()} views signalled the algorithm to keep recommending it.`;
  reasons.push({
    factor: "timing",
    label: "Engagement that fed the algorithm",
    insight: `${proof} Early likes and comments in the first 24–48 hours are what turn a good video into a viral one.`,
  });

  const repeatable = [
    hasNumber
      ? `Borrow the title shape for ${n}: lead with a number or a bold claim, then one concrete promise.`
      : `Give your next ${n} title one specific, concrete promise — not a clever phrase.`,
    isChallenge
      ? `Try this challenge format on ${n}: "I tried ___ for X days" gives you a built-in beginning, middle, and end.`
      : `Reuse this ${formatLabel.toLowerCase()} for ${n} and template it so you can make it again quickly.`,
    `Open your ${n} video on the payoff in the first 5 seconds — show the result before you explain it.`,
    "Design the thumbnail and title as a pair: one bold subject, 1–3 huge words, no repeated text.",
  ].slice(0, 4);

  const verdict = isChallenge
    ? "It likely took off because a challenge format turns curiosity into a story people finish."
    : hasNumber || hasPowerWord
      ? "The biggest driver is a title + thumbnail combo that promises one specific, irresistible thing."
      : "It earned its views by pairing a proven format with a clear promise and a payoff-first opening.";

  return {
    verdict,
    reasons: reasons.slice(0, 5),
    repeatable,
    generatedAt: new Date().toISOString(),
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
  if (/\byou\b|\byour\b/.test(lower)) score += 1; // speaks to the viewer
  if (t.includes("?")) score += 1; // a question pulls curiosity
  if (t.length >= 20 && t.length <= 60) score += 1; // clickable, fits on mobile
  if (t.length > 0 && t.length < 15) score -= 1; // too vague to promise much
  if (t.length > 72) score -= 1; // gets cut off on mobile
  if (/[A-Z]{6,}/.test(t.replace(/\s/g, ""))) score -= 1; // shouty / clickbait caps
  if (!t) score = 1;
  score = Math.max(1, Math.min(10, score));

  const verdict =
    score >= 8
      ? "Strong — this would make me click."
      : score >= 6
        ? "Decent — a small tweak could push it higher."
        : "Needs work — let's make it pull people in.";

  const base = t.replace(/[?.!]+$/, "").trim() || "your topic";
  const lowerBase = base.toLowerCase();
  const rewrites = [
    `How to ${lowerBase} (even if you're a total beginner)`,
    `${titleCase(base)}: the 5 mistakes to avoid`,
    `I tried ${lowerBase} for a week — here's what happened`,
  ];

  return { score, verdict, rewrites };
}
