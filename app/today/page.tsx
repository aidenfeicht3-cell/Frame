"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Check,
  Lock,
  Bell,
  Lightbulb,
  Image as ImageIcon,
  MessageCircle,
  PartyPopper,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Greeting } from "@/components/Greeting";
import { cn } from "@/lib/cn";
import { useProfile } from "@/lib/profile/useProfile";
import { useStreak } from "@/lib/useStreak";
import { usePath } from "@/lib/path/usePath";
import { useCalendar } from "@/lib/calendar/useCalendar";
import { toISODate, formatShort } from "@/lib/calendar/dates";
import { useProjects } from "@/lib/projects/useProjects";

export default function TodayPage() {
  const { loaded: profileLoaded, profile } = useProfile();
  const { streak, weekCount } = useStreak();
  const path = usePath();
  const cal = useCalendar();
  const projects = useProjects();

  const ready = profileLoaded && path.loaded && cal.loaded;
  const onboarded = Boolean(profile);
  const todayIso = toISODate(new Date());

  const nextUp = cal.posts
    .filter((p) => p.status !== "published" && p.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const currentLevel =
    path.currentIndex >= 0 ? path.levels[path.currentIndex] : null;

  // The in-progress video closest to done — nudge the user to finish it.
  const closestVideo = projects.loaded
    ? ([...projects.inProgress].sort((a, b) => b.pct - a.pct)[0] ?? null)
    : null;

  if (!ready) {
    return (
      <div className="space-y-4 py-2">
        <Card className="h-24 animate-pulse" />
        <Card className="h-40 animate-pulse" />
        <Card className="h-24 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {/* Greeting */}
      <header className="animate-fade-up space-y-1">
        <Greeting />
        <h1 className="font-display text-[28px] font-bold leading-[1.12] tracking-tight sm:text-3xl">
          {onboarded
            ? `Welcome back to ${profile!.channelName}.`
            : "Let's make your first video, together."}
        </h1>
      </header>

      {/* Hero — one clear next action */}
      <section
        className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-soft"
        style={{ animationDelay: "60ms" }}
      >
        <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <span className="pointer-events-none absolute right-5 top-5 h-9 w-9 rounded-tr-xl border-r-2 border-t-2 border-white/25" />
        <span className="pointer-events-none absolute bottom-5 left-5 h-9 w-9 rounded-bl-xl border-b-2 border-l-2 border-white/15" />

        <div className="relative space-y-4">
          {!onboarded ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Step 1 · Brand kit
              </span>
              <div className="space-y-1.5">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Start your journey
                </h2>
                <p className="max-w-sm text-sm text-white/85">
                  A few quick questions and we&apos;ll craft your channel&apos;s
                  starter brand kit. No experience needed.
                </p>
              </div>
              <Button href="/onboarding" variant="light" className="w-full sm:w-auto">
                Begin <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : currentLevel ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Phase 1 · Step {path.currentIndex + 1}
              </span>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-white/70">Your next step</p>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {currentLevel.title}
                </h2>
                <p className="max-w-sm text-sm text-white/85">
                  {currentLevel.action}
                </p>
              </div>
              <Button href="/path" variant="light" className="w-full sm:w-auto">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <PartyPopper className="h-3.5 w-3.5" />
                Phase 1 complete
              </span>
              <div className="space-y-1.5">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  You did it! 🎉
                </h2>
                <p className="max-w-sm text-sm text-white/85">
                  You went from zero to published. Keep the rhythm going.
                </p>
              </div>
              <Button href="/path" variant="light" className="w-full sm:w-auto">
                See your Path <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Next upload (when scheduled) */}
      {onboarded && nextUp && (
        <Link href="/calendar" className="block">
          <Card
            interactive
            className="flex items-center gap-3 border-brand-200 bg-brand-50/60"
          >
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
            <span className="shrink-0 text-xs font-semibold text-brand-700">
              {formatShort(nextUp.date)}
            </span>
          </Card>
        </Link>
      )}

      {/* Finish your video — nudge toward the closest-to-done project */}
      {onboarded && closestVideo && (
        <Link href="/projects" className="block">
          <Card
            interactive
            className="animate-fade-up flex items-center gap-3 border-brand-200 bg-brand-50/60"
            style={{ animationDelay: "90ms" }}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white">
              <Clapperboard className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                Finish your video
              </p>
              <p className="truncate text-sm font-semibold text-ink">
                {closestVideo.project.idea}
              </p>
            </div>
            <span className="shrink-0 text-sm font-bold text-brand-700">
              {closestVideo.pct}%
            </span>
          </Card>
        </Link>
      )}

      {/* Real stats */}
      <section
        className="animate-fade-up grid grid-cols-3 gap-3"
        style={{ animationDelay: "120ms" }}
      >
        <Stat icon={Flame} value={String(streak)} label="Day streak" tint="amber" />
        <Stat icon={Check} value={`${weekCount}/5`} label="This week" tint="success" />
        <Stat
          icon={Sparkles}
          value={`${path.doneCount}/${path.total}`}
          label="Path"
          tint="brand"
        />
      </section>

      {/* Your Path preview (real) */}
      <section className="animate-fade-up" style={{ animationDelay: "180ms" }}>
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Your Path</h2>
              <p className="text-xs text-muted">Phase 1 · The on-ramp</p>
            </div>
            <Link
              href="/path"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              See all
            </Link>
          </div>
          <ol className="space-y-2.5">
            {path.levels.slice(0, 3).map((lvl, i) => {
              const completed = path.isCompleted(lvl.id);
              const current = path.isCurrent(lvl.id);
              return (
                <li key={lvl.id} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold",
                      completed
                        ? "bg-success/10 text-success"
                        : current
                          ? "bg-brand-600 text-white"
                          : "bg-paper text-muted",
                    )}
                  >
                    {completed ? (
                      <Check className="h-4 w-4" />
                    ) : current ? (
                      i + 1
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p
                      className={cn(
                        "truncate text-sm font-semibold",
                        completed || current ? "text-ink" : "text-muted",
                      )}
                    >
                      {lvl.title}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {completed
                        ? "Completed"
                        : current
                          ? "Your next step"
                          : `~${lvl.estMinutes} min`}
                    </p>
                  </div>
                  {current && (
                    <Link
                      href="/path"
                      className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-600"
                    >
                      Continue
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </Card>
      </section>

      {/* What Frame does — only before onboarding */}
      {!onboarded && (
        <section className="animate-fade-up" style={{ animationDelay: "240ms" }}>
          <Card>
            <h2 className="mb-4 font-display text-lg font-bold">
              What Frame does for you
            </h2>
            <ul className="space-y-3.5">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                      f.tint,
                    )}
                  >
                    <f.icon className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-muted">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  );
}

const features: { icon: LucideIcon; tint: string; title: string; desc: string }[] =
  [
    {
      icon: Lightbulb,
      tint: "bg-brand-50 text-brand-600",
      title: "Never face a blank page",
      desc: "We plan each video step-by-step.",
    },
    {
      icon: ImageIcon,
      tint: "bg-brand-50 text-brand-600",
      title: "Learn the craft as you go",
      desc: "Thumbnails, scripts, editing — kept simple.",
    },
    {
      icon: Flame,
      tint: "bg-amber/10 text-amber",
      title: "Build a posting habit",
      desc: "Gentle streaks make it stick.",
    },
    {
      icon: MessageCircle,
      tint: "bg-success/10 text-success",
      title: "Friendly coaching",
      desc: "Specific, encouraging feedback.",
    },
  ];

function Stat({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  tint: "amber" | "success" | "brand";
}) {
  const tints: Record<string, string> = {
    amber: "bg-amber/10 text-amber",
    success: "bg-success/10 text-success",
    brand: "bg-brand-50 text-brand-600",
  };
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-3.5 shadow-card">
      <span
        className={cn(
          "mb-2 grid h-8 w-8 place-items-center rounded-xl",
          tints[tint],
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="font-display text-xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-[11px] font-medium text-muted">{label}</div>
    </div>
  );
}
