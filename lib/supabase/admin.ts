import { createClient } from "@supabase/supabase-js";

// Client admin avec service role key — JAMAIS l'exposer au client.
// À utiliser uniquement dans des server actions / API routes pour des opérations
// privilégiées (création d'utilisateur, modification de rôles, etc.)

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
