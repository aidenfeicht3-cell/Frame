-- ============================================================================
-- Frame — database schema
-- ----------------------------------------------------------------------------
-- HOW TO RUN: open your Supabase project → SQL Editor → "New query", paste this
-- whole file, and click "Run". It is safe to run more than once.
-- ============================================================================

-- One row per user per "box" of data.
--
-- Frame already stores everything as labelled JSON blobs — the localStorage
-- keys like "frame:profile", "frame:scheduledPosts", "frame:videoStats". The
-- database mirrors that exactly: a (user, key) -> JSON value table. This keeps
-- the move from browser-storage to database tiny. Later, any feature that needs
-- real querying can graduate to its own dedicated table without touching this.
create table if not exists public.app_state (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  key        text        not null,
  value      jsonb       not null default 'null'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- ----------------------------------------------------------------------------
-- Row Level Security: each user can read and write ONLY their own rows.
-- This is what makes the public anon key safe to ship in the browser.
-- ----------------------------------------------------------------------------
alter table public.app_state enable row level security;

drop policy if exists "app_state_own_rows" on public.app_state;
create policy "app_state_own_rows"
  on public.app_state
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Keep updated_at fresh on every change.
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_state_touch on public.app_state;
create trigger app_state_touch
  before update on public.app_state
  for each row
  execute function public.touch_updated_at();
