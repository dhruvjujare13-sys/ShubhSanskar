import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client — full access, bypasses Row Level Security.
// Server-only. NEVER import this from a Client Component or expose the key
// to the browser. Used for: student PIN login/verification and any write a
// logged-in student makes to their own assignments (students aren't Supabase
// Auth users, so they have no session the anon-key client could use).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
