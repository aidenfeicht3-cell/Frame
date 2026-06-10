"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Clock,
  CalendarRange,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { DayEditor } from "@/components/calendar/DayEditor";
import { CadenceCard } from "@/components/calendar/CadenceCard";
import { useCalendar } from "@/lib/calendar/useCalendar";
import {
  MONTH_LABELS,
  formatShort,
  formatTime,
  monthGrid,
  toISODate,
} from "@/lib/calendar/dates";
import { STATUS_META, STATUS_ORDER } from "@/lib/calendar/types";
import { cn } from "@/lib/cn";

export default function CalendarPage() {
  const cal = useCalendar();
  const now = new Date();
  const todayIso = toISODate(now);

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const goPrev = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };
  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  // Upcoming videos that aren't published yet, soonest first (by date, then time).
  // TODO: real push/email reminders need the backend + notifications.
  const upcoming = cal.posts
    .filter((p) => p.status !== "published" && p.date >= todayIso)
    .sort((a, b) =>
      a.date === b.date
        ? (a.time ?? "").localeCompare(b.time ?? "")
        : a.date.localeCompare(b.date),
    );
  const nextUp = upcoming[0];

  const ymPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthCount = cal.posts.filter((p) => p.date.startsWith(ymPrefix)).length;

  const applyCadence = () => {
    const existing = new Set(cal.posts.map((p) => p.date));
    monthGrid(year, month)
      .filter((d) => d.getMonth() === month && d.getDay() === cal.cadence.weekday)
      .forEach((d) => {
        const iso = toISODate(d);
        if (!existing.has(iso)) {
          cal.addPost({ date: iso, title: "Untitled video", status: "planned" });
          existing.add(iso);
        }
      });
  };

  return (
    <div className="space-y-5 py-2">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted">
          Plan what goes out, and when. Tap any day to add a video.
        </p>
      </header>

      {!cal.loaded ? (
        <Card className="h-72 animate-pulse" />
      ) : (
        <>
          {/* Next upload reminder */}
          {nextUp ? (
            <Card className="flex items-center gap-3 border-brand-200 bg-brand-50/60">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
                <Bell className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  Next upload
                </p>
                <p className="truncate text-sm font-semibold text-ink">
                  {nextUp.title}
                </p>
              </div>
              <span className="shrink-0 text-right text-xs font-semibold text-brand-700">
                {formatShort(nextUp.date)}
              </span>
            </Card>
          ) : (
            <Card className="flex items-center gap-3 text-sm text-muted">
              <CalendarRange className="h-5 w-5 shrink-0 text-brand-500" />
              Nothing scheduled yet — tap a day to plan your first upload.
            </Card>
          )}

          {/* Month grid */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">
                  {MONTH_LABELS[month]} {year}
                </h2>
                <p className="text-xs text-muted">
                  {monthCount === 0
                    ? "No videos this month yet"
                    : `${monthCount} video${monthCount > 1 ? "s" : ""} this month`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={goToday}
                  className="mr-1 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-hairline"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous month"
                  className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next month"
                  className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <MonthGrid
              year={year}
              month={month}
              todayIso={todayIso}
              posts={cal.posts}
              cadence={cal.cadence}
              onSelectDay={setSelected}
            />

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-hairline pt-3">
              {STATUS_ORDER.map((s) => (
                <span key={s} className="flex items-center gap-1.5 text-xs text-muted">
                  <span className={cn("h-2 w-2 rounded-full", STATUS_META[s].dot)} />
                  {STATUS_META[s].label}
                </span>
              ))}
            </div>
          </Card>

          {/* Upcoming list */}
          {upcoming.length > 0 && (
            <Card className="space-y-3">
              <h2 className="font-display text-base font-bold">Upcoming</h2>
              <ul className="space-y-2">
                {upcoming.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(p.date)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-hairline bg-paper/40 p-3 text-left transition-colors hover:bg-paper"
                    >
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          STATUS_META[p.status].dot,
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.title}</p>
                        <p className="text-xs text-muted">
                          {formatShort(p.date)}
                          {p.time ? ` · ${formatTime(p.time)}` : ""}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          STATUS_META[p.status].chip,
                        )}
                      >
                        {STATUS_META[p.status].label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Cadence */}
          <CadenceCard
            cadence={cal.cadence}
            onChange={cal.setCadence}
            onApply={applyCadence}
          />

          {/* Best time to post — static guidance for v1 */}
          <Card className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-500" />
              <h2 className="font-display text-base font-bold">Best time to post</h2>
            </div>
            <ul className="space-y-2 text-sm text-ink">
              {bestTimeTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  {tip}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted">
              General guidance for now — personalized timing arrives once your
              channel is connected.
            </p>
          </Card>

          <DayEditor
            dateIso={selected}
            posts={cal.posts}
            onClose={() => setSelected(null)}
            onAdd={cal.addPost}
            onUpdate={cal.updatePost}
            onRemove={cal.removePost}
          />
        </>
      )}
    </div>
  );
}

const bestTimeTips = [
  "Evenings (6–9pm) and weekends tend to catch more first views.",
  "Consistency beats timing — pick one day you can keep every week.",
  "Upload a few hours before your audience is usually online, not after.",
];
