# Creator Score (#4) — turn-key build plan

> Handoff written 2026-06-13 for a **fresh conversation** to build in one session.
> Read `CLAUDE.md` + `docs/ROADMAP.md` + your memory first, then this file.
> Feature #3 (Frame IQ) is done and live — Creator Score reads straight from it.

## What it is

**One momentum score (0–100)** that tells a beginner creator how they're doing,
computed from the signals Frame IQ already aggregates. It answers "am I actually
making progress?" with a single number, a tier label, a breakdown, and one
gentle next step.

**Cheap by design (AI-light):** the score itself is **pure rule-based math** — no
AI, no credits. There is an *optional* one-line AI "coach note"; when enabled it
must be **cached** so it's generated at most once per score-state (the roadmap's
value-per-credit rule). v1 ships with a rule-based note so it works with zero
setup and zero credits.

## Where the data comes from (already exists — do NOT re-derive)

`getFrameIQ()` in `lib/frame-iq/store.ts` returns everything needed:
`publishedCount, inProgressCount, projectCount, ideaCount, videoCount,
avgViews, avgRetentionPct, streak, weekActiveCount, weekActivity[],
upcomingUploads, cadenceShort/cadenceLabel`. Use `useFrameIQ()` in the hook.

## Files to add (follow the vault / frame-iq pattern exactly)

- `lib/creator-score/types.ts` — `CreatorScore` + `ScorePart` types (below).
- `lib/creator-score/store.ts` — `computeCreatorScore(iq: FrameIQ): CreatorScore`
  (pure, no AI) + the delta persistence helpers.
- `lib/creator-score/useCreatorScore.ts` — client hook: computes from `useFrameIQ`,
  re-reads on `frame:streak` + `SYNC_EVENT` (copy the Frame IQ hook), and records
  the last score so it can show a delta.
- `app/creator-score/page.tsx` — the page (score ring/gauge + tier + breakdown
  bars + coach note + CTA to the weakest area + onboarding empty state).
- **Today card** in `app/today/page.tsx` — compact "Creator Score" card (number +
  tier + delta arrow) linking to `/creator-score`, next to the Frame IQ card.
- **Discoverable from Settings** — add a link card under "Your channel" in
  `app/settings/page.tsx` (mirror the Frame IQ link card).
- `STORAGE_KEYS.creatorScore = "frame:creatorScore"` in `lib/storage.ts` (stores
  the last `{ score, at }` for the delta).

## Types

```ts
export type ScorePart = {
  key: "consistency" | "output" | "pipeline" | "insight";
  label: string;
  points: number;   // earned (rounded)
  max: number;      // possible
  hint: string;     // what lifts it, links to the relevant screen via href
  href: string;
};

export type CreatorScore = {
  score: number;        // 0–100 (rounded)
  tier: string;         // Spark | Builder | Momentum | On fire
  parts: ScorePart[];
  delta: number | null; // vs last computed score (null if first time)
  coachNote: string;    // rule-based default; AI-enhanced + cached when enabled
  computedAt: string;   // ISO
};
```

## Scoring rubric (concrete — just implement it; max = 100)

**Consistency — 35 pts** (showing up)
- streak: `min(streak,14)/14 * 20`
- this week: `weekActiveCount/7 * 15`

**Output — 30 pts** (shipping)
- published: `min(publishedCount,8)/8 * 22`
- has an active project: `inProgressCount > 0 ? 8 : 0`

**Pipeline — 20 pts** (set up to keep going)
- ideas saved: `min(ideaCount,5)/5 * 8`
- cadence set (`cadenceShort === "weekly"` i.e. enabled): `6 : 0`
- something scheduled: `upcomingUploads > 0 ? 6 : 0`

**Insight — 15 pts** (learning from results)
- videos with logged stats: `min(videoCount,4)/4 * 8`
- avg retention: `videoCount > 0 ? avgRetentionPct/100 * 7 : 0`

`score = round(sum of all)`, clamp 0–100. Each `ScorePart.points = round(component sum)`.

**Tiers:** 0–24 `Spark` · 25–49 `Builder` · 50–74 `Momentum` · 75–100 `On fire`.

**Rule-based coach note:** pick the `ScorePart` with the lowest `points/max`
ratio and return an encouraging sentence pointing to its action (mirror the tone
of the Frame IQ tips). Example map:
- consistency → "Your score climbs fastest when you show up — one Path step today."
- output → "Finishing a video moves this the most. Pick the one closest to done."
- pipeline → "Line up your next moves: save a few ideas and set a weekly posting day."
- insight → "Log your videos' stats so Frame can learn what's working for you."

**Delta:** read `frame:creatorScore` (`{score, at}`); `delta = score - last.score`
(null if none). After computing, save the new `{score, at: nowISO}`.

## Optional AI coach note (do AFTER the rule-based v1 works — keep it cheap)

- Add `getCreatorScoreNote(parts, tier)` to `lib/ai.ts` (model `claude-sonnet-4-6`),
  with a niche-aware **sample fallback** in `lib/ai-samples.ts` for the no-key case.
- Client calls a new route `app/api/creator-score/route.ts` (never import `lib/ai.ts`
  in client). Show the "Sample AI" / "Live AI" badge via `/api/ai-status`.
- **CACHE (mandatory):** build a stable `inputHash` from the rounded inputs, e.g.
  `` `${score}-${tier}-${parts.map(p=>p.points).join("-")}` ``. Store
  `{ hash, note }` in Supabase `app_state` under key
  `creator-score:note` (and/or localStorage when Supabase isn't configured).
  Before calling AI, if the stored `hash` matches → reuse the note, **no AI call**.
  Only generate (and overwrite) when the hash changed. This guarantees we never
  regenerate for the same state.

## Conventions to honour (from CLAUDE.md / ARCHITECTURE.md)

- Screens never touch localStorage — go through the store; the DB swap stays small.
- Theme-aware tokens only (`bg-surface`, `text-ink`, `text-muted`, `bg-brand-50`,
  `border-hairline`). Score ring/gauge: brand blue; amber reserved for streak.
- `lucide-react` is **v1.x** — no brand icons. Safe icons seen in repo: `Gauge`,
  `TrendingUp`, `Sparkles`, `Flame`, `Award`/`Trophy` exist — verify with
  `node -e "console.log(typeof require('lucide-react').Gauge)"` before using.
- Gate UI on `loaded` to avoid hydration mismatches; handle the not-onboarded
  state (empty card prompting `/onboarding`), like the Frame IQ page does.
- `npm run build` to type-check, then verify, then **one commit** ending with the
  `Co-Authored-By` trailer. PowerShell commit: single-quoted here-string with
  **no `"` characters** (see CLAUDE.md gotcha #3).

## Verifying without a working preview (this env's quirk)

`preview_screenshot` reliably times out here; `preview_eval` works. To check
visuals: `mv .env.local .env.local.bak` (open mode), `preview_start`, seed
realistic data with one `preview_eval` IIFE of `localStorage.setItem` for the
`frame:*` keys, `location.assign(origin + "/creator-score")`, then read
`document.body.innerText` + `getComputedStyle`. **Always restore `.env.local`
and `preview_stop` when done** — it holds the Supabase keys.

## Definition of done

Rule-based score + tier + breakdown + delta render on `/creator-score` and a
Today card; not-onboarded state handled; zero AI credits used in v1; build
passes; verified with seeded data; one commit pushed (auto-deploys; confirm the
Vercel deployment reaches `READY`). The optional AI note, if added, is cached and
never regenerates for an unchanged score.
```
