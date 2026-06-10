export type Device = "mobile" | "desktop";

export type EditingSetup = {
  software: string;
  device: Device;
};

export type ProductionPlan = {
  hooks: string[];
  titles: string[];
  scriptOutline: string[];
  shotList: string[];
  bRoll: string[];
  sound: string[];
  editChecklist: string[]; // tailored to editing software + device
  publishChecklist: string[];
};

export type VideoProject = {
  id: string;
  idea: string;
  createdAt: string;
  setup: EditingSetup;
  plan: ProductionPlan;
  completedSteps: string[]; // step ids done
};

export type BuilderStep = {
  id: string;
  label: string;
  key: keyof ProductionPlan;
  hint: string;
};

export const BUILDER_STEPS: BuilderStep[] = [
  { id: "hook", label: "Hook", key: "hooks", hint: "Pick the opener that grabs attention." },
  { id: "title", label: "Title", key: "titles", hint: "Pick the title you'd click on." },
  { id: "script", label: "Script outline", key: "scriptOutline", hint: "Your talking points, in order." },
  { id: "shots", label: "Shot list", key: "shotList", hint: "What you'll actually film." },
  { id: "broll", label: "B-roll & visuals", key: "bRoll", hint: "Extra footage to cut to." },
  { id: "sound", label: "Sound & music", key: "sound", hint: "Set the mood." },
  { id: "edit", label: "Edit checklist", key: "editChecklist", hint: "Tailored to your editor." },
  { id: "publish", label: "Publish", key: "publishChecklist", hint: "Final checks before upload." },
];

export const EDITING_SOFTWARE = [
  "CapCut",
  "iMovie",
  "Premiere Pro",
  "DaVinci Resolve",
  "Final Cut Pro",
  "Filmora",
  "Other / not sure",
];
