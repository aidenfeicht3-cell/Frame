/**
 * Shared Supabase configuration. The URL and anon key are read from env vars.
 * They are NEXT_PUBLIC_* on purpose — the anon key is meant to be public; real
 * security comes from Row Level Security in the database (see supabase/schema.sql).
 *
 * Frame works with NO Supabase configured: data simply stays in the browser
 * (localStorage) until these are set. `isSupabaseConfigured()` lets the data
 * layer choose between the two without crashing.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
