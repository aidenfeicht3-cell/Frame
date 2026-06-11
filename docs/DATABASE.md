# Setting up the database & domain

This is your part — two sign-ups and a copy-paste. Everything in the code is
already wired to slot into place once you've done these. Take it slow; there's
no rush and nothing here can break the app (Frame keeps working in "local mode"
until the database is connected).

---

## Part A — Buy the domain (~2 minutes, ~$10)

We picked **`framecreator.app`** ($9.99/year).

1. Open: <https://vercel.com/domains/search?q=framecreator.app>
2. Sign in (or create a free Vercel account).
3. Buy `framecreator.app`. That's it — we'll point it at the live site when we
   deploy.

> Why `.app`? Every `frame*.com` was taken, and `.app` is purpose-built for web
> apps — it even forces secure HTTPS automatically.

---

## Part B — Create the database (Supabase) (~5 minutes, free)

Supabase gives us a database **and** a login system in one free project.

1. Go to <https://supabase.com> and sign in with GitHub.
2. **New project** → give it a name (e.g. `frame`), set a database password
   (save it somewhere), pick the region closest to you, and create it. It takes
   a minute to spin up.
3. When it's ready, open the **SQL Editor** (left sidebar) → **New query**.
4. Open the file [`supabase/schema.sql`](../supabase/schema.sql) in this repo,
   copy the **whole thing**, paste it in, and click **Run**. You should see
   "Success" — this creates the table that stores each user's data, locked down
   so people can only ever see their own.
5. Go to **Project Settings → API**. You'll see two things we need:
   - **Project URL** (looks like `https://abcd1234.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

---

## Part C — Plug the keys in (~1 minute)

1. In the project folder, copy `.env.local.example` to a new file named
   **`.env.local`**.
2. Paste your two values from Part B:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. (Optional) add your `ANTHROPIC_API_KEY` here too, to turn on live AI.
4. Save the file. **`.env.local` is git-ignored**, so these never get committed.

---

## What happens next (my part)

Once you've done Parts B & C and tell me, I'll:

1. Add **login/sign-up** (email + Google) using Supabase Auth.
2. Switch the data layer from browser-storage to the database — one feature at a
   time, verifying each — so your profile, calendar, Path progress, videos, etc.
   follow you across devices instead of living in one browser.
3. Deploy to **Vercel** and connect `framecreator.app`.
4. Later: real **Stripe** checkout for the Pro subscription.

You don't need to understand the code for any of this — just Parts A–C above.
