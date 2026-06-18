-- ============================================================================
-- Frame — YouTube owner-OAuth token store
-- ----------------------------------------------------------------------------
-- HOW TO RUN: open your Supabase project → SQL Editor → "New query", paste this
-- whole file, and click "Run". It is safe to run more than once.
--
-- This table holds each user's YouTube *refresh token* — a long-lived secret
-- that lets Frame's SERVER read that user's channel analytics on their behalf.
--
-- ⚠️ Unlike app_state, this table must NEVER be readable by the browser. We
-- enable Row Level Security and add NO policy, which means the public anon key
-- (used in the browser) can do nothing here. Only the server, using the
-- service-role key (SUPABASE_SERVICE_ROLE_KEY), bypasses RLS to read/write it.
-- ============================================================================

create table if not exists public.youtube_tokens (
  user_id       uuid        not null references auth.users (id) on delete cascade,
  refresh_token text        not null,
  channel_id    text,
  channel_title text,
  updated_at    timestamptz not null default now(),
  primary key (user_id)
);

-- Lock it down: RLS on, and deliberately NO policy → the anon/authenticated
-- (browser) keys get zero access. The service-role key skips RLS entirely.
alter table public.youtube_tokens enable row level security;
