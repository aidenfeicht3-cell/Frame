"use client";

import { cn } from "@/lib/cn";
import { monthGrid, toISODate, WEEKDAY_SHORT } from "@/lib/calendar/dates";
import {
  STATUS_META,
  type Cadence,
  type ScheduledPost,
} from "@/lib/calendar/types";

/** The month grid itself: weekday headers + 6 weeks of tappable day cells. */
export function MonthGrid({
  year,
  month,
  todayIso,
  posts,
  cadence,
  onSelectDay,
}: {
  year: number;
  month: number;
  todayIso: string;
  posts: ScheduledPost[];
  cadence: Cadence;
  onSelectDay: (iso: string) => void;
}) {
  const days = monthGrid(year, month);

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAY_SHORT.map((d, i) => (
          <div
            key={i}
            className="py-1 text-center text-[11px] font-semibold text-muted"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const iso = toISODate(d);
          const inMonth = d.getMonth() === month;
          const isToday = iso === todayIso;
          const dayPosts = posts.filter((p) => p.date === iso);
          const isCadenceDay =
            cadence.enabled && inMonth && d.getDay() === cadence.weekday;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDay(iso)}
              aria-label={iso}
              className={cn(
                "flex aspect-square flex-col items-center gap-1 rounded-xl border p-1 transition-colors",
                inMonth
                  ? "border-hairline bg-surface hover:bg-paper"
                  : "border-transparent bg-transparent hover:bg-paper/60",
                isCadenceDay &&
                  dayPosts.length === 0 &&
                  "border-brand-200 bg-brand-50/50",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full text-xs font-semibold",
                  isToday
                    ? "bg-brand-600 text-white"
                    : inMonth
                      ? "text-ink"
                      : "text-muted/40",
                )}
              >
                {d.getDate()}
              </span>
              {dayPosts.length > 0 && (
                <span className="flex items-center gap-0.5">
                  {dayPosts.slice(0, 3).map((p) => (
                    <span
                      key={p.id}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        STATUS_META[p.status].dot,
                      )}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
