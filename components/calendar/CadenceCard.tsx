"use client";

import { CalendarClock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";
import { WEEKDAY_LABELS, WEEKDAY_SHORT } from "@/lib/calendar/dates";
import type { Cadence, Weekday } from "@/lib/calendar/types";

/** Lets the user set a weekly rhythm and auto-fill the month with it. */
export function CadenceCard({
  cadence,
  onChange,
  onApply,
}: {
  cadence: Cadence;
  onChange: (cadence: Cadence) => void;
  onApply: () => void;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <CalendarClock className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold">Posting cadence</h2>
            <p className="text-xs text-muted">
              {cadence.enabled
                ? `Aiming to post every ${WEEKDAY_LABELS[cadence.weekday]}.`
                : "Pick a rhythm you can actually keep."}
            </p>
          </div>
        </div>
        <Toggle
          checked={cadence.enabled}
          onChange={(v) => onChange({ ...cadence, enabled: v })}
          label="Enable posting cadence"
        />
      </div>

      {cadence.enabled && (
        <>
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKDAY_SHORT.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange({ ...cadence, weekday: i as Weekday })}
                className={cn(
                  "rounded-xl py-2 text-xs font-semibold transition-colors",
                  cadence.weekday === i
                    ? "bg-brand-600 text-white"
                    : "bg-paper text-muted hover:text-ink",
                )}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onApply}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
          >
            <Sparkles className="h-4 w-4" /> Fill this month with my cadence
          </button>
        </>
      )}
    </Card>
  );
}
