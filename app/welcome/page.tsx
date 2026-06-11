import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Sparkles,
  Route,
  Clapperboard,
  CalendarDays,
  BarChart3,
  Repeat,
  Play,
  type LucideIcon,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Frame — Go from zero subscribers to a real creator",
  description:
    "Frame is Couch-to-5K for YouTube: a calm, step-by-step coach that turns complete beginners into consistent creators. Start your first video free.",
};

/* --------------------------------- data -------------------------------- */

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Route,
    title: "The Path",
    body: "A guided route from your very first video to a steady habit — one small, doable step at a time. Never wonder what to do next.",
  },
  {
    icon: Clapperboard,
    title: "Video Builder",
    body: "Turn an idea into a full plan — hook, title, script, shots, and an edit checklist tailored to your editing app and your phone or computer.",
  },
  {
    icon: Sparkles,
    title: "AI brand kit",
    body: "Tell us your niche and get channel-name ideas, a bio, banner and profile concepts, plus real creators worth studying.",
  },
  {
    icon: CalendarDays,
    title: "Smart calendar",
    body: "Plan uploads, set a posting rhythm you can actually keep, and get gentle reminders for what's coming up next.",
  },
  {
    icon: BarChart3,
    title: "Progress & coaching",
    body: "Log a video's numbers and get specific, encouraging tips for the next one — with a views-over-time graph and milestones.",
  },
  {
    icon: Repeat,
    title: "Streaks & momentum",
    body: "Show up a little each day and watch your streak grow. Small wins, celebrated — because consistency is the whole game.",
  },
];

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Tell us your niche",
    body: "Answer a few friendly questions. Frame builds your brand kit and a Path made for where you're starting from.",
  },
  {
    n: "2",
    title: "Follow your Path",
    body: "Each day, one clear step. Learn the craft and make real progress without the overwhelm or the guesswork.",
  },
  {
    n: "3",
    title: "Publish & build the habit",
    body: "Plan, film, and ship videos with help at every stage — then keep your streak alive and grow week over week.",
  },
];

const FREE_BULLETS = [
  "Your AI brand kit & channel name",
  "The first steps of your Path",
  "Plan & publish your first video",
  "Calendar to schedule your upload",
];

const PRO_BULLETS = [
  "Everything in Free",
  "Unlimited videos & full Video Builder",
  "Every Path season, start to finish",
  "Live AI coaching on every video",
  "Progress analytics & milestones",
  "Thumbnail Studio (coming soon)",
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need any experience?",
    a: "None at all. Frame is built for complete beginners with zero subscribers. It explains everything in plain language and only ever asks for one small step at a time.",
  },
  {
    q: "Do I have to pay for AI separately?",
    a: "No. Your subscription includes all the AI — brand kits, video plans, title ratings, and coaching. There are no API keys to set up and nothing extra to buy.",
  },
  {
    q: "What's included in the free plan?",
    a: "Enough to get your very first video out the door: your AI brand kit, the opening steps of your Path, and the tools to plan, build, and schedule one video.",
  },
  {
    q: "What do I need to get started?",
    a: "Just your phone. Frame works on mobile and desktop, and the Video Builder tailors its edit steps to whatever editing app you already use.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Start with a 3-day free trial of Pro, and cancel whenever you like — no hassle, no hard feelings.",
  },
];

/* --------------------------------- page -------------------------------- */

