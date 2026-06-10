"use client";

import { Check, Lock, PartyPopper } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { usePath } from "@/lib/path/usePath";
import { SEASON2_PREVIEW } from "@/lib/path/curriculum";

export default function PathPage() {
  const path = usePath();
  const pct = path.total ? Math.round((path.doneCount / path.total) * 100) : 0;

  return (
    <div className="space-y-5 py-2">
      <header className="space-y-3">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            The Path
          </h1>
          <p className="text-sm text-muted">Season 1 · The on-ramp</p>
        </div>
        {path.loaded && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted">
              <span>Your progress</span>
              <span>
                {path.doneCount}/{path.total} done
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-hairline">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {!path.loaded ? (
        <Card className="h-64 animate-pulse" />
      ) : (
        <>
          <ol className="space-y-3">
            {path.levels.map((lvl, i) => {
              const completed = path.isCompleted(lvl.id);
              const current = path.isCurrent(lvl.id);

              if (current) {
                return (
                  <li key={lvl.id}>
                    <Card className="space-y-3 border-brand-300 bg-brand-50/40">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-brand-600 font-display font-bold text-white">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
                            Your next step
                          </p>
                          <h2 className="font-display text-lg font-bold leading-tight">
                            {lvl.title}
                          </h2>
                        </div>
                      </div>
                      <p className="text-sm text-ink">{lvl.lesson}</p>
                      <div className="rounded-2xl border border-hairline bg-surface p-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                          Do this · ~{lvl.estMinutes} min
                        </p>
                        <p className="text-sm font-medium">{lvl.action}</p>
                      </div>
                      <Button onClick={() => path.complete(lvl.id)} className="w-full">
                        <Check className="h-4 w-4" /> Mark complete
                      </Button>
                    </Card>
                  </li>
                );
              }

              return (
                <li key={lvl.id}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3",
                      completed
                        ? "border-hairline bg-surface"
                        : "border-transparent",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-sm font-bold",
                        completed
                          ? "bg-success/10 text-success"
                          : "bg-paper text-muted",
                      )}
                    >
                      {completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "truncate text-sm font-semibold",
                          completed ? "text-ink" : "text-muted",
                        )}
                      >
                        {lvl.title}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {completed ? "Completed" : `Locked · ~${lvl.estMinutes} min`}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {path.currentIndex < 0 && (
            <Card className="space-y-2 border-success/30 bg-success/5 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-success/10 text-success">
                <PartyPopper className="h-6 w-6" />
              </span>
              <h2 className="font-display text-lg font-bold">
                Season 1 complete! 🎉
              </h2>
              <p className="text-sm text-muted">
                You went from zero to published — that&apos;s the hard part, and
                most people never do it.
              </p>
            </Card>
          )}

          {/* Season 2 — locked preview */}
          <Card className="flex items-center gap-3 border-dashed">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-paper text-muted">
              <Lock className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{SEASON2_PREVIEW.title}</p>
              <p className="text-xs text-muted">{SEASON2_PREVIEW.blurb}</p>
            </div>
            <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-muted">
              Soon
            </span>
          </Card>
        </>
      )}
    </div>
  );
}
