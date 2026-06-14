# Backend build-prompts

Ready-to-paste kickoff prompts for the remaining **backend** work. Each one is
self-contained: paste it into a fresh Claude Code chat and it has enough to start
without re-exploring. They all assume the standing conventions below.

> **Before any of these**, the agent should read `CLAUDE.md`, `docs/ROADMAP.md`,
> `docs/HANDOFF.md`, and memory (`MEMORY.md → frame-build-plan.md`). Project lives
> at `C:\Users\Ashton\Projects\frame` (NOT the OneDrive copy).

**Standing rules for every backend task (so we never regress):**
- The app must keep working with **no keys** — every integration is gated
  (`isSupabaseConfigured()`, `youtubeIsConnected()`, `aiIsLive()`) and falls back
  to localStorage / sample data when its key is missing. Never make a feature
  hard-crash because a key is absent.
- Data layer stays swappable: screens → `lib/<feature>/store.ts` → `lib/storage.ts`.
  localStorage is the instant cache; Supabase `app_state` is the cross-device truth
  (`lib/sync/state.ts`, opt-in per key via `SYNCED_KEYS`).
- Secrets are server-only (env vars). Client code calls `app/api/*` route handlers;
  it never imports `lib/ai.ts` or touches a key. Never print/echo a key — verify
  presence with `awk` length/prefix only, never `Read`/`Grep` the `.env.local` value.
- Theme tokens only (`bg-surface`, `text-ink`, `text-muted`, `bg-brand-50`,
  `border-hairline`) so dark mode keeps working. `lucide-react` is v1.x — verify any
  icon before use.
- PowerShell commit messages must contain **no `"` double-quote characters**.
- Ship loop: `npm run build` → browser-verify (env-aside / `preview_eval`) → ONE
  commit + push → confirm the Vercel deploy reaches READY (`frame-omega-sepia.vercel.app`)
  → update `docs/ROADMAP.md` and memory.

---

## 1. Real Stripe checkout (Free → Frame Pro, 3-day trial)

> Wire real subscription billing for Frame Pro ($15/mo, 3-day free trial), replacing
> the mock in `lib/billing/*` (`frame:billing`, free ↔ pro-trial, `trialDaysLeft`/
> `inTrial`). Keep the Settings billing UI exactly as-is — only swap what's behind it.
>
> - Add Stripe (`@stripe/stripe-js` client + `stripe` server). Keys from env:
>   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PRICE_ID`
>   (placeholders already in `.env.local.example`). Gate everything behind a
>   `stripeIsConfigured()` helper so with no keys the app keeps the mock billing
>   flow and never breaks.
> - `app/api/checkout/route.ts` → create a Checkout Session (subscription mode,
>   3-day trial, success/cancel URLs back to `/settings`). `app/api/stripe/webhook/route.ts`
>   → verify the signature and update the user's plan in Supabase `app_state`
>   (key `frame:billing`) on `checkout.session.completed`, `customer.subscription.updated`,
>   and `.deleted`. Add a `app/api/billing/portal/route.ts` for "manage/cancel".
> - `lib/billing/store.ts` reads the plan the same way (so screens don't change);
>   the webhook becomes the source of truth when Stripe is configured.
> - Gate Pro-only features behind the plan once this is live (decide which with
>   Ashton — likely: unlimited projects + every Path phase + live AI quotas).
> - Verify with Stripe test mode (test card 4242…), confirm a trial start flips the
>   Settings card to Pro and the webhook updates the stored plan; cancel returns to
>   Free at period end. Document the Stripe dashboard setup (product, price, webhook
>   endpoint) in `docs/`.

## 2. Connect your channel → live analytics (YouTube owner OAuth)

> Let a creator connect their own YouTube channel so real daily views + subscriber
> growth feed the Progress line chart, replacing manually-logged stats. Public
> single-video stats already work key-only (`lib/youtube.ts getVideoById`); this
> adds **owner** data (retention, impressions, CTR, daily analytics) which needs
> Google OAuth as the channel owner.
>
> - Add Google OAuth (YouTube Data API + YouTube Analytics API, read-only owner
>   scopes) on top of Supabase Auth. Store the refresh token server-side per user
>   (a private Supabase table with RLS — NOT `app_state`, which the client reads).
> - `lib/youtube.ts`: add `getOwnerChannelStats()` + `getOwnerDailyViews()` that use
>   the stored token; keep returning `null`/sample when not connected so the manual
>   `lib/analytics` flow still works with no connection.
> - `app/api/youtube/connect` (start OAuth) + `app/api/youtube/callback` (exchange +
>   store token). A "Connect your channel" card in Settings → Your channel and/or on
>   Progress; when connected, the views-over-time chart (`components/analytics/ViewsLineChart`)
>   reads live daily views instead of manual entries.
> - Never auto-post or write anything in this task — read-only. Verify the chart
>   renders live data for a connected channel and gracefully shows the manual flow
>   when disconnected.

## 3. Finish the data-layer migration (remaining stores → Supabase)

> Continue the localStorage → per-user Supabase migration. Done so far (in
> `SYNCED_KEYS`, `lib/sync/state.ts`): profile, activeDates, nextVideos, retention,
> viral. **Migrate the rest, one at a time, verifying each:** calendar
> (`scheduledPosts` + `cadence`), path (`pathCompleted`), builder (`videoProjects` +
> `editingSetup`), ideas, milestones, projects (`projectStages`), vault
> (`vaultFavorites`), analytics (`videoStats`). (`billing` will be owned by the
> Stripe webhook — see prompt 1.)
>
> - The pattern is fixed and small: (1) add the feature's `STORAGE_KEYS.*` to
>   `SYNCED_KEYS`; (2) add a `frame:synced` re-read listener to that feature's
>   `use*.ts` (copy the `useProfile` / `useStreak` pattern, match on `detail.key`).
>   That's it — stores and screens don't change.
> - For lists with client-generated ids (calendar posts, ideas, projects), hydrate
>   is remote-wins / replace-wholesale (fine for one-device-at-a-time). If Ashton
>   wants true multi-device merge later, add an `updated_at`-based merge — note it,
>   don't build it now.
> - RLS is already verified (user B can't read user A's row). Verify each migrated
>   feature: data made on one account appears after sign-in on another device/browser,
>   and pure-localStorage mode (no Supabase keys) is unchanged. Do a few keys per
>   commit, not all at once.

## 4. Reply to comments in-app (YouTube write scope) — build last

> Let creators read and reply to their video comments inside Frame. Needs YouTube
> OAuth **write** scope (`youtube.force-ssl`), so do this after prompt 2's owner
> OAuth exists.
>
> - **Hard rule: every reply requires explicit, per-reply user approval before it
>   posts.** Never batch-send, never auto-reply, never queue sends without a final
>   human confirm. Draft → show the creator → they press Send → then call the API.
> - `lib/comments/*` (types, store, hook) + `app/api/comments/route.ts` (list) and
>   `app/api/comments/reply/route.ts` (post one reply, only on explicit confirm).
>   Optionally an AI "suggest a reply" draft via `lib/ai.ts` (with a sample fallback)
>   — but the draft is just a suggestion the creator edits and approves.
> - A `/comments` screen (reachable from Studio): pick a connected video → list
>   comments → draft/edit a reply → explicit Send with a confirm step → success state.
> - Verify the approval gate cannot be bypassed (no code path posts without the
>   confirm), and that with no connection the screen shows a clear "connect your
>   channel first" state.
