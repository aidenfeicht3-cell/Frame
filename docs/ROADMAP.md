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
