# Handoff — start a fresh chat cheaply

This file exists so a new session can pick up Frame **without re-exploring the
codebase** (which burns usage). Read the four files in "Start here", then go.

## Start here (in this order)

1. `CLAUDE.md` — what Frame is, stack, conventions, gotchas.
2. `docs/ROADMAP.md` — the live feature list (what's done / what's next).
3. `docs/HANDOFF.md` — this file (current state + the next task).
4. Your memory: `MEMORY.md` → `frame-build-plan.md` (the detailed running log).

Project lives at `C:\Users\Ashton\Projects\frame` (NOT the OneDrive copy).

## Status snapshot (2026-06-14)

The 7-feature "operating system for faceless creators" build is **7 of 7 done — COMPLETE** 🎉:

1. Project Completion System ✅
2. Content Vault ✅
3. Frame IQ ✅
4. Creator Score ✅
5. Next-Video Roadmap ✅ — first AI feature; established the **AI + cache** pattern.
6. Retention Analyzer ✅ — `lib/retention`, `/retention`. Paste a script → watch-time
   score + grade, strengths, risk cards (each with a fix), first-15-seconds tip.
   Cached per script hash in `frame:retention`. **LIVE** on `frame-omega-sepia.vercel.app`.
7. Why It Went Viral ✅ — `lib/viral`, `/viral`. Paste a public YouTube link/ID →
   public stats via `lib/youtube` `getVideoById` (key-only) → AI breaks down why it
   went viral (title/thumbnail/hook/format/timing) + what's repeatable. Cached per
   video id in `frame:viral`. Sample video + sample-AI fallback so it runs key-free.

Auth (Supabase) + per-user cloud sync are live; localStorage is the instant cache.

## The 7-feature build is DONE — what's next

All seven "operating system for faceless creators" features are shipped. The next
buildable work (sample-data, no new backend) is in ROADMAP.md → "Next core screens":
- **Thumbnail Studio** — teach the principles, AI concept suggestions, a 1280×720
  editor exporting a PNG, a readability score. `// TODO` for AI image generation.
- **Asset Locker** (per video) — royalty-free music / SFX / b-roll search links.

Backend-later: real Stripe checkout (billing is mock today), connect-your-channel
live analytics, reply-to-comments (OAuth + per-reply approval).

### ⚠️ One prod follow-up for #7 (Why It Went Viral)

`getVideoById` reads `YOUTUBE_API_KEY` from the **server** env. It's in local
`.env.local` (git-ignored, restricted to YouTube Data API v3, verified live — a
`videos.list` returns 200). **The live site can't read `.env.local`**, so until the
key is added to **Vercel → Project Settings → Environment Variables** (+ redeploy),
`/viral` in prod shows a clearly-labelled **sample** video instead of the real one
(the route returns `sampleVideo:true` and the page shows a "these are sample stats"
note). The app never breaks without it — it just falls back. Add the key to flip it
to real data. Never print/echo the key — verify presence with `awk` length/prefix
only, never `Read`/`Grep` the value.

## Conventions (don't relearn — see CLAUDE.md for the rest)

- Data layer is swappable: screens → `lib/<feature>/store.ts` → `lib/storage.ts`.
  Gate UI on a `loaded` flag.
- All AI in `lib/ai.ts` (model `claude-sonnet-4-6`), key from env, sample fallback
  in `lib/ai-samples.ts` so it runs with no key. Client calls `app/api/*`, never
  imports `lib/ai.ts`.
- Theme tokens only: `bg-surface / text-ink / text-muted / bg-brand-50 /
  border-hairline` (auto dark-mode). Accents: amber, success, brand.
- `lucide-react` is v1.x — verify any icon before using:
  `node -e "console.log(typeof require('lucide-react').X)"`.
- **PowerShell commit messages: NO `"` double-quote characters** (breaks git arg
  passing) — use a single-quoted bash string or here-string.

## Verify + ship (the cheap loop)

1. `npm run build` (type-check).
2. Browser-verify with the **env-aside / preview_eval** technique: `mv .env.local
   .env.local.bak` → `preview_start` (grabs a random port) → navigate to
   `http://localhost:PORT/welcome` FIRST (escapes about:blank localStorage error) →
   seed `frame:*` keys via one `preview_eval` IIFE → navigate to the feature →
   read `document.body.innerText` + check the network panel. `preview_screenshot`
   times out here; `preview_eval` works.
3. **Restore `.env.local`** (`mv .env.local.bak .env.local`) + `preview_stop` —
   it holds the Supabase + YouTube keys.
4. ONE commit + push to `main`; confirm the Vercel deploy reaches **READY**
   (prod alias `frame-omega-sepia.vercel.app`).
5. Update `docs/ROADMAP.md` (#7 → done) and your memory.

## Copy-paste kickoff prompt

> Build "Why It Went Viral" (product feature #7, the last one) for Frame. First
> read CLAUDE.md, docs/ROADMAP.md, docs/HANDOFF.md, and your memory (MEMORY.md →
> frame-build-plan.md). The project is at C:\Users\Ashton\Projects\frame.
>
> Build the public-video version first (the YOUTUBE_API_KEY in .env.local is
> enough — no OAuth): paste a YouTube URL/ID → fetch the video's public stats via
> lib/youtube.ts → AI explains why it likely went viral (title, thumbnail, hook,
> format, timing) + what's repeatable, cached per video id. Mirror the
> lib/retention (#6) shape exactly: types→store(cache+hash)→useHook(analyze on
> demand, reuse cache)→lib/ai fn + sample fallback→/api route→page with a
> Live/Sample AI badge and empty/loading/error/not-onboarded states. Add a Today
> card + a Settings link under "Your channel". Add STORAGE_KEYS.viral to
> SYNCED_KEYS. Then npm run build, verify with the env-aside/preview_eval
> technique, restore .env.local + preview_stop, make ONE commit + push, and
> confirm the Vercel deploy reaches READY. Reminder: YOUTUBE_API_KEY must be added
> to Vercel env vars before it works in prod. When done, update docs/ROADMAP.md
> and your memory.
