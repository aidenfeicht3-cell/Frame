"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  ArrowLeft,
  Check,
  Lock,
  Trash2,
  Clapperboard,
  PartyPopper,
  Scissors,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NewVideoSheet } from "@/components/builder/NewVideoSheet";
import { useBuilder } from "@/lib/builder/useBuilder";
import { useProfile } from "@/lib/profile/useProfile";
import { markActiveToday } from "@/lib/streak";
import { BUILDER_STEPS, type EditingSetup, type VideoProject } from "@/lib/builder/types";
import { cn } from "@/lib/cn";

export default function BuilderPage() {
  const builder = useBuilder();
  const { profile } = useProfile();
  const niche = profile?.niche ?? "";

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [live, setLive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/ai-status")
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d.live)))
      .catch(() => setLive(false));
  }, []);

  const selected = builder.projects.find((p) => p.id === selectedId) ?? null;

  const handleGenerate = async (idea: string, setup: EditingSetup) => {
    setGenerating(true);
    try {
      const plan = await fetch("/api/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idea, niche, setup }),
      }).then((r) => r.json());
      const id = builder.createProject(idea, setup, plan);
      setSheetOpen(false);
      setSelectedId(id);
    } finally {
      setGenerating(false);
    }
  };

  if (!builder.loaded) {
    return <div className="py-2"><Card className="h-64 animate-pulse" /></div>;
  }

  if (selected) {
    return (
      <ProjectView
        project={selected}
        onBack={() => setSelectedId(null)}
        onComplete={(stepId) => {
          builder.completeStep(selected.id, stepId);
          if (stepId === "publish") markActiveToday(); // publishing = an active day
        }}
        onDelete={() => {
          builder.removeProject(selected.id);
          setSelectedId(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-5 py-2">
      <header className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Video Builder
          </h1>
          <p className="text-sm text-muted">
            Plan a video step-by-step. Never face a blank page.
          </p>
        </div>
        {builder.projects.length > 0 && (
          <Button onClick={() => setSheetOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4" /> New
          </Button>
        )}
      </header>

      {builder.projects.length === 0 ? (
        <Card className="flex flex-col items-center py-10 text-center">
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Clapperboard className="h-6 w-6" />
          </span>
          <p className="mx-auto max-w-xs text-sm text-muted">
            Pick an idea and we&apos;ll build your whole production plan —
            revealed one calm step at a time.
          </p>
          <Button onClick={() => setSheetOpen(true)} className="mt-4">
            <Plus className="h-4 w-4" /> Plan a video
          </Button>
        </Card>
      ) : (
        <ul className="space-y-3">
          {builder.projects.map((p) => {
            const done = p.completedSteps.length;
            const total = BUILDER_STEPS.length;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className="w-full text-left"
                >
                  <Card interactive className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-display text-base font-bold">
                        {p.idea}
                      </p>
                      <span className="shrink-0 text-xs font-semibold text-muted">
                        {done === total ? "Done 🎉" : `${done}/${total}`}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-hairline">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${(done / total) * 100}%` }}
                      />
                    </div>
                  </Card>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <NewVideoSheet
        open={sheetOpen}
        niche={niche}
        setup={builder.editingSetup}
        loading={generating}
        onClose={() => !generating && setSheetOpen(false)}
        onGenerate={handleGenerate}
      />

      {live === false && builder.projects.length > 0 && (
        <p className="text-center text-xs text-muted">
          Plans use sample AI — add a key in Settings for AI-written ones.
        </p>
      )}
    </div>
  );
}

/* ----------------------------- project view ---------------------------- */

function ProjectView({
  project,
  onBack,
  onComplete,
  onDelete,
}: {
  project: VideoProject;
  onBack: () => void;
  onComplete: (stepId: string) => void;
  onDelete: () => void;
}) {
  const done = project.completedSteps.length;
  const total = BUILDER_STEPS.length;
  const currentIndex = BUILDER_STEPS.findIndex(
    (s) => !project.completedSteps.includes(s.id),
  );

  return (
    <div className="space-y-5 py-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 flex-1 truncate font-display text-xl font-bold tracking-tight">
          {project.idea}
        </h1>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete project"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-coral"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium text-muted">
          <span>Production plan</span>
          <span>
            {done}/{total} steps
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-hairline">
          <div
            className="h-full rounded-full bg-brand-500 transition-all"
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
      </div>

      <ol className="space-y-3">
        {BUILDER_STEPS.map((step, i) => {
          const completed = project.completedSteps.includes(step.id);
          const current = i === currentIndex;
          const items = project.plan[step.key] ?? [];

          if (!completed && !current) {
            return (
              <li key={step.id}>
                <div className="flex items-center gap-3 rounded-2xl p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-paper text-muted">
                    <Lock className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-muted">
                      {step.label}
                    </p>
                    <p className="truncate text-xs text-muted">{step.hint}</p>
                  </div>
                </div>
              </li>
            );
          }

          return (
            <li key={step.id}>
              <Card
                className={cn(
                  "space-y-3",
                  current && "border-brand-300 bg-brand-50/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-2xl font-display font-bold",
                      completed
                        ? "bg-success/10 text-success"
                        : "bg-brand-600 text-white",
                    )}
                  >
                    {completed ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold leading-tight">
                      {step.label}
                    </h2>
                    <p className="text-xs text-muted">{step.hint}</p>
                  </div>
                </div>

                {step.id === "edit" && (
                  <p className="flex items-center gap-1.5 rounded-xl bg-surface px-3 py-2 text-xs font-medium text-brand-700">
                    <Scissors className="h-3.5 w-3.5" />
                    Tailored for {project.setup.software} on{" "}
                    {project.setup.device === "mobile" ? "your phone" : "a computer"}
                  </p>
                )}

                <ul className="space-y-1.5">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {current && (
                  <Button onClick={() => onComplete(step.id)} className="w-full">
                    <Check className="h-4 w-4" />{" "}
                    {step.id === "publish" ? "Mark published 🎉" : "Done — next step"}
                  </Button>
                )}
              </Card>
            </li>
          );
        })}
      </ol>

      {currentIndex < 0 && (
        <Card className="space-y-2 border-success/30 bg-success/5 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-success/10 text-success">
            <PartyPopper className="h-6 w-6" />
          </span>
          <h2 className="font-display text-lg font-bold">Plan complete! 🎉</h2>
          <p className="text-sm text-muted">
            You planned a whole video, start to finish. Now go make it.
          </p>
        </Card>
      )}
    </div>
  );
}
