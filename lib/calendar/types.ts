export type PostStatus = "planned" | "in_progress" | "published";

export type ScheduledPost = {
  id: string;
  date: string; // ISO date "yyyy-mm-dd" (local day, no time)
  title: string;
  status: PostStatus;
  note?: string;
};

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

export type Cadence = {
  enabled: boolean;
  weekday: Weekday;
};

/**
 * Visual config for each status — kept strictly on-theme:
 * blue (planned) / amber (in progress) / green (published).
 */
export const STATUS_META: Record<
  PostStatus,
  { label: string; dot: string; chip: string }
> = {
  planned: {
    label: "Planned",
    dot: "bg-brand-500",
    chip: "bg-brand-50 text-brand-700",
  },
  in_progress: {
    label: "In progress",
    dot: "bg-amber",
    chip: "bg-amber/10 text-amber",
  },
  published: {
    label: "Published",
    dot: "bg-success",
    chip: "bg-success/10 text-success",
  },
};

export const STATUS_ORDER: PostStatus[] = ["planned", "in_progress", "published"];
