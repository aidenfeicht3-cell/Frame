"use client";

import Link from "next/link";
import {
  Gauge,
  Sparkles,
  Rocket,
  Flame,
  TrendingUp,
  TrendingDown,
  Clapperboard,
  CalendarDays,
  BarChart3,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useProfile } from "@/lib/profile/useProfile";
import { useCreatorScore } from "@/lib/creator-score/useCreatorScore";
import { weakestPart } from "@/lib/creator-score/store";
import type { CreatorScore, ScorePart } from "@/lib/creator-score/types";

export default function CreatorScorePage() {
  const { loaded: profileLoaded, profile } = useProfile();
  const { loaded: scoreLoaded, cs } = useCreatorScore();

  const ready = profileLoaded && scoreLoaded;
  const onboarded = Boolean(profile);

  return (
    <div className="space-y-5 py-2">
      <header className="animate-fade-up space-y-1">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <Gauge className="h-4 w-4" />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Creator Score
          </h1>
        </div>
        <p className="text-sm text-muted">
          One number for your momentum — built from showing up and shipping.
        </p>
      </header>

      {!ready ? (
        <>
          <Card className="h-64 animate-pulse" />
          <Card className="h-28 animate-pulse" />
        </>
      ) : !onboarded || !cs ? (
        <EmptyState />
      ) : (
        <Score cs={cs} />
      )}
    </div>
  );
}

function Score({ cs }: { cs: CreatorScore }) {
  const weakest = weakestPart(cs.parts);

  return (
    <div className="space-y-5">
      {/* Hero — the score ring + tier + today's movement */}
      <section
        className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-soft"
        style={{ animationDelay: "60ms" }}
      >
        <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <span className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col items-center gap-4 text-center">
          <TierBadge tier={cs.tier} />
          <ScoreRing score={cs.score} />
          <DeltaChip delta={cs.delta} />
        </div>
      </section>

      {/* Coach note — one gentle nudge toward the weakest area */}
      <Card
        className="animate-fade-up flex items-start gap-3"
        style={{ animationDelay: "120ms" }}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 space-y-2.5">
          <p className="text-sm text-ink">{cs.coachNote}</p>
          <Button
            href={weakest.href}
            variant="secondary"
            className="px-3.5 py-2 text-xs"
          >
            Improve {weakest.label.toLowerCase()}{" "}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Breakdown — where the points come from */}
      <section
        className="animate-fade-up space-y-3"
        style={{ animationDelay: "160ms" }}
      >
        <h2 className="font-display text-lg font-bold">
          What makes up your score
        </h2>
        {cs.parts.map((p) => (
          <PartBar key={p.key} part={p} focus={p.key === weakest.key} />
        ))}
      </section>

      <p className="px-1 text-center text-xs text-muted">
        Your score updates itself from everything you do in Frame — no setup
        needed.
      </p>
    </div>
  );
}

/* ------------------------------- pieces -------------------------------- */

const TIER_ICON: Record<string, LucideIcon> = {
  Spark: Sparkles,
  Builder: Rocket,
  Momentum: TrendingUp,
  "On fire": Flame,
};

function TierBadge({ tier }: { tier: string }) {
  const Icon = TIER_ICON[tier] ?? Sparkles;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
      <Icon className="h-3.5 w-3.5" />
      {tier}
    </span>
  );
}

/** White circular gauge on the gradient hero. */
function ScoreRing({ score }: { score: number }) {
  const size = 168;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const offset = c * (1 - pct);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="white"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <div className="font-display text-5xl font-bold">{score}</div>
          <div className="mt-1 text-xs font-medium text-white/70">out of 100</div>
        </div>
      </div>
    </div>
  );
}

/** Today's movement — only shown when there's something to celebrate. */
function DeltaChip({ delta }: { delta: number | null }) {
  if (delta === null || delta === 0) return null;
  const up = delta > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
      <Icon className="h-3.5 w-3.5" />
      {up ? "+" : ""}
      {delta} today
    </span>
  );
}

type Tint = "amber" | "brand" | "success";
const PART_ICON: Record<ScorePart["key"], { icon: LucideIcon; tint: Tint }> = {
  consistency: { icon: Flame, tint: "amber" },
  output: { icon: Clapperboard, tint: "brand" },
  pipeline: { icon: CalendarDays, tint: "brand" },
  insight: { icon: BarChart3, tint: "success" },
};

function PartBar({ part, focus }: { part: ScorePart; focus: boolean }) {
  const { icon: Icon, tint } = PART_ICON[part.key];
  const tints: Record<Tint, string> = {
    amber: "bg-amber/10 text-amber",
    success: "bg-success/10 text-success",
    brand: "bg-brand-50 text-brand-600",
  };
  const pct = Math.round((part.points / part.max) * 100);

  return (
    <Link href={part.href} className="block">
      <Card
        interactive
        className={cn("space-y-2.5", focus && "border-brand-300")}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                tints[tint],
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <p className="truncate text-sm font-semibold text-ink">
              {part.label}
            </p>
            {focus && (
              <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-600">
                Focus
              </span>
            )}
          </div>
          <p className="shrink-0 text-xs font-semibold text-muted">
            <span className="text-ink">{part.points}</span>/{part.max}
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-paper">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-muted">{part.hint}</p>
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <Card className="space-y-3 py-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Gauge className="h-7 w-7" />
      </span>
      <div>
        <h2 className="font-display text-lg font-bold">
          Your score starts after onboarding
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          Finish the quick setup, then your score grows as you build a streak,
          ship videos, and plan ahead.
        </p>
      </div>
      <Button href="/onboarding">
        Get set up <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  );
}
