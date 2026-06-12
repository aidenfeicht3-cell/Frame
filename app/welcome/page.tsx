import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Lightbulb,
  Film,
  Type,
  Image as ImageIcon,
  CalendarDays,
  Upload,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/marketing/Reveal";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Frame — YouTube automation that grows your channel",
  description:
    "Frame automates the repetitive 80% of YouTube — ideas, scripts, titles, thumbnails, and scheduling — so you post consistently and grow. No bots, no spam. Start free.",
};

/* --------------------------------- data -------------------------------- */

const PIPELINE: { icon: LucideIcon; label: string }[] = [
  { icon: Lightbulb, label: "Idea" },
  { icon: Film, label: "Script" },
  { icon: Type, label: "Title" },
  { icon: ImageIcon, label: "Thumbnail" },
  { icon: CalendarDays, label: "Schedule" },
  { icon: Upload, label: "Publish" },
];

const MARQUEE = [
  "Idea research",
  "Scripts",
  "Hooks",
  "Titles",
  "Thumbnails",
  "Scheduling",
  "SEO metadata",
  "Growth insights",
  "Brand kit",
  "Streaks",
];

const FEATURES: {
  icon: LucideIcon;
  title: string;
  body: string;
  soon?: boolean;
}[] = [
  {
    icon: Lightbulb,
    title: "Endless ideas",
    body: "Trending-style ideas for your niche, on tap. Bank them so you never face a blank page again.",
  },
  {
    icon: Film,
    title: "Scripts in seconds",
    body: "One idea in → a full script out: hook, talking points, and a shot list, ready to film.",
  },
  {
    icon: Type,
    title: "Titles that get the click",
    body: "Every title and hook scored 1–10 and rewritten stronger — automatically.",
  },
  {
    icon: ImageIcon,
    title: "Thumbnails that pop",
    body: "Concepts and punchy text engineered to win the click and lift your views.",
    soon: true,
  },
  {
    icon: CalendarDays,
    title: "Hands-off scheduling",
    body: "Plan a month of uploads, set a cadence you can keep, and never miss a post.",
  },
  {
    icon: TrendingUp,
    title: "Growth on autopilot",
    body: "See what's working and get told exactly what to make next, every single week.",
  },
];

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Tell Frame your niche",
    body: "Answer a few quick questions. Frame builds your brand kit and a system tailored to your channel.",
  },
  {
    n: "2",
    title: "Let Frame do the busywork",
    body: "Ideas, scripts, titles, thumbnails, and your whole schedule — generated for you, ready to go.",
  },
  {
    n: "3",
    title: "Record, upload, repeat",
    body: "You handle the one part only you can. Frame keeps the pipeline full so you stay consistent and grow.",
  },
];

const FREE_BULLETS = [
  "AI brand kit + niche ideas",
  "A full script & title for your first video",
  "Scheduling calendar",
  "The first steps of your Path",
];

const PRO_BULLETS = [
  "Everything in Free",
  "Unlimited scripts & videos",
  "Title & hook optimizer",
  "Growth analytics & AI coaching",
  "Every Path phase, start to finish",
  "Thumbnail Studio (coming soon)",
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Isn't “automation” against YouTube's rules?",
    a: "Not the way Frame does it. We automate your own workflow — ideas, scripts, titles, scheduling — never bots, fake views, or spam. Everything you publish is genuinely yours and fully policy-safe.",
  },
  {
    q: "Do I have to show my face?",
    a: "No. Frame works for faceless and on-camera channels alike — it plans and packages the content either way.",
  },
  {
    q: "What exactly gets automated?",
    a: "The repetitive 80%: idea research, scripts & hooks, titles, thumbnails (coming soon), scheduling, and growth insights. You bring the recording and hit upload.",
  },
  {
    q: "Do I need any experience?",
    a: "None at all. Frame is built for complete beginners and walks you through every step in plain language.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Start with a 3-day free trial of Pro and cancel whenever you like — no hassle, no hard feelings.",
  },
];

/* --------------------------------- page -------------------------------- */

export default function WelcomePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* -------------------------------- header ------------------------------- */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center" aria-label="Frame home">
          <Logo />
        </a>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-muted md:flex">
          <a href="#features" className="transition-colors hover:text-ink">What it automates</a>
          <a href="#how" className="transition-colors hover:text-ink">How it works</a>
          <a href="#pricing" className="transition-colors hover:text-ink">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-ink">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/today" variant="ghost" className="hidden sm:inline-flex">
            Open app
          </Button>
          <Button href="/signup">
            Start free <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

