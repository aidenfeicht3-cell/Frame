"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
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
import {
  getEditingSetup,
  saveEditingSetup,
} from "@/lib/builder/store";
import { EDITING_SOFTWARE, type Device } from "@/lib/builder/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const HOURS = [
  { label: "1–2 hrs", value: 2 },
  { label: "3–5 hrs", value: 4 },
  { label: "6+ hrs", value: 6 },
];
const GOAL_IDS: Goal[] = ["first_video", "post_weekly", "1k_subs"];

export default function SettingsPage() {
  return (
    <div className="space-y-6 py-2">
      <header className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted">
          Manage your plan, and tweak anything you set up earlier.
        </p>
      </header>

      <BillingCard />
      <BrandKitCard />
      <GoalCard />
      <EditingCard />
      <AppearanceCard />
      <CadenceCard />
      <AccountCard />
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
      emoji="💳"
      title="Your plan"
      desc="Your subscription powers live AI on every video — no setup needed."
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
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-paper px-4 py-3">
            <div>
              <p className="text-sm font-semibold">{planLabel}</p>
              <p className="text-xs text-muted">{statusText}</p>
            </div>
            {isPro && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                <Check className="h-3.5 w-3.5" /> Active
              </span>
            )}
          </div>

          {!isPro ? (
            <>
              <Button onClick={startTrial}>
                Start {TRIAL_DAYS}-day free trial <Sparkles className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted">
                Unlocks unlimited videos, every Path phase, and live AI coaching.
                After the trial it&apos;s {PRO_PRICE}/month. Cancel anytime.
              </p>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={cancel}>
                Cancel subscription
              </Button>
              <p className="text-xs text-muted">
                Manage or cancel anytime — you&apos;ll keep Pro until the end of
                your billing period.
              </p>
            </>
          )}
          <p className="text-[11px] text-muted">
            Billing is a preview for now — real checkout is coming soon.
          </p>
        </div>
      )}
    </SettingCard>
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
        emoji="🎨"
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
      emoji="🎨"
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
      emoji="🎯"
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
      emoji="🎬"
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

/* ---------------------------- Appearance ------------------------------- */

function AppearanceCard() {
  const { isDark, toggle } = useTheme();
  return (
    <SettingCard emoji="🌗" title="Appearance" desc="Switch between light and dark.">
      <div className="flex items-center justify-between rounded-2xl border border-hairline bg-paper px-4 py-3">
        <span className="text-sm font-semibold">Dark mode</span>
        <Toggle checked={isDark} onChange={toggle} label="Toggle dark mode" />
      </div>
    </SettingCard>
  );
}

/* ----------------------------- Cadence --------------------------------- */

function CadenceCard() {
  return (
    <SettingCard
      emoji="🗓️"
      title="Posting cadence"
      desc="How often you post lives in the Calendar."
    >
      <Button href="/calendar" variant="secondary">
        Manage cadence in Calendar
      </Button>
    </SettingCard>
  );
}

/** Sign out — only relevant once real accounts (Supabase) are connected. */
function AccountCard() {
  if (!isSupabaseConfigured()) return null;
  return (
    <SettingCard
      emoji="🔐"
      title="Account"
      desc="You're signed in to Frame."
    >
      <form action="/auth/signout" method="post">
        <Button type="submit" variant="ghost">
          Sign out
        </Button>
      </form>
    </SettingCard>
  );
}

/* ------------------------------- pieces -------------------------------- */

function SettingCard({
  emoji,
  title,
  desc,
  badge,
  children,
}: {
  emoji: string;
  title: string;
  desc: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-lg">
          {emoji}
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
