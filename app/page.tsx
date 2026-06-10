import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Check,
  Lock,
  Lightbulb,
  Image as ImageIcon,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Greeting } from "@/components/Greeting";
import { cn } from "@/lib/cn";

/**
 * The "Today" home screen.
 * For now it shows sample data so you can see the design immediately.
 * Real progress, streaks, and your next step get wired up in later steps.
 */
export default function TodayPage() {
  return (
    <div className="space-y-6 py-2">
      {/* Greeting */}
      <header className="animate-fade-up space-y-1">
        <Greeting />
        <h1 className="font-display text-[28px] font-bold leading-[1.12] tracking-tight sm:text-3xl">
          Let&apos;s make your first video, together.
        </h1>
      </header>

      {/* Hero — one clear next action */}
      <section
        className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-soft"
        style={{ animationDelay: "60ms" }}
      >
        {/* decorative glow + framing brackets that echo the logo */}
        <span className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <span className="pointer-events-none absolute right-5 top-5 h-9 w-9 rounded-tr-xl border-r-2 border-t-2 border-white/25" />
        <span className="pointer-events-none absolute bottom-5 left-5 h-9 w-9 rounded-bl-xl border-b-2 border-l-2 border-white/15" />

        <div className="relative space-y-4">
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
              starter brand kit — name ideas, a bio, and a look. No experience
              needed.
            </p>
          </div>
          <Button href="/onboarding" variant="light" className="w-full sm:w-auto">
            Begin <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Sample stats */}
      <section
        className="animate-fade-up grid grid-cols-3 gap-3"
        style={{ animationDelay: "120ms" }}
      >
        <Stat icon={Flame} value="0" label="Day streak" tint="amber" />
        <Stat icon={Check} value="0/5" label="This week" tint="success" />
        <Stat icon={Sparkles} value="S1" label="Season" tint="indigo" />
      </section>

      {/* Your Path preview */}
      <section className="animate-fade-up" style={{ animationDelay: "180ms" }}>
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Your Path</h2>
              <p className="text-xs text-muted">Season 1 · The on-ramp</p>
            </div>
            <Link
              href="/path"
              className="text-xs font-semibold text-indigo hover:underline"
            >
              See all
            </Link>
          </div>
          <ol className="space-y-2.5">
            {pathPreview.map((lvl, i) => (
              <PathRow key={lvl.title} index={i + 1} {...lvl} />
            ))}
          </ol>
        </Card>
      </section>

      {/* What Frame does */}
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

      <p className="text-center text-xs text-muted">
        Showing sample data — your real progress starts after onboarding.
      </p>
    </div>
  );
}

/* ----------------------------- sample data ----------------------------- */

const pathPreview = [
  {
    title: "Find your first idea",
    sub: "Lesson + action · ~5 min",
    locked: false,
  },
  { title: "Plan your video", sub: "Hook, title, and outline", locked: true },
  { title: "Film with confidence", sub: "Simple setup, any camera", locked: true },
];

const features: { icon: LucideIcon; tint: string; title: string; desc: string }[] =
  [
    {
      icon: Lightbulb,
      tint: "bg-indigo/10 text-indigo",
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

/* ----------------------------- small pieces ---------------------------- */

function Stat({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  tint: "amber" | "success" | "indigo" | "coral";
}) {
  const tints: Record<string, string> = {
    amber: "bg-amber/10 text-amber",
    success: "bg-success/10 text-success",
    indigo: "bg-indigo/10 text-indigo",
    coral: "bg-coral/10 text-coral",
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

function PathRow({
  index,
  title,
  sub,
  locked,
}: {
  index: number;
  title: string;
  sub: string;
  locked: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold",
          locked ? "bg-paper text-muted" : "bg-indigo/10 text-indigo",
        )}
      >
        {locked ? <Lock className="h-4 w-4" /> : index}
      </span>
      <div className="min-w-0 flex-1 leading-tight">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            locked ? "text-muted" : "text-ink",
          )}
        >
          {title}
        </p>
        <p className="truncate text-xs text-muted">{sub}</p>
      </div>
      {!locked && (
        <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-600">
          Start
        </span>
      )}
    </li>
  );
}