/* --------------------------------- hero -------------------------------- */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 animate-float rounded-full bg-brand-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-96 w-96 animate-float rounded-full bg-brand-300/20 blur-3xl"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-soft">
            <Zap className="h-3.5 w-3.5" /> YouTube automation — without the bots
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Put the boring 80% of YouTube on{" "}
            <span className="bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
              autopilot
            </span>
            .
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Frame automates the repetitive work behind every video — ideas,
            scripts, titles, thumbnails, and scheduling — so you post
            consistently and grow. No bots, no spam. Just your channel, running
            like a system.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/signup" className="px-6 py-3.5 text-base">
              Start automating — free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#how" variant="ghost" className="px-6 py-3.5 text-base">
              See how it works
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {["Policy-safe", "Faceless or on-camera", "No experience needed"].map(
              (t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-success" /> {t}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <Pipeline />
        </div>
      </div>
    </section>
  );
}

/** The hero's animated "automation pipeline" — a beam sweeps the assembly line. */
function Pipeline() {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="rounded-3xl border border-hairline bg-surface p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="font-display text-sm font-bold">Your channel</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-success" />
            Automating
          </span>
        </div>

        <div
          className="relative mt-4 space-y-2 overflow-hidden rounded-2xl"
          style={{ ["--flow" as string]: "300px" } as React.CSSProperties}
        >
          {PIPELINE.map((step, i) => {
            const Icon = step.icon;
            const last = i === PIPELINE.length - 1;
            return (
              <div
                key={step.label}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-3 py-2.5",
                  last
                    ? "border-brand-300 bg-brand-50"
                    : "border-hairline bg-paper",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-xl",
                    last ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold">{step.label}</span>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-muted">
                  {last ? "you" : "auto"}
                </span>
              </div>
            );
          })}

          {/* sweeping automation beam */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-flow-down bg-gradient-to-b from-transparent via-brand-400/25 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- marquee ------------------------------ */

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="border-y border-hairline bg-surface/40 py-4">
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max shrink-0 animate-marquee items-center gap-3 pr-3">
          {items.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-hairline bg-surface px-4 py-1.5 text-sm font-semibold text-muted"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- problem ------------------------------ */

function Problem() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 md:py-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
            The real problem
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Making a video is 20% filming and{" "}
            <span className="text-brand-600">80% busywork.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Scripting, titles, thumbnails, scheduling, optimizing — it's the
            grind that burns creators out and kills consistency. Frame automates
            that 80%, so the part only you can do is all that's left.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- features ------------------------------ */

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-b border-hairline bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="What it automates"
            title="Your whole content pipeline, on autopilot"
            subtitle="Everything between “I have an idea” and “it's live” — handled for you."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 3) * 90}>
                <div className="group h-full rounded-3xl border border-hairline bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    {f.soon && (
                      <span className="rounded-full bg-amber/10 px-2.5 py-1 text-[11px] font-bold text-amber">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ how it works --------------------------- */

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-b border-hairline">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Set it up once. Stay consistent forever."
            subtitle="Three steps to a channel that practically runs itself."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="h-full rounded-3xl border border-hairline bg-surface p-6 shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 font-display text-lg font-bold text-white shadow-glow">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- pricing ------------------------------ */

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 border-b border-hairline">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Start free. Automate everything when you're ready."
            subtitle="Your first video is on us. Go Pro to put the whole channel on autopilot — with a 3-day free trial."
          />
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2 md:items-start">
          <Reveal>
            <div className="h-full rounded-3xl border border-hairline bg-surface p-7 shadow-card">
              <h3 className="font-display text-xl font-bold">Free</h3>
              <p className="mt-1 text-sm text-muted">Automate your first video.</p>
              <p className="mt-5">
                <span className="font-display text-4xl font-extrabold">$0</span>
                <span className="text-sm text-muted"> / forever</span>
              </p>
              <Button href="/signup" variant="secondary" className="mt-5 w-full">
                Start free
              </Button>
              <BulletList items={FREE_BULLETS} />
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="relative h-full rounded-3xl border-2 border-brand-500 bg-surface p-7 shadow-lift">
              <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-glow">
                <Sparkles className="h-3 w-3" /> Most popular
              </span>
              <h3 className="font-display text-xl font-bold">Frame Pro</h3>
              <p className="mt-1 text-sm text-muted">Automate your whole channel.</p>
              <p className="mt-5">
                <span className="font-display text-4xl font-extrabold">$15</span>
                <span className="text-sm text-muted"> / month</span>
              </p>
              <Button href="/signup?plan=pro" className="mt-5 w-full">
                Start 3-day free trial <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-2 text-center text-xs text-muted">
                Then $15/month. Cancel anytime.
              </p>
              <BulletList items={PRO_BULLETS} highlight />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BulletList({
  items,
  highlight,
}: {
  items: string[];
  highlight?: boolean;
}) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm">
          <span
            className={cn(
              "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
              highlight ? "bg-brand-600 text-white" : "bg-success/15 text-success",
            )}
          >
            <Check className="h-3.5 w-3.5" />
          </span>
          <span className="text-ink">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------- faq -------------------------------- */

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-b border-hairline bg-surface/40">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            subtitle="Honest about what Frame does — and doesn't — do."
          />
        </Reveal>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="group rounded-2xl border border-hairline bg-surface px-5 py-4 shadow-card [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform duration-200 group-open:rotate-45">
                    <span className="text-lg leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- final cta ----------------------------- */

function FinalCta() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-14 text-center shadow-lift sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-white/10 blur-2xl"
            />
            <h2 className="relative font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your channel could be running itself by tonight.
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-white/80">
              Take the first step now — Frame automates the rest.
            </p>
            <div className="relative mt-7 flex justify-center">
              <Button href="/signup" variant="light" className="px-7 py-3.5 text-base">
                Start automating — free <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------- footer ------------------------------- */

function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-muted">
          <a href="#features" className="hover:text-ink">What it automates</a>
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
          <a href="#faq" className="hover:text-ink">FAQ</a>
          <a href="/today" className="hover:text-ink">Open app</a>
        </nav>
        <p className="text-xs text-muted">© 2026 Frame</p>
      </div>
    </footer>
  );
}

/* ------------------------------- helpers ------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-balance font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-muted">{subtitle}</p>
    </div>
  );
}
