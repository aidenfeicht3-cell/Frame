"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  Loader2,
  Sparkles,
  Gauge,
  CreditCard,
  ShieldCheck,
  Palette,
  Target,
  Clapperboard,
  CalendarDays,
  SunMoon,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/useTheme";
import { useProfile } from "@/lib/profile/useProfile";
import { GOAL_LABELS, type Goal } from "@/lib/profile/types";
import { useBilling } from "@/lib/billing/useBilling";
import {
  PRO_PRICE,
  TRIAL_DAYS,
  inTrial,
  trialDaysLeft,
} from "@/lib/billing/types";
import { getEditingSetup, saveEditingSetup } from "@/lib/builder/store";
import { EDITING_SOFTWARE, type Device } from "@/lib/builder/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const HOURS = [
  { label: "1–2 hrs", value: 2 },
  { label: "3–5 hrs", value: 4 },
  { label: "6+ hrs", value: 6 },
];
const GOAL_IDS: Goal[] = ["first_video", "post_weekly", "1k_subs"];

export default function SettingsPage() {
  const { profile } = useProfile();

  return (
    <div className="space-y-7 py-2">
      <header className="animate-fade-up space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted">
          {profile?.channelName
            ? `Manage ${profile.channelName} — your plan, channel, and preferences.`
            : "Manage your plan, channel, and preferences."}
        </p>
      </header>

      <Section label="Plan & account" delay={40}>
        <BillingCard />
        <AccountCard />
      </Section>

      <Section label="Your channel" delay={100}>
        <FrameIQLink />
        <CreatorScoreLink />
        <BrandKitCard />
        <GoalCard />
      </Section>

      <Section label="Workflow" delay={160}>
        <EditingCard />
        <CadenceCard />
      </Section>

      <Section label="Preferences" delay={220}>
        <AppearanceCard />
      </Section>
    </div>
  );
}

/* ------------------------------ Billing -------------------------------- */

function BillingCard() {
  const { loaded, billing, startTrial, cancel } = useBilling();
  const isPro = billing.plan === "pro";
  const daysLeft = trialDaysLeft(billing);
  const trialing = inTrial(billing);

  const planLabel = isPro ? "Frame Pro" : "Free";
  const statusText = !isPro
    ? "Your first video, free"
    : trialing
      ? `Free trial — ${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`
      : `${PRO_PRICE}/month · active`;

  return (
    <SettingCard
      icon={CreditCard}
      title="Your plan"
      desc="Your subscription powers live AI on every video — nothing to set up."
      badge={
        loaded ? (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              isPro ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700",
            )}
          >
            {isPro && <Sparkles className="h-3 w-3" />}
            {planLabel}
          </span>
        ) : null
      }
    >
      {!loaded ? (
        <div className="h-10 animate-pulse rounded-2xl bg-paper" />
      ) : (
        <div className="space-y-3">
          {/* Current plan — Pro gets the premium gradient treatment */}
          {isPro ? (
            <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 px-4 py-3.5 text-white shadow-soft">
              <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <p className="flex items-center gap-1.5 text-sm font-bold">
                  <Sparkles className="h-3.5 w-3.5" /> Frame Pro
                </p>
                <p className="text-xs text-white/80">{statusText}</p>
              </div>
              <span className="relative inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                <Check className="h-3.5 w-3.5" /> Active
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-paper px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold">Free</p>
                <p className="text-xs text-muted">{statusText}</p>
              </div>
            </div>
          )}

          {!isPro ? (
            <>
              <Button onClick={startTrial} className="w-full">
                Start {TRIAL_DAYS}-day free trial <Sparkles className="h-4 w-4" />
              </Button>
              <p className="text-xs leading-relaxed text-muted">
                Unlocks unlimited videos, every Path phase, and live AI coaching.
                After the trial it&apos;s {PRO_PRICE}/month. Cancel anytime.
              </p>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={cancel} className="w-full">
                Cancel subscription
              </Button>
              <p className="text-xs leading-relaxed text-muted">
                Manage or cancel anytime — you&apos;ll keep Pro until the end of
                your billing period.
              </p>
            </>
          )}
          <div className="flex items-center gap-1.5 border-t border-hairline pt-3 text-[11px] text-muted">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            Billing is a preview for now — real checkout is coming soon.
          </div>
        </div>
      )}
    </SettingCard>
  );
}

