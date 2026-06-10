export type VideoStat = {
  id: string;
  title: string;
  date: string; // ISO "yyyy-mm-dd" published date
  views: number;
  likes: number;
  comments: number;
  retentionPct: number; // average view duration, 0–100
};
