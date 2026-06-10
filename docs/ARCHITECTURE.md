# Architecture

How Frame is put together. The guiding rule: **screens stay dumb; logic lives in
small, swappable modules** so we can drop in a real backend later without
rewriting the UI.

## Data layer (localStorage today, a database tomorrow)

```
lib/storage.ts          readJSON / writeJSON (SSR-safe) + STORAGE_KEYS
lib/<feature>/store.ts  repository functions (get/save) — the ONLY localStorage caller
lib/<feature>/use*.ts   React hook: loads on mount, auto-saves on change
app/.../page.tsx        screens call the hook; never touch storage directly
```

Each hook follows the same shape:

```ts
const [loaded, setLoaded] = useState(false);
const [data, setData] = useState(initial);
useEffect(() => { setData(getX()); setLoaded(true); }, []);          // load once
useEffect(() => { if (loaded) saveX(data); }, [data, loaded]);       // auto-save
```

Gate anything that depends on `Date.now()` or stored data on `loaded` to avoid
hydration mismatches (render a skeleton until then).

**To migrate to a real DB later:** change `lib/storage.ts` and the per-feature
`store.ts` files to call your API. No screen changes.

Features using this pattern: `calendar`, `profile`, `analytics`, `path`,
`builder`, `ideas`, `milestones` (+ `streak`).

## AI module

```
lib/ai.ts          the ONLY place Anthropic is called (model claude-sonnet-4-6)
lib/ai-samples.ts  niche-aware sample answers used when there is no API key
app/api/*/route.ts thin server handlers that call lib/ai.ts (key stays server-side)
```

- Reads `ANTHROPIC_API_KEY` from the environment. **No key → sample answers**, so
  the app always runs. `aiIsLive()` powers the "Sample AI / Live AI" badges
  (exposed via `GET /api/ai-status`).
- **Client never imports `lib/ai.ts`.** Screens `fetch('/api/...')`; the key
  never reaches the browser.
- Functions: `getBrandKit`, `getChannelsToStudy`, `getPerformanceCoaching`,
  `getProductionPlan`, `getTitleRating`. Each has a sample fallback and tolerant
  JSON parsing; any failure falls back to the sample.
- Real third-party services are stubbed: `lib/youtube.ts` (channel data) reads
  keys from env and has `// TODO` markers for the backend phase.

## Theming / dark mode

`app/globals.css` defines structural colours as RGB-triplet CSS variables under
`:root` (light) and `.dark` (dark). `tailwind.config.ts` maps the tokens to
`rgb(var(--c-*) / <alpha-value>)`:

| Token | Source | Flips in dark? |
|---|---|---|
| paper, surface, ink, muted, hairline, brand-50, brand-100 | CSS variables | **yes** |
| brand-200…900, indigo, coral, amber, success | fixed hex | no (accents) |

So **style with the tokens** (`bg-paper`, `bg-surface`, `text-ink`,
`text-muted`, `border-hairline`, `bg-brand-50`) and new UI is dark-mode-ready for
free. `lib/useTheme.ts` + `components/ThemeToggle.tsx` toggle it; a tiny no-flash
script in `app/layout.tsx` applies the saved/system theme before first paint.

## Cross-cutting events

Two `window` CustomEvents let widgets update live without a state library:

- `frame:streak` — `lib/streak.ts` fires it on `markActiveToday()`;
  `lib/useStreak.ts` re-reads the streak (top bar, sidebar, Today).
- `frame:celebrate` — `lib/celebrate.ts` `celebrate(msg)` fires it;
  `components/Celebration.tsx` (in `AppShell`) shows confetti + a toast.

## App shell & design

`components/AppShell.tsx` wraps every screen: `Sidebar` (desktop), `BottomNav`
(phone), `TopBar`, and the global `Celebration`. Reusable primitives live in
`components/ui/`. Blue-forward design with a full `brand` scale; Bricolage
Grotesque for headings (`font-display`), Inter for body; coral is reserved for
the logo's play button.