/* ------------------------------ Frame IQ ------------------------------- */

function FrameIQLink() {
  return (
    <Link href="/frame-iq" className="block">
      <Card interactive className="flex items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-ink">Frame IQ</p>
          <p className="text-sm text-muted">
            Your creator profile — niche, setup &amp; progress in one place.
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
      </Card>
    </Link>
  );
}

/* --------------------------- Creator Score ----------------------------- */

function CreatorScoreLink() {
  return (
    <Link href="/creator-score" className="block">
      <Card interactive className="flex items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
          <Gauge className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-ink">
            Creator Score
          </p>
          <p className="text-sm text-muted">
            Your momentum at a glance — one number from 0 to 100.
          </p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
      </Card>
    </Link>
  );
}

/* ----------------------------- Brand kit ------------------------------- */

function BrandKitCard() {
  const { loaded, profile, save } = useProfile();
  const [channelName, setChannelName] = useState("");
  const [niche, setNiche] = useState("");
  const [bio, setBio] = useState("");
  const init = useRef(false);

  useEffect(() => {
    if (profile && !init.current) {
      setChannelName(profile.channelName);
      setNiche(profile.niche);
      setBio(profile.bio);
      init.current = true;
    }
  }, [profile]);

  if (loaded && !profile) {
    return (
      <SettingCard
        icon={Palette}
        title="Brand kit"
        desc="Set up your channel name, niche, and bio."
      >
        <Button href="/onboarding" variant="secondary">
          Set up your brand kit
        </Button>
      </SettingCard>
    );
  }

  return (
    <SettingCard
      icon={Palette}
      title="Brand kit"
      desc="Your channel name, niche, and bio — change these anytime."
    >
      <div className="space-y-3">
        <Field label="Channel name">
          <TextInput value={channelName} onChange={setChannelName} placeholder="My Channel" />
        </Field>
        <Field label="Niche">
          <TextInput value={niche} onChange={setNiche} placeholder="e.g. easy recipes" />
        </Field>
        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="A warm two-sentence channel bio."
            className="w-full resize-none rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </Field>
        <SaveButton
          disabled={!profile || !channelName.trim()}
          onSave={async () => {
            if (!profile) return;
            save({
              ...profile,
              channelName: channelName.trim() || profile.channelName,
              niche: niche.trim(),
              bio: bio.trim(),
            });
          }}
        />
      </div>
    </SettingCard>
  );
}

/* --------------------------- Goal & time ------------------------------- */

