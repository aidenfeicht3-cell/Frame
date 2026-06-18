/**
 * SERVER-ONLY Supabase client using the service-role key.
 *
 * ⚠️ This client BYPASSES Row Level Security — it can read/write any row. NEVER
 * import this from client components or hooks. It exists so the server can
 * read/write the locked `youtube_tokens` table (which the browser must never
 * touch). It is gated: with no service-role key configured, callers fall back
 * to the no-connection path and Frame keeps working.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True once the server has a Supabase URL + service-role key. */
export function adminConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  if (!adminConfigured()) {
    throw new Error(
      "Supabase service role not configured. Set SUPABASE_SERVICE_ROLE_KEY in " +
        ".env.local (Supabase → Project Settings → API → service_role key).",
    );
  }
  return createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