export default function WelcomePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
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
          <a href="#how" className="transition-colors hover:text-ink">How it works</a>
          <a href="#features" className="transition-colors hover:text-ink">Features</a>
          <a href="#pricing" className="transition-colors hover:text-ink">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-ink">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/" variant="ghost" className="hidden sm:inline-flex">
            Open app
          </Button>
          <Button href="/onboarding">
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
      {/* soft blue glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-brand-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-96 w-96 rounded-full bg-brand-300/20 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> Couch-to-5K, but for YouTube
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Become a YouTuber,{" "}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              one step at a time
            </span>
            .
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Frame turns &ldquo;I don&apos;t know where to start&rdquo; into a clear
            daily path — from your first video to a real posting habit. No
            experience needed.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/onboarding" className="px-6 py-3.5 text-base">
              Start your first video — free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#how" variant="ghost" className="px-6 py-3.5 text-base">
              See how it works
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {["Free to start", "No credit card", "Cancel anytime"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-success" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <AppPreview />
        </div>
      </div>
    </section>
  );
}

/** A stylised peek at the app — purely decorative, built from the design tokens. */
function AppPreview() {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="rounded-3xl border border-hairline bg-surface p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="font-display text-sm font-bold">Today</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber/10 px-2.5 py-1 text-xs font-bold text-amber">
            🔥 5 day streak
          </span>
        </div>

        {/* next step highlight */}
        <div className="mt-4 rounded-2xl bg-brand-600 p-4 text-white shadow-glow">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Your next step
          </p>
          <p className="mt-1 font-display text-lg font-bold">Film your hook</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-2/3 rounded-full bg-white" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold">
              <Play className="h-3 w-3" /> Step 3 of 8
            </span>
          </div>
        </div>

        {/* path rows */}
        <div className="mt-4 space-y-2">
          {[
            { label: "Find your first idea", done: true },
            { label: "Write a scroll-stopping title", done: true },
            { label: "Film your hook", done: false, current: true },
          ].map((row) => (
            <div
              key={row.label}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-3 py-2.5",
                row.current
                  ? "border-brand-300 bg-brand-50"
                  : "border-hairline bg-paper",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full text-white",
                  row.done ? "bg-success" : row.current ? "bg-brand-600" : "bg-muted",
                )}
              >
                {row.done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-[11px] font-bold">3</span>
                )}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  row.done && "text-muted line-through",
                )}
              >
                {row.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ how it works --------------------------- */

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-t border-hairline">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="How it works"
          title="From overwhelmed to on your way in three steps"
          subtitle="No fluff, no 47-tab rabbit holes. Just the next right thing to do."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-3xl border border-hairline bg-surface p-6 shadow-card"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 font-display text-lg font-bold text-white shadow-glow">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- features ------------------------------ */

function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-hairline bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Everything you need"
          title="Your whole creator toolkit, in one calm place"
          subtitle="Frame does the boring parts and teaches the craft — so you can actually hit publish."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-3xl border border-hairline bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- pricing ------------------------------ */

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 border-t border-hairline">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Go Pro when you're ready."
          subtitle="Your first video is on us. Upgrade for the full journey — with a 3-day free trial."
        />

        <div className="mx-auto mt-10 grid max-w-3xl gap-5 md:grid-cols-2 md:items-start">
          {/* Free */}
          <div className="rounded-3xl border border-hairline bg-surface p-7 shadow-card">
            <h3 className="font-display text-xl font-bold">Free</h3>
            <p className="mt-1 text-sm text-muted">Your first video, on the house.</p>
            <p className="mt-5">
              <span className="font-display text-4xl font-extrabold">$0</span>
              <span className="text-sm text-muted"> / forever</span>
            </p>
            <Button href="/onboarding" variant="secondary" className="mt-5 w-full">
              Start free
            </Button>
            <BulletList items={FREE_BULLETS} />
          </div>

          {/* Pro */}
          <div className="relative rounded-3xl border-2 border-brand-500 bg-surface p-7 shadow-lift">
            <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white shadow-glow">
              <Sparkles className="h-3 w-3" /> Most popular
            </span>
            <h3 className="font-display text-xl font-bold">Frame Pro</h3>
            <p className="mt-1 text-sm text-muted">Everything, for the long haul.</p>
            <p className="mt-5">
              <span className="font-display text-4xl font-extrabold">$15</span>
              <span className="text-sm text-muted"> / month</span>
            </p>
            <Button href="/onboarding" className="mt-5 w-full">
              Start 3-day free trial <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="mt-2 text-center text-xs text-muted">
              Then $15/month. Cancel anytime.
            </p>
            <BulletList items={PRO_BULLETS} highlight />
          </div>
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
    <section id="faq" className="scroll-mt-20 border-t border-hairline bg-surface/40">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          subtitle="Still curious? You'll find the rest inside."
        />
        <div className="mt-8 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-hairline bg-surface px-5 py-4 shadow-card [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold">
                {f.q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform duration-200 group-open:rotate-45">
                  <span className="text-lg leading-none">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- final cta ----------------------------- */

function FinalCta() {
  return (
    <section className="border-t border-hairline">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-14 text-center shadow-lift sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
          <h2 className="relative font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your first video is closer than you think.
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/80">
            Join Frame and take the first small step today. We&apos;ll guide the
            rest.
          </p>
          <div className="relative mt-7 flex justify-center">
            <Button href="/onboarding" variant="light" className="px-7 py-3.5 text-base">
              Get started free <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- footer ------------------------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-muted">
          <a href="#how" className="hover:text-ink">How it works</a>
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
          <a href="#faq" className="hover:text-ink">FAQ</a>
          <a href="/" className="hover:text-ink">Open app</a>
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