function GoalCard() {
  const { loaded, profile, save } = useProfile();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [weeklyHours, setWeeklyHours] = useState<number | null>(null);
  const init = useRef(false);

  useEffect(() => {
    if (profile && !init.current) {
      setGoal(profile.goal);
      setWeeklyHours(profile.weeklyHours);
      init.current = true;
    }
  }, [profile]);

  if (loaded && !profile) return null; // prompted in the Brand kit card above

  return (
    <SettingCard
      icon={Target}
      title="Goal & weekly time"
      desc="What you're aiming for, and how much time you can give it."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {GOAL_IDS.map((id) => {
            const active = goal === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setGoal(id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
                  active
                    ? "border-brand-300 bg-brand-50 text-brand-700"
                    : "border-hairline bg-surface hover:bg-paper",
                )}
              >
                {GOAL_LABELS[id]}
                {active && <Check className="h-4 w-4 text-brand-600" />}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Time per week
          </p>
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

        <SaveButton
          disabled={!profile || !goal || weeklyHours == null}
          onSave={async () => {
            if (!profile || !goal || weeklyHours == null) return;
            save({ ...profile, goal, weeklyHours });
          }}
        />
      </div>
    </SettingCard>
  );
}

/* --------------------------- Editing setup ----------------------------- */

function EditingCard() {
  const [software, setSoftware] = useState("CapCut");
  const [device, setDevice] = useState<Device>("mobile");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = getEditingSetup();
    setSoftware(s.software);
    setDevice(s.device);
    setLoaded(true);
  }, []);

  return (
    <SettingCard
      icon={Clapperboard}
      title="Editing setup"
      desc="The Builder tailors its edit checklist to this."
    >
      <div className="space-y-4">
        <Field label="Editing app">
          <select
            value={software}
            onChange={(e) => setSoftware(e.target.value)}
            className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {EDITING_SOFTWARE.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="You edit on">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "mobile", label: "📱 Phone" },
                { id: "desktop", label: "💻 Computer" },
              ] as { id: Device; label: string }[]
            ).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDevice(d.id)}
                className={cn(
                  "rounded-2xl border py-3 text-sm font-semibold transition-colors",
                  device === d.id
                    ? "border-brand-300 bg-brand-50 text-brand-700"
                    : "border-hairline bg-surface text-muted hover:text-ink",
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </Field>

        <SaveButton
          disabled={!loaded}
          onSave={async () => {
            saveEditingSetup({ software, device });
          }}
        />
      </div>
    </SettingCard>
  );
}

/* ----------------------------- Cadence --------------------------------- */

function CadenceCard() {
  return (
    <SettingCard
      icon={CalendarDays}
      title="Posting cadence"
      desc="How often you post lives in the Calendar."
    >
      <Button href="/calendar" variant="secondary">
        Manage cadence in Calendar
      </Button>
    </SettingCard>
  );
}

/* ---------------------------- Appearance ------------------------------- */

function AppearanceCard() {
  const { isDark, toggle } = useTheme();
  return (
    <SettingCard icon={SunMoon} title="Appearance" desc="Switch between light and dark.">
      <div className="flex items-center justify-between rounded-2xl border border-hairline bg-paper px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Dark mode</p>
          <p className="text-xs text-muted">{isDark ? "On" : "Off"}</p>
        </div>
        <Toggle checked={isDark} onChange={toggle} label="Toggle dark mode" />
      </div>
    </SettingCard>
  );
}

/* ------------------------------ Account -------------------------------- */

/** Sign out — only relevant once real accounts (Supabase) are connected. */
function AccountCard() {
  if (!isSupabaseConfigured()) return null;
  return (
    <SettingCard icon={ShieldCheck} title="Account" desc="You're signed in to Frame.">
      <form action="/auth/signout" method="post">
        <Button type="submit" variant="ghost">
          Sign out
        </Button>
      </form>
    </SettingCard>
  );
}

/* ------------------------------- pieces -------------------------------- */

function Section({
  label,
  delay = 0,
  children,
}: {
  label: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="animate-fade-up space-y-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted">
        {label}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function SettingCard({
  icon: Icon,
  title,
  desc,
  badge,
  children,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-base font-bold">{title}</h2>
            {badge}
          </div>
          <p className="text-sm text-muted">{desc}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
    />
  );
}

/** A button that flips to "Saved ✓" for a moment after a successful save. */
function SaveButton({
  onSave,
  disabled,
}: {
  onSave: () => Promise<void>;
  disabled?: boolean;
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  const click = async () => {
    setState("saving");
    try {
      await onSave();
      setState("saved");
      setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("idle");
    }
  };

  return (
    <Button onClick={click} disabled={disabled || state === "saving"}>
      {state === "saved" ? (
        <>
          Saved <Check className="h-4 w-4" />
        </>
      ) : state === "saving" ? (
        <>
          Saving… <Loader2 className="h-4 w-4 animate-spin" />
        </>
      ) : (
        "Save changes"
      )}
    </Button>
  );
}
