# CLAUDE.md — context for Claude Code

This file is auto-loaded each session. It tells you (Claude) everything you need
to continue building **Frame** without the previous chat history.

## What Frame is

"**Couch-to-5K, but for becoming a YouTuber.**" Frame helps a complete beginner
(zero subscribers, overwhelmed, likely to quit) become a consistent creator. It
teaches the craft, does the boring parts, and uses habit mechanics.
**Core principle: never overwhelm — one calm step at a time, clean screens, one
clear action per screen.**

The user (Ashton) is a beginner dev, likes the colour **blue**, and wants:
plain-language explanations before you act, **small runnable chunks**, **mock /
sample data first (must run with no API keys)**, and each feature **verified in
the browser** before moving on. Build and commit one feature at a time.

## Run it

```powershell
cd C:\Users\Ashton\Projects\frame
npm install      # first time only
npm run dev      # http://localhost:3000
npm run build    # type-check + verify before committing
```

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · React 18 ·
lucide-react (icons) · @anthropic-ai/sdk. Data persists to **localStorage** for
now (no database yet). Deployable to Vercel later.

## ⚠️ Gotchas that have already bitten us — do not relearn these

1. **Never put this project in OneDrive.** It was originally in
   `OneDrive\...\Framer`; OneDrive turned `node_modules` into placeholder files
   ("Cannot find module …app-page.runtime.dev.js") and locked `.next` (EBUSY).
   It now lives at `C:\Users\Ashton\Projects\frame`. Keep it on local disk.
2. **lucide-react is v1.x** — brand icons were removed. `Youtube` does **not**
   exist; use generic icons (Clapperboard, Tv, Video, etc.).
3. **PowerShell 5.1 + git commit:** double-quotes inside a commit message break
   native arg passing. Use a single-quoted here-string with **no `"` characters**:
   ```powershell
   git -C "C:\Users\Ashton\Projects\frame" commit -m @'
   Title line
   - bullet
   '@
   ```
4. **Port 3000 in use** → clear stray dev servers:
   ```powershell
   Get-NetTCPConnection -LocalPort 3000 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   ```
5. Run dev with **no extra args** (`npm run dev`, not `npm run dev a`).

## Architecture & conventions (follow these for every new feature)

- **Data layer is swappable.** Screens never touch `localStorage` directly.
  - `lib/storage.ts` — SSR-safe `readJSON`/`writeJSON` + `STORAGE_KEYS`.
  - Each feature has `lib/<feature>/store.ts` (repository functions) and a
    `use<Feature>.ts` client hook that loads on mount and auto-saves on change
    (guard saves behind a `loaded` flag; gate date/time-dependent UI on `loaded`
    to avoid hydration mismatches). When we add a real DB, only the stores +
    `storage.ts` change — no screen edits.
- **All AI lives in `lib/ai.ts`** (model `claude-sonnet-4-6`, key from
  `ANTHROPIC_API_KEY`). With **no key it returns niche-aware sample answers**
  from `lib/ai-samples.ts`, so everything runs with zero setup. Client code
  **never imports `lib/ai.ts`** — it calls server route handlers in `app/api/*`
  (key stays server-side). `/api/ai-status` reports whether AI is live; screens
  show a "Sample AI" / "Live AI" badge. Real third-party services (YouTube) are
  stubbed in `lib/youtube.ts` with `// TODO` and read keys from env.
- **Dark mode / theming:** structural tokens `paper, surface, ink, muted,
  hairline, brand-50, brand-100` are `rgb(var(--c-*)/<alpha>)` defined in
  `app/globals.css` (`:root` light, `.dark` dark). brand-200..900 + indigo,
  coral, amber, success are fixed hex. **Always style with these tokens**
  (`bg-paper`, `bg-surface`, `text-ink`, `text-muted`, `border-hairline`,
  `bg-brand-50`) so new UI works in dark mode automatically. `lib/useTheme.ts` +
  `components/ThemeToggle.tsx`; a no-flash script in `app/layout.tsx`.
- **Streak:** `lib/streak.ts` `markActiveToday()` + `computeStreak`; the
  `frame:streak` window event makes `lib/useStreak.ts` refresh the flame live.
- **Celebration:** `lib/celebrate.ts` `celebrate(msg)` dispatches
  `frame:celebrate`; `components/Celebration.tsx` (mounted in `AppShell`) shows
  confetti + a toast. Confetti is hidden under `prefers-reduced-motion`.
- **Design:** blue-forward (full `brand` scale), soft shadows, rounded 16–24px,
  generous whitespace, subtle motion (`animate-fade-up`). Reusable UI:
  `components/ui/{Button,Card,Sheet,Toggle,PagePlaceholder}.tsx`. Headings use
  `font-display` (Bricolage), body uses Inter. Coral is reserved for the logo.
- **Nav:** bottom tab bar on phones, sidebar on desktop (`components/AppShell`,
  `BottomNav`, `Sidebar`, `TopBar`). Primary tabs: Today, Path, Build, Calendar,
  Progress; Settings via the gear.

## How to work (verification loop)

After building a feature: `npm run build` to type-check, then run the dev server
and **verify in the browser** (use the preview tools / screenshots). Confirm it
renders and persists across reload. Then commit (one feature per commit, message
ends with the Co-Authored-By trailer). Explain steps to Ashton in plain language.

## Status — see `docs/ROADMAP.md` for the live list

Done: app shell + blue design + logo · Onboarding + AI brand kit + channels to
study · The Path (Season 1) + streak · Calendar (scheduling, cadence, upcoming,
time-of-day) · Progress (manual stats, views-over-time line chart, AI coaching,
milestones) · Video Builder (editing-software & phone/computer aware) · Today
(live data) · Hook & title tester · Idea vault · Dark mode · Confetti ·
**Settings** (paste Anthropic key in-app → Live AI, edit brand kit / goal /
editing setup / theme).

**In-app Anthropic key (how it works):** the user pastes a key in Settings; it's
saved to localStorage (`lib/settings/*`, key `frame:settings`) and POSTed to
`/api/key`, which stores it in the server's process memory (`lib/runtime-key.ts`,
never sent back to the browser). `lib/ai.ts` `resolveKey()` prefers the runtime
key, then `ANTHROPIC_API_KEY`, then falls back to samples — so no AI call site
changed. `<KeySync/>` (mounted in `AppShell`) re-POSTs the saved key on every
load so it survives a dev-server restart. `/api/ai-status` now also returns
`hasEnvKey` / `hasRuntimeKey`. TODO: for a real multi-instance/serverless deploy,
move the key off a single process variable (per-request or a secured backend).

Next core screens: **Thumbnail Studio**, **Asset Locker**. Backend-dependent
(stub now): connect YouTube channel → live analytics, reply to comments (OAuth;
every reply must require explicit user approval). Later extras: teleprompter,
niche trend radar, batch planning, accountability nudge.
