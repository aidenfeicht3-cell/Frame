# Frame 🎬

**Couch-to-5K, but for becoming a YouTuber.** Frame helps a complete beginner —
zero subscribers, overwhelmed, ready to quit — become a consistent creator. It
teaches the craft, does the boring 80%, and uses gentle habit mechanics. The
whole app is built around one idea: **never overwhelm. One calm step at a time.**

🔵 Blue-forward, mobile-first, light **and** dark. Live at
**[frame-omega-sepia.vercel.app](https://frame-omega-sepia.vercel.app)**.

Frame is a **paid subscription product**: a Free plan ("your first video, free")
plus **Frame Pro — $15/mo with a 3-day trial**. The *business* holds the AI key,
so subscribers get live AI with nothing to paste. Everything also runs on
**built-in sample data with no keys at all**, so you can clone and try it instantly.

## Run it

```bash
cd C:\Users\Ashton\Projects\frame
npm install      # first time only
npm run dev      # then open http://localhost:3000
npm run build    # type-check + production build
```

> ⚠️ Keep the project on **local disk** (not OneDrive/Dropbox) — cloud-sync
> folders corrupt `node_modules` and break the dev server.

### Optional environment (`.env.local`)

Frame runs with **zero** configuration. Add any of these to go from sample mode
to the real thing locally:

```bash
# Live AI (otherwise smart sample responses are used — nothing breaks)
ANTHROPIC_API_KEY=sk-ant-...

# Accounts + cross-device sync (otherwise data stays in this browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

With no Anthropic key, every "Sample AI" badge stays grey; add one and it turns
"Live AI". With no Supabase keys, there's no login wall and data lives in
`localStorage`; add them and Frame gates behind sign-in and syncs each account's
data to its own row.

## What's inside

**The journey**
- **Onboarding** — niche → similar channels to study → an AI **brand kit** (names,
  bio, banner/pfp concepts) → goal + weekly time. Saves your profile.
- **Today** — your home: a greeting, your one clear next step, next upload, real
  streak / weekly / Path stats, and quick links to everything below.
- **The Path** — a leveled journey (Phase 1 = zero to your first video). Each
  level is a short lesson + one action; finishing one feeds your **streak** 🔥.

**Making videos**
- **Video Builder** — an idea → a full production plan revealed one step at a time
  (Hook → Title → Script → Shots → B-roll → Sound → Edit → Publish). The Edit
  step adapts to **your editing app and phone vs. computer**.
- **Projects** — an 8-stage completion tracker (Idea → … → Published) with a
  completion ring per video and a nudge toward the one closest to done.
- **Calendar** — schedule uploads, set a weekly cadence, see what's upcoming.
- **Progress** — log a video's stats, see a **views-over-time line graph** with
  peaks/drops, get per-video **AI coaching**, and track **milestones**.

**Smarts & tools**
- **Frame IQ** — a free, computed "creator profile" derived from everything Frame
  knows (niche, setup, history). One plain-language summary + rule-based tips; it's
  the compact context the AI features read.
- **Creator Score** — one 0–100 momentum score (Consistency + Output + Pipeline +
  Insight) with a tier, breakdown, daily delta, and a coach note. Pure math, no AI.
- **Next-Video Roadmap** — AI picks your next 3 videos from Frame IQ (title, hook,
  angle, effort). Cached per input, so it generates once and only refreshes on demand.
- **Content Vault** — one searchable home for every idea + project.
- **Hook & title tester** (rates a title 1–10 + rewrites) and an **Idea vault**.

**The shell**
- **Settings** — your plan/billing, brand kit, goal & time, editing setup, theme,
  and links to Frame IQ / Creator Score / Next-Video Roadmap.
- **Landing page** (`/welcome`) — public marketing page (hero, how-it-works,
  pricing, FAQ), rendered without the app chrome.
- **Accounts** — real sign-up / login via Supabase, route-gated by middleware.
- Polish: **dark mode** (respects your system), **confetti** on wins, gentle motion.

## How it's built

- **Swappable data layer.** Screens never touch `localStorage` directly. Each
  feature has `lib/<feature>/store.ts` (repository functions) + a `use<Feature>.ts`
  hook; `lib/storage.ts` is the only thing that talks to storage. A per-user
  Supabase `app_state` table mirrors the same model, so the cloud swap is small.
- **All AI lives in `lib/ai.ts`** (model `claude-sonnet-4-6`), with niche-aware
  **sample fallbacks** in `lib/ai-samples.ts`. Client code never imports it — it
  calls server routes in `app/api/*`, so the key stays server-side. AI results are
  **cached by an input hash** so credits are never wasted regenerating the same thing.
- **Theming** is token-based (`bg-surface`, `text-ink`, `text-muted`, `bg-brand-50`,
  `border-hairline`) so every screen works in dark mode automatically.

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · React 18 ·
lucide-react · @anthropic-ai/sdk · Supabase (`@supabase/ssr`). Deployed on Vercel
(push to `main` auto-deploys).

## Docs

- [`CLAUDE.md`](./CLAUDE.md) — context for AI coding sessions (Claude Code).
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — data layer, AI module, theming.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — what's done and what's next.
- [`docs/CREATOR_SCORE.md`](./docs/CREATOR_SCORE.md) — a worked example of a
  feature build plan (the pattern new AI features follow).
