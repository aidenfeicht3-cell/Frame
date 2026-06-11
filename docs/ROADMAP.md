# Roadmap

## ✅ Done

- **App shell & design system** — blue tokens, Bricolage + Inter fonts, custom
  logo (viewfinder + play), bottom nav / sidebar, dark mode.
- **Onboarding** — starting point → niche → **similar channels to study** → AI
  **brand kit** (name picker, bio, banner/pfp concepts) → goal + weekly time;
  saves a profile.
- **The Path** — Season 1 (8 levels), lesson + one action each, sequential
  unlock, progress bar, Season 2 preview.
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
- **Celebration confetti** on step-complete / season-complete / publish /
  milestone.
- **Settings** — paste your Anthropic key in-app to flip the whole app from
  "Sample AI" → "Live AI" (the key is saved on your device and re-synced to the
  server on every load, so it survives restarts); edit the brand kit
  (name/niche/bio), goal & weekly time, editing software/device, and light/dark.

## 🔜 Next core screens (buildable now, sample data)

- **Thumbnail Studio** — teach the principles; AI suggests 2–3 concepts + punchy
  text; a simple 1280×720 editor (background + 1–2 text layers) that exports a
  PNG; a readability "score". Leave a `// TODO` for AI image generation.
- **Asset Locker** (per video) — suggested royalty-free music / SFX / b-roll with
  direct search/download links (Pixabay, Jamendo, Pexels). `// TODO` for a real
  music/footage API.

## 🔒 Needs the backend / accounts (stubbed in `lib/youtube.ts`)

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
