# Handoff — start a fresh chat cheaply

This file exists so a new session can pick up Frame **without re-exploring the
codebase** (which burns usage). Read the four files in "Start here", then go.

## Start here (in this order)

1. `CLAUDE.md` — what Frame is, stack, conventions, gotchas.
2. `docs/ROADMAP.md` — the live feature list (what's done / what's next).
3. `docs/HANDOFF.md` — this file (current state + the next task).
4. Your memory: `MEMORY.md` → `frame-build-plan.md` (the detailed running log).

Project lives at `C:\Users\Ashton\Projects\frame` (NOT the OneDrive copy).

## LATEST — pick up here (2026-06-16)

Two backend tasks just landed **in code** (`npm run build` green; **NOT committed
yet** — commit only when Ashton asks):

1. **Data-layer migration COMPLETE.** Every remaining store now syncs to Supabase
   (calendar scheduledPosts+cadence, path, builder videoProjects+editingSetup,
   ideas, milestones, projects projectStages, vault vaultFavorites, analytics
   videoStats) via `SYNCED_KEYS` + a `frame:synced` re-read listener per hook.
   `billing` is excluded on purpose (Stripe owns the plan).

2. **Connect your channel → live analytics (read-only YouTube owner OAuth) —
   code built, gated, runs key-free.** New files: `lib/youtube/owner.ts`,
   `lib/youtube/tokens.ts`, `lib/supabase/admin.ts`,
   `app/api/youtube/{connect,callback,status,daily-views,disconnect}/route.ts`,
   `components/analytics/ConnectChannelCard.tsx` (replaced the Progress "Soon"
   placeholder), `supabase/youtube_tokens.sql`. Verified key-free in the browser:
   status route returns `{configured:false}`, the card shows "Soon", nothing breaks.

### GO-LIVE checklist for connect-your-channel
- [ ] **Supabase table:** run `supabase/youtube_tokens.sql` in the SQL editor →
      creates `youtube_tokens` (RLS on, NO policy = server-only). Confirm it exists.
- [ ] **`.env.local`:** already has `GOOGLE_CLIENT_ID`. Ashton fills the two blanks
      (SECRETS — never echo): `GOOGLE_CLIENT_SECRET` (Google Cloud → Clients →
      Frame web → Client secret, `GOCSPX-…`) and `SUPABASE_SERVICE_ROLE_KEY`
      (Supabase → Project Settings → API → `service_role`).
- [ ] **Vercel:** add `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` +
      `SUPABASE_SERVICE_ROLE_KEY` (Production) → redeploy.
- [ ] **Verify (local, keys present):** restart `npm run dev`, sign in, open
      `/progress` → the card now shows a **Connect** button (`configured:true`).
      Click it → Google consent as a TEST USER (aidenfeicht39@ or
      clearcentsyt@gmail.com) → callback stores the refresh token → card flips to
      "Connected · <channel>" + renders the live daily-views chart (Analytics can
      lag a day or two). Test Disconnect.
- [ ] **Verify (prod)** on frame-omega-sepia.vercel.app, then ONE commit
      (data-sync + channel feature) + push, confirm Vercel READY, update ROADMAP +
      memory.

### Google Cloud is ALREADY set up — project `CreatorForge` (creatorforge-497404)
OAuth client "Frame web" (Web app); consent screen (app "Frame", External,
Testing); test users aidenfeicht39@ + clearcentsyt@gmail.com; redirect URIs
`http://localhost:3000/api/youtube/callback` + the vercel one; YouTube Data API v3
+ YouTube Analytics API both enabled. Console signed in as aidenfeicht39@gmail.com.

### After this: the LAST backend task = #4 reply-to-comments
Needs the YouTube **write** scope (`youtube.force-ssl`) on top of this OAuth, and
EVERY reply needs explicit per-reply approval before posting. See BACKEND_PROMPTS #4.

### Gotchas hit this session (save the next agent the pain)
- The **Supabase dashboard never goes browser-"idle"**, so the Chrome MCP's
  screenshot / read_page / eval (which all wait for `document_idle`) **time out**
  on it — you cannot drive the SQL editor by sight. Have Ashton click **Run**, or
  use the Supabase Management API with a token.
- **Stripe dashboard is BLOCKED in the Chrome MCP** (financial-site safety) — guide
  only, can't drive. (Ashton set Stripe up himself.)
- **Entering secrets/keys into files or fields is a hard no for the agent** — Ashton
  pastes those two values; the agent does everything else.

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

## Copy-paste kickoff prompt (finish connect-your-channel)

> Finish "Connect your channel → live analytics" for Frame. First read CLAUDE.md,
> docs/ROADMAP.md, docs/HANDOFF.md (esp. the "LATEST — pick up here" section), and
> memory (MEMORY.md → frame-build-plan.md). Project: C:\Users\Ashton\Projects\frame.
>
> The feature is ALREADY CODE-BUILT and gated (lib/youtube/owner.ts + tokens.ts,
> lib/supabase/admin.ts, app/api/youtube/{connect,callback,status,daily-views,
> disconnect}, components/analytics/ConnectChannelCard.tsx, supabase/
> youtube_tokens.sql). Ashton has run youtube_tokens.sql in Supabase and put
> GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / SUPABASE_SERVICE_ROLE_KEY in .env.local
> (and Vercel). DO NOT rebuild it — VERIFY it works end-to-end and ship it.
>
> Steps: (1) npm run build. (2) Start dev (npm run dev), sign in, open /progress —
> confirm the card shows a Connect button (i.e. /api/youtube/status returns
> configured:true). (3) Drive the Google consent in the connected browser as a
> test user (aidenfeicht39@ or clearcentsyt@gmail.com) → confirm the callback
> stores a youtube_tokens row and the card flips to "Connected · <channel>" and
> renders the live daily-views chart; test Disconnect. (4) Confirm the 3 vars are
> in Vercel, redeploy, re-verify on frame-omega-sepia.vercel.app. (5) Make ONE
> commit covering the (currently uncommitted) data-sync migration + channel
> feature, push, confirm Vercel READY, update docs/ROADMAP.md + memory.
>
> Standing rules: everything stays gated (must run key-free), theme tokens only,
> lucide-react is v1.x (verify any new icon), PowerShell commit messages contain NO
> double-quote chars, NEVER echo a secret (verify presence with awk length/prefix
> only). GOTCHA: the Supabase dashboard never goes idle so the Chrome MCP
> screenshot/read/eval time out on it — have Ashton click Run rather than driving
> the SQL editor by sight. NEXT after this = BACKEND_PROMPTS #4 (reply-to-comments:
> write scope + mandatory per-reply approval).
