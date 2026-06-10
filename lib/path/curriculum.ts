import type { Level } from "./types";

/**
 * Season 1 — the beginner on-ramp: zero to your first published video.
 * Static, hand-written content (no AI needed). Each level is a small lesson
 * plus one concrete action. Later seasons can be added below.
 */
export const SEASON1_LEVELS: Level[] = [
  {
    id: "s1l1",
    title: "Find your first idea",
    lesson:
      "The best first video answers one small question your future viewers are already asking. You don't need to be an expert — just one step ahead of them.",
    action: "Write down 3 video ideas. Don't overthink it — quantity first.",
    estMinutes: 5,
  },
  {
    id: "s1l2",
    title: "Pick your winner",
    lesson:
      "Choose the idea you'd be most excited to watch yourself. Genuine excitement is the one thing you can't fake on camera.",
    action: "Pick the one idea you'll make first.",
    estMinutes: 2,
  },
  {
    id: "s1l3",
    title: "Write a scroll-stopping hook",
    lesson:
      "The first 5 seconds decide if people stay. Open with the payoff or a bold promise — skip the long 'hey guys, welcome back' intro.",
    action: "Write the first 2 sentences you'll say on camera.",
    estMinutes: 10,
  },
  {
    id: "s1l4",
    title: "Outline your video",
    lesson:
      "A simple outline keeps you on track and cuts the rambling. Three to five bullet points is plenty for your first one.",
    action: "List the 3–5 points your video will cover, in order.",
    estMinutes: 10,
  },
  {
    id: "s1l5",
    title: "Set up your shot",
    lesson:
      "Good enough beats perfect. Face a window for light, put the camera at eye level, and pick the quietest spot you have.",
    action: "Record a 20-second test clip and watch it back.",
    estMinutes: 10,
  },
  {
    id: "s1l6",
    title: "Film your video",
    lesson:
      "Mistakes are normal — just keep rolling and restart the sentence. You'll trim the rest later. Done beats perfect.",
    action: "Film your video from start to finish.",
    estMinutes: 30,
  },
  {
    id: "s1l7",
    title: "Make a simple thumbnail",
    lesson:
      "A great thumbnail has one clear subject and a few big, readable words. Simple always wins on a small phone screen.",
    action: "Make a thumbnail with one bold piece of text.",
    estMinutes: 15,
  },
  {
    id: "s1l8",
    title: "Publish and celebrate",
    lesson:
      "Hitting publish is the whole game — most people never do. You're about to be someone who did. 🎉",
    action: "Upload your first video.",
    estMinutes: 5,
  },
];

export const SEASON2_PREVIEW = {
  title: "Season 2 · Consistency & growth",
  blurb:
    "Hooks that hold, posting on a rhythm, and reading your numbers. Unlocks after Season 1.",
};
