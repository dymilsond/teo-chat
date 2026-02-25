import { createClient } from '@supabase/supabase-js'

// Client com service role — ignora RLS, não usa cookies de sessão.
// Usar APENAS em rotas de servidor sem sessão (webhooks, jobs).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada.')
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
