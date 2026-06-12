"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useProjects, type ProjectProgress } from "@/lib/projects/useProjects";
import { PRODUCTION_STAGES, type StageId } from "@/lib/projects/types";

export default function ProjectsPage() {
  const { loaded, progress, inProgress, publishedCount, toggleStage } =
    useProjects();

  // The in-progress video closest to done — the one worth finishing next.
  const closest = [...inProgress].sort((a, b) => b.pct - a.pct)[0];

  return (
    <div className="space-y-5 py-2">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-muted">
            Every video from idea to published — finish what you start.
          </p>
        </div>
        <Button href="/builder" variant="secondary" className="shrink-0">
          <Sparkles className="h-4 w-4" /> New video
        </Button>
      </header>

      {!loaded ? (
        <Card className="h-64 animate-pulse" />
      ) : progress.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat value={progress.length} label="Projects" />
            <Stat value={inProgress.length} label="In progress" tint="amber" />
            <Stat value={publishedCount} label="Published" tint="success" />
          </div>

          {closest && (
            <Card className="flex items-center gap-3 border-brand-200 bg-brand-50/60">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  Closest to done — finish it!
                </p>
                <p className="truncate text-sm font-semibold text-ink">
                  {closest.project.idea}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-brand-700">
                {closest.pct}%
              </span>
            </Card>
          )}

          <div className="space-y-4">
            {progress.map((item) => (
              <ProjectCard
                key={item.project.id}
                item={item}
                onToggle={toggleStage}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------- pieces -------------------------------- */

function ProjectCard({
  item,
  onToggle,
}: {
  item: ProjectProgress;
  onToggle: (projectId: string, stageId: StageId) => void;
}) {
  const { project, doneStages, pct, isPublished } = item;
  const done = new Set(doneStages);
  const status = isPublished
    ? "Published"
    : doneStages.length === 0
      ? "Not started"
      : "In progress";

  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <Ring pct={pct} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-base font-bold">
            {project.idea}
          </h2>
          <p className="truncate text-xs text-muted">
            {project.setup?.software ? `${project.setup.software} · ` : ""}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <span
            className={cn(
              "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
              isPublished
                ? "bg-success/10 text-success"
                : doneStages.length === 0
                  ? "bg-paper text-muted"
                  : "bg-amber/10 text-amber",
            )}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRODUCTION_STAGES.map((stage) => {
          const isDone = done.has(stage.id);
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onToggle(project.id, stage.id)}
              title={stage.hint}
              aria-pressed={isDone}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all active:scale-95",
                isDone
                  ? "border-brand-500 bg-brand-600 text-white shadow-soft"
                  : "border-hairline bg-surface text-muted hover:border-brand-300 hover:text-ink",
              )}
            >
              {isDone ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Icon className="h-3.5 w-3.5" />
              )}
              {stage.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

/** A small circular progress ring with the percentage in the centre. */
function Ring({ pct }: { pct: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return (
    <div className="relative grid h-14 w-14 shrink-0 place-items-center">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          strokeWidth="4"
          className="stroke-hairline"
        />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className={pct >= 100 ? "stroke-success" : "stroke-brand-600"}
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <span className="absolute text-xs font-bold">{pct}%</span>
    </div>
  );
}

function Stat({
  value,
  label,
  tint,
}: {
  value: number;
  label: string;
  tint?: "amber" | "success";
}) {
  return (
    <Card className="px-3 py-4 text-center">
      <p
        className={cn(
          "font-display text-2xl font-bold",
          tint === "amber" && "text-amber",
          tint === "success" && "text-success",
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted">{label}</p>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="space-y-3 py-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
        🎬
      </span>
      <div>
        <h2 className="font-display text-lg font-bold">No projects yet</h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          Plan a video in the Builder and it&apos;ll show up here to track all
          the way to published.
        </p>
      </div>
      <Button href="/builder" className="mx-auto">
        <Sparkles className="h-4 w-4" /> Plan a video <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  );
}
