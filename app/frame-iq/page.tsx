"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Lightbulb,
  Clapperboard,
  Layers,
  CalendarDays,
  BarChart3,
  Eye,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useFrameIQ } from "@/lib/frame-iq/useFrameIQ";

export default function FrameIQPage() {
  const { loaded, iq } = useFrameIQ();

  return (
    <div className="space-y-5 py-2">
      <header className="animate-fade-up space-y-1">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <Sparkles className="h-4 w-4" />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight">Frame IQ</h1>
        </div>
        <p className="text-sm text-muted">
          What Frame knows about you so far — and the smartest next moves.
        </p>
      </header>

      {!loaded || !iq ? (
        <>
          <Card className="h-40 animate-pulse" />
          <Card className="h-28 animate-pulse" />
        </>
      ) : !iq.onboarded ? (
        <EmptyState />
      ) : (
        <Profile iq={iq} />
      )}
    </div>
  );
}

function Profile({ iq }: { iq: NonNullable<ReturnType<typeof useFrameIQ>["iq"]> }) {
  // Build the scannable signal tiles, hiding ones that aren't meaningful yet.
  const stats: { icon: LucideIcon; value: string; label: string; tint: Tint }[] = [
    { icon: Clapperboard, value: String(iq.publishedCount), label: "Videos shipped", tint: "brand" },
    { icon: Flame, value: String(iq.streak), label: "Day streak", tint: "amber" },
    { icon: Lightbulb, value: String(iq.ideaCount), label: "Ideas saved", tint: "brand" },
    { icon: Layers, value: String(iq.projectCount), label: "Projects", tint: "brand" },
  ];
  if (iq.videoCount > 0) {
    stats.push(
      { icon: Eye, value: compact(iq.avgViews), label: "Avg views", tint: "success" },
      { icon: BarChart3, value: `${iq.avgRetentionPct}%`, label: "Avg retention", tint: "success" },
    );
  }
  if (iq.upcomingUploads > 0) {
    stats.push({
      icon: CalendarDays,
      value: String(iq.upcomingUploads),
      label: "Upcoming uploads",
      tint: "brand",
    });
  }

  return (
    <div className="space-y-5">
      {/* Summary hero — the compact, plain-language creator profile */}
      <section
        className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-soft"
        style={{ animationDelay: "60ms" }}
      >
        <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <span className="pointer-events-none absolute right-5 top-5 h-9 w-9 rounded-tr-xl border-r-2 border-t-2 border-white/25" />

        <div className="relative space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {iq.stage}
          </span>
          <p className="font-display text-xl font-bold leading-snug tracking-tight sm:text-2xl">
            {iq.summary}
          </p>
        </div>
      </section>

      {/* The facts behind it */}
      <Card className="animate-fade-up space-y-3" style={{ animationDelay: "120ms" }}>
        <Fact label="Niche" value={cap(iq.niche) || "Not set"} />
        <Fact label="Editing setup" value={`${iq.editingApp} · ${iq.deviceLabel}`} />
        <Fact label="Goal" value={iq.goalLabel || "Not set"} />
        <Fact
          label="Time each week"
          value={iq.weeklyHours ? `~${iq.weeklyHours} hours` : "Not set"}
        />
        <Fact label="Posting cadence" value={cap(iq.cadenceLabel)} />
        {iq.bestVideo && <Fact label="Top video" value={iq.bestVideo} />}
      </Card>

      {/* Signals */}
      <section
        className="animate-fade-up grid grid-cols-3 gap-3"
        style={{ animationDelay: "180ms" }}
      >
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </section>

      {/* Gentle, rule-based tips */}
      <section className="animate-fade-up space-y-3" style={{ animationDelay: "240ms" }}>
        <h2 className="font-display text-lg font-bold">Your next moves</h2>
        {iq.tips.map((t) => (
          <Card key={t.id} className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="min-w-0 flex-1 text-sm text-ink">{t.text}</p>
            <Button href={t.href} variant="secondary" className="shrink-0 px-3.5 py-2 text-xs">
              {t.cta}
            </Button>
          </Card>
        ))}
      </section>

      <p className="px-1 text-center text-xs text-muted">
        Frame IQ updates itself from everything you do here — no setup needed.
      </p>
    </div>
  );
}

type Tint = "brand" | "amber" | "success";

function Stat({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  tint: Tint;
}) {
  const tints: Record<Tint, string> = {
    amber: "bg-amber/10 text-amber",
    success: "bg-success/10 text-success",
    brand: "bg-brand-50 text-brand-600",
  };
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-3.5 shadow-card">
      <span className={cn("mb-2 grid h-8 w-8 place-items-center rounded-xl", tints[tint])}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="font-display text-xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-[11px] font-medium text-muted">{label}</div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="min-w-0 truncate text-right text-sm font-semibold text-ink">
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="space-y-3 py-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
        ✨
      </span>
      <div>
        <h2 className="font-display text-lg font-bold">Frame IQ needs a few basics</h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          Finish the quick onboarding and Frame will build your creator profile —
          your niche, setup, and progress, all in one place.
        </p>
      </div>
      <Button href="/onboarding">
        Get set up <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  );
}

/** "tech reviews" -> "Tech reviews" (just the first letter). */
function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** 12 800 -> "12.8k" for compact stat tiles. */
function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}
