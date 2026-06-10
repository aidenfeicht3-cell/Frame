import { readJSON, writeJSON, STORAGE_KEYS } from "./storage";
import { toISODate } from "./calendar/dates";

/**
 * The streak engine. "Active days" are days the user completed an action
 * (e.g. finishing a Path step). The streak is the run of consecutive active
 * days ending today (or yesterday, so a day isn't lost the moment midnight hits).
 */

export function getActiveDates(): string[] {
  return readJSON<string[]>(STORAGE_KEYS.activeDates, []);
}

/** Records today as active (idempotent) and notifies any live streak widgets. */
export function markActiveToday(): void {
  const today = toISODate(new Date());
  const dates = getActiveDates();
  if (!dates.includes(today)) {
    writeJSON(STORAGE_KEYS.activeDates, [...dates, today]);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("frame:streak"));
  }
}

export function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  const d = new Date();
  // If today isn't active yet, start counting from yesterday.
  if (!set.has(toISODate(d))) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (set.has(toISODate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/** How many of the last 7 days were active (for the weekly goal). */
export function weekActiveCount(dates: string[]): number {
  const set = new Set(dates);
  const d = new Date();
  let count = 0;
  for (let i = 0; i < 7; i++) {
    if (set.has(toISODate(d))) count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}
