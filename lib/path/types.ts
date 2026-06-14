export type Level = {
  id: string;
  title: string;
  lesson: string; // a short teaching note
  tip?: string; // one concrete, copyable tip shown with the lesson
  action: string; // the one thing to do
  estMinutes: number;
};
