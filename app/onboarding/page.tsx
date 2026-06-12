"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Clapperboard,
  ArrowRight,
  ArrowLeft,
  Check,
  ExternalLink,
  Rocket,
  Repeat,
  TrendingUp,
  Loader2,
  Pencil,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useProfile } from "@/lib/profile/useProfile";
import { GOAL_LABELS, type Goal } from "@/lib/profile/types";
import type { BrandKit, ChannelToStudy } from "@/lib/ai-types";

const TOTAL_STEPS = 5;
const NICHE_SUGGESTIONS = [
  "Gaming",
  "Cooking",
  "Fitness",
  "Tech reviews",
  "Art",
  "Daily vlogs",
  "Personal finance",
  "Music",
];
const HOURS = [
  { label: "1–2 hrs", value: 2 },
  { label: "3–5 hrs", value: 4 },
  { label: "6+ hrs", value: 6 },
];
const GOALS: { id: Goal; icon: LucideIcon; blurb: string }[] = [
  { id: "first_video", icon: Rocket, blurb: "Get your very first video published." },
  { id: "post_weekly", icon: Repeat, blurb: "Build a steady weekly posting habit." },
  { id: "1k_subs", icon: TrendingUp, blurb: "Grow toward your first 1,000 subscribers." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { loaded, profile, save, reset } = useProfile();

  const [step, setStep] = useState(0);
  const [hasChannel, setHasChannel] = useState<boolean | null>(null);
  const [niche, setNiche] = useState("");
  const [channels, setChannels] = useState<ChannelToStudy[] | null>(null);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [loadingGen, setLoadingGen] = useState(false);
  const [chosenName, setChosenName] = useState("");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [weeklyHours, setWeeklyHours] = useState<number | null>(null);
  const [live, setLive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/ai-status")
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d.live)))
      .catch(() => setLive(false));
  }, []);

  const generate = async () => {
    setStep(2);
    setLoadingGen(true);
    setChannels(null);
    setBrandKit(null);
    const opts = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ niche }),
    };
    try {
      const [ch, kit] = await Promise.all([
        fetch("/api/channels", opts).then((r) => r.json()),
        fetch("/api/brand-kit", opts).then((r) => r.json()),
      ]);
      setChannels(ch as ChannelToStudy[]);
      setBrandKit(kit as BrandKit);
      setChosenName((kit as BrandKit)?.names?.[0] ?? "");
    } finally {
      setLoadingGen(false);
    }
  };

  const finish = () => {
    if (!goal || weeklyHours == null) return;
    save({
      hasChannel: Boolean(hasChannel),
      niche: niche.trim(),
      channelName: chosenName.trim() || brandKit?.names?.[0] || "My Channel",
      bio: brandKit?.bio ?? "",
      goal,
      weeklyHours,
      brandKit: brandKit ?? undefined,
      onboardedAt: new Date().toISOString(),
    });
  };

  const startOver = () => {
    reset();
    setStep(0);
    setHasChannel(null);
    setNiche("");
    setChannels(null);
    setBrandKit(null);
    setChosenName("");
    setGoal(null);
    setWeeklyHours(null);
  };

  if (!loaded) {
    return <div className="py-2"><Card className="h-64 animate-pulse" /></div>;
  }

  // Already finished — show a summary instead of forcing a redo.
  if (profile) {
    return (
      <CompletedView
        name={profile.channelName}
        niche={profile.niche}
        goalLabel={profile.goal ? GOAL_LABELS[profile.goal] : "—"}
        weeklyHours={profile.weeklyHours}
        bio={profile.bio}
        onGo={() => router.push("/today")}
        onStartOver={startOver}
      />
    );
  }

  return (
    <div className="space-y-5 py-2">
      <StepHeader
        step={step}
        canGoBack={step > 0}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
      />

      {step === 0 && (
        <section className="animate-fade-up space-y-4">
          <Heading
            title="Welcome to Frame 👋"
            subtitle="First, where are you starting from? There's no wrong answer."
          />
          <ChoiceCard
            icon={Sparkles}
            title="I'm starting fresh"
            desc="No channel yet — we'll help you create one."
            onClick={() => {
              setHasChannel(false);
              setStep(1);
            }}
          />
          <ChoiceCard
            icon={Clapperboard}
            title="I already have a channel"
            desc="We'll build on what you've got."
            onClick={() => {
              setHasChannel(true);
              setStep(1);
            }}
          />
        </section>
      )}

      {step === 1 && (
        <section className="animate-fade-up space-y-4">
          <Heading
            title="What's your channel about?"
            subtitle="A word or two is plenty — you can change this later."
          />
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && niche.trim()) generate();
            }}
            placeholder="e.g. retro gaming, easy recipes, home workouts…"
            className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <div className="flex flex-wrap gap-2">
            {NICHE_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setNiche(s)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  niche === s
                    ? "bg-brand-600 text-white"
                    : "bg-surface text-muted hover:text-ink",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <Button
            onClick={generate}
            disabled={!niche.trim()}
            className="w-full sm:w-auto"
          >
            Generate my starter kit <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      )}

      {step === 2 && (
        <section className="animate-fade-up space-y-4">
          <Heading
            title="Creators to learn from"
            subtitle={`Channels worth studying in ${niche || "your niche"}.`}
            badge={<AiBadge live={live} />}
          />
          {loadingGen || !channels ? (
            <LoadingCards label="Finding creators to study…" />
          ) : (
            <>
              <div className="space-y-3">
                {channels.map((c) => (
                  <Card key={c.name} className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-base font-bold">{c.name}</h3>
                      <a
                        href={c.searchUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                      >
                        Find them <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-sm text-muted">{c.why}</p>
                    <p className="text-sm">
                      <span className="font-semibold text-brand-700">Borrow this: </span>
                      {c.steal}
                    </p>
                  </Card>
                ))}
              </div>
              <Button onClick={() => setStep(3)} className="w-full sm:w-auto">
                Next: your brand kit <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </section>
      )}

      {step === 3 && (
        <section className="animate-fade-up space-y-4">
          <Heading
            title="Your starter brand kit"
            subtitle="Pick a name you like — everything here is yours to tweak."
            badge={<AiBadge live={live} />}
          />
          {!brandKit ? (
            <LoadingCards label="Crafting your brand kit…" />
          ) : (
            <>
              <Card className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Pick your channel name
                </p>
                <div className="space-y-2">
                  {brandKit.names.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setChosenName(n)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                        chosenName === n
                          ? "border-brand-300 bg-brand-50 text-brand-700"
                          : "border-hairline bg-surface hover:bg-paper",
                      )}
                    >
                      {n}
                      {chosenName === n && <Check className="h-4 w-4 text-brand-600" />}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 rounded-2xl border border-hairline bg-surface px-4 py-2.5">
                  <Pencil className="h-4 w-4 shrink-0 text-muted" />
                  <input
                    value={
                      brandKit.names.includes(chosenName) ? "" : chosenName
                    }
                    onChange={(e) => setChosenName(e.target.value)}
                    placeholder="…or type your own"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </label>
              </Card>

              <InfoCard title="Your 2-sentence bio">{brandKit.bio}</InfoCard>
              <InfoCard title="Banner concept">{brandKit.bannerConcept}</InfoCard>
              <InfoCard title="Profile-pic concept">{brandKit.pfpConcept}</InfoCard>

              <Button
                onClick={() => setStep(4)}
                disabled={!chosenName.trim()}
                className="w-full sm:w-auto"
              >
                Looks good — next <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </section>
      )}

      {step === 4 && (
        <section className="animate-fade-up space-y-5">
          <Heading
            title="What's your goal?"
            subtitle="We'll shape your Path around this. You can change it anytime."
          />
          <div className="space-y-3">
            {GOALS.map((g) => {
              const Icon = g.icon;
              const active = goal === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                    active
                      ? "border-brand-300 bg-brand-50"
                      : "border-hairline bg-surface hover:bg-paper",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-2xl",
                      active ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{GOAL_LABELS[g.id]}</p>
                    <p className="text-xs text-muted">{g.blurb}</p>
                  </div>
                  {active && <Check className="h-5 w-5 shrink-0 text-brand-600" />}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">How much time per week?</p>
            <div className="grid grid-cols-3 gap-2">
              {HOURS.map((h) => (
                <button
                  key={h.value}
                  type="button"
                  onClick={() => setWeeklyHours(h.value)}
                  className={cn(
                    "rounded-2xl border py-3 text-sm font-semibold transition-colors",
                    weeklyHours === h.value
                      ? "border-brand-300 bg-brand-50 text-brand-700"
                      : "border-hairline bg-surface text-muted hover:text-ink",
                  )}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={finish}
            disabled={!goal || weeklyHours == null}
            className="w-full sm:w-auto"
          >
            Finish setup <Check className="h-4 w-4" />
          </Button>
        </section>
      )}
    </div>
  );
}

/* ------------------------------- pieces -------------------------------- */

function StepHeader({
  step,
  canGoBack,
  onBack,
}: {
  step: number;
  canGoBack: boolean;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {canGoBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      ) : (
        <span className="h-9 w-9 shrink-0" />
      )}
      <div className="flex flex-1 items-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-brand-500" : "bg-hairline",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Heading({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {badge}
      <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-muted">{subtitle}</p>
    </div>
  );
}

function ChoiceCard({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <Card interactive className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold">{title}</p>
          <p className="text-sm text-muted">{desc}</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-muted" />
      </Card>
    </button>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </p>
      <p className="text-sm text-ink">{children}</p>
    </Card>
  );
}

function LoadingCards({ label }: { label: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
        {label}
      </div>
      {[0, 1, 2].map((i) => (
        <Card key={i} className="h-24 animate-pulse" />
      ))}
    </div>
  );
}

function AiBadge({ live }: { live: boolean | null }) {
  if (live === null) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        live ? "bg-success/10 text-success" : "bg-amber/10 text-amber",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          live ? "bg-success" : "bg-amber",
        )}
      />
      {live ? "Live AI" : "Sample AI — add a key in Settings"}
    </span>
  );
}

function CompletedView({
  name,
  niche,
  goalLabel,
  weeklyHours,
  bio,
  onGo,
  onStartOver,
}: {
  name: string;
  niche: string;
  goalLabel: string;
  weeklyHours: number;
  bio: string;
  onGo: () => void;
  onStartOver: () => void;
}) {
  return (
    <div className="space-y-5 py-2">
      <div className="space-y-1.5 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success/10 text-success">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          You&apos;re all set!
        </h1>
        <p className="text-sm text-muted">
          Your brand kit is saved. Here&apos;s what we&apos;ve got.
        </p>
      </div>

      <Card className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Channel name
          </p>
          <p className="font-display text-xl font-bold">{name}</p>
        </div>
        {bio && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Bio
            </p>
            <p className="text-sm">{bio}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <Tag>🎯 {niche || "—"}</Tag>
          <Tag>🏁 {goalLabel}</Tag>
          <Tag>⏱️ {weeklyHours} hrs/week</Tag>
        </div>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onGo} className="w-full sm:w-auto">
          Go to Today <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" onClick={onStartOver} className="w-full sm:w-auto">
          Start over
        </Button>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink">
      {children}
    </span>
  );
}
