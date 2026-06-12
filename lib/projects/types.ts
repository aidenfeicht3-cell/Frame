import {
  Lightbulb,
  Search,
  Pencil,
  Mic,
  Image as ImageIcon,
  Film,
  Upload,
  Rocket,
  type LucideIcon,
} from "lucide-react";

/** The production lifecycle of a single video, idea -> published. */
export type StageId =
  | "idea"
  | "research"
  | "script"
  | "voiceover"
  | "assets"
  | "editing"
  | "upload"
  | "published";

export type Stage = {
  id: StageId;
  label: string;
  icon: LucideIcon;
  hint: string;
};

export const PRODUCTION_STAGES: Stage[] = [
  { id: "idea", label: "Idea", icon: Lightbulb, hint: "You've picked what to make." },
  { id: "research", label: "Research", icon: Search, hint: "Topic, angle, and references gathered." },
  { id: "script", label: "Script", icon: Pencil, hint: "Written and ready to record." },
  { id: "voiceover", label: "Voiceover", icon: Mic, hint: "Narration recorded." },
  { id: "assets", label: "Assets", icon: ImageIcon, hint: "B-roll, music, and visuals collected." },
  { id: "editing", label: "Editing", icon: Film, hint: "Cut together in your editor." },
  { id: "upload", label: "Upload", icon: Upload, hint: "Uploaded and set up on YouTube." },
  { id: "published", label: "Published", icon: Rocket, hint: "It's live! 🎉" },
];

export const STAGE_COUNT = PRODUCTION_STAGES.length;

/** Whole-number completion percentage from a count of finished stages. */
export function completionPct(doneCount: number): number {
  return Math.round((doneCount / STAGE_COUNT) * 100);
}
