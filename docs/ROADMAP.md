# Roadmap

## ✅ Done

- **App shell & design system** — blue tokens, Bricolage + Inter fonts, custom
  logo (viewfinder + play), bottom nav / sidebar, dark mode.
- **Onboarding** — starting point → niche → **similar channels to study** → AI
  **brand kit** (name picker, bio, banner/pfp concepts) → goal + weekly time;
  saves a profile.
- **The Path** — Phase 1 (8 levels), lesson + one action each, sequential
  unlock, progress bar, Phase 2 preview.
- **Streak** — completing a Path action (or publishing) marks the day active;
  live flame in the top bar / sidebar / Today; weekly-active count.
- **Calendar** — month grid, schedule uploads (Planned / In progress /
  Published), recurring cadence + "fill this month", upcoming list, optional
  time-of-day, "next upload" reminder, best-time tips.
- **Progress** — log a video's stats, **views-over-time line graph** (peak in
  amber, growth badge), per-video **AI coaching**, and **milestones** (targets +
  progress bars + presets).
- **Video Builder** — idea → full production plan revealed one step at a time;
  the **Edit step adapts to the chosen editing app + phone/computer**; projects
  save and resume.
- **Today** — live data: greeting, next Path step (or start hero), next upload,
  real stats, Path preview.
- **Tools** — Hook & title tester; Idea vault (Plan-this → Builder).
- **Celebration confetti** on step-complete / phase-complete / publish /
  milestone.
- **Settings** — manage your subscription/plan, and edit the brand kit
  (name/niche/bio), goal & weekly time, editing software/device, and light/dark.
- **Landing page** (`/welcome`) — public marketing page: hero + app preview,
  how-it-works, features, pricing, FAQ, footer. Renders without the app chrome
  via `ShellGate`.
- **Monetization** — Frame is a paid product. Free plan ("first video free") +
  **Frame Pro $15/mo with a 3-day free trial**. The business holds the Anthropic
  key, so subscribers get live AI with nothing to set up. Billing in Settings is
  a mock today (`lib/billing/*`) — real checkout (Stripe) comes with the backend.

## 🚀 Bigger build — "operating system for faceless creators"

Seven product features, built **one per chat**, ordered by value-per-credit.
Every AI-heavy one must **cache its result** (store it in Supabase `app_state`,
keyed by a hash of its inputs) so we never regenerate or waste credits.

1. **Project Completion System** ✅ — 8-stage tracker + completion ring (`/projects`).
2. **Content Vault** ✅ — unified, searchable workspace of ideas + projects (`/vault`).
3. **Frame IQ** ✅ — a cheap personalization layer (`lib/frame-iq`, `/frame-iq`)
   that DERIVES one compact "creator profile" from data we already store (niche,
   editing setup, projects/ideas/stats/streak/cadence) — computed, no new
   storage, ~no AI credits. Shows a plain-language summary + 2–3 rule-based tips,
   surfaced as a card on Today. It's the compact context the AI features below
   feed on, which keeps *them* cheap too.
4. **Creator Score** ✅ — one momentum score (0–100) from Frame IQ
   (`lib/creator-score`, `/creator-score`). Pure rule-based math, zero AI in v1:
   Consistency 35 + Output 30 + Pipeline 20 + Insight 15, with a tier (Spark →
   Builder → Momentum → On fire), a four-part breakdown, a "today" delta, and a
   rule-based coach note pointing at the weakest area. Surfaced as a Today card
   and a Settings link. Optional cached AI coach note is still a later add-on
   (see [`CREATOR_SCORE.md`](./CREATOR_SCORE.md)).
5. **Next-Video Roadmap** ✅ — AI suggests your next 3 videos from Frame IQ
   (`lib/roadmap`, `/roadmap`). First AI feature: niche-aware suggestions
   (title + hook + angle + effort), with a sample fallback when there's no key.
   **Cached** by an input hash in `frame:nextVideos` (synced to Supabase), so it
   generates once and only refreshes on an explicit "Regenerate" — never on a
   loop. Each card has "Plan this" (→ Builder) and "Save to ideas". Surfaced as a
   Today card and a Settings link.
6. **Retention Analyzer** ✅ — paste a script (or outline / transcript) and Frame
   scores it for watch-time (`lib/retention`, `/retention`): an overall retention
   score + letter grade, what's working, the risky moments where viewers drop
   (each with a concrete fix), and first-15-seconds advice. AI-light with a
   rule-based sample fallback (flags slow intros, weak hooks, walls of text,
   missing pattern interrupts). **Cached** by a hash of the script in
   `frame:retention` (synced to Supabase), so re-analyzing the same script costs
   zero credits. Surfaced as a Today card and a Settings link, with a "Test a
   hook" cross-link to the Title tester.
7. **Why It Went Viral** ✅ — paste a public YouTube link/ID → Frame pulls the
   video's public stats (`lib/youtube` `getVideoById`, key-only, no OAuth) and an
   AI explains *why it likely went viral* across title, thumbnail, hook, format,
   and timing, plus what's repeatable for your niche (`lib/viral`, `/viral`).
   **Cached** by video id in `frame:viral` (synced to Supabase), so re-analyzing
   the same video costs zero credits. Sample video + sample-AI fallback so it
   runs key-free. Surfaced as a Today card and a Settings link, with a "Test your
   own title" cross-link. ⚠️ **Prod needs `YOUTUBE_API_KEY` in Vercel env vars**
   (without it the live site shows a labelled *sample* video). Owner-only
   retention (your own channel's graph) still needs Google OAuth — a later add-on.

## ☁️ Data layer — localStorage → per-user Supabase

In progress, one feature at a time (see `lib/sync/`); each account's data follows
it across devices. **Done:** profile, streak, and the cached AI results
(Next-Video Roadmap, Retention, Why-It-Went-Viral). **Pending:** calendar, path,
projects, builder, ideas, milestones, analytics, vault, billing.

## 🔜 Next core screens (buildable now, sample data)

- **Thumbnail Studio** — teach the principles; AI suggests 2–3 concepts + punchy
  text; a simple 1280×720 editor (background + 1–2 text layers) that exports a
  PNG; a readability "score". Leave a `// TODO` for AI image generation.
- **Asset Locker** (per video) — suggested royalty-free music / SFX / b-roll with
  direct search/download links (Pixabay, Jamendo, Pexels). `// TODO` for a real
  music/footage API.

## 🔒 Needs the backend / accounts (stubbed in `lib/youtube.ts`)

- **Accounts + subscription billing** — real sign-up/login and Stripe checkout
  for the 3-day trial → Frame Pro. The Billing section in Settings is mock today
  (`lib/billing/*`); swap the store for Stripe and the screen stays. Gate Pro-only
  features behind the plan once accounts exist.
- **Connect your channel → live analytics** — real daily views & subscriber
  growth feeding the Progress line graph (YouTube Data API; public stats need a
  key, retention needs owner OAuth).
- **Reply to comments in-app** — YouTube OAuth write scope. **Every reply must
  require explicit user approval before posting.** Build last.

## 💡 Later extras (Ashton said yes; not yet built)

Teleprompter mode · Niche trend radar · Batch planning (a week at once) ·
Accountability nudge (friendly check-in after a few days away).

## Conventions for new work

Follow the patterns in [`ARCHITECTURE.md`](./ARCHITECTURE.md): a `store.ts` +
`use*.ts` per feature, AI only in `lib/ai.ts` with a sample fallback, theme-aware
tokens, build + browser-verify, then commit one feature at a time.
