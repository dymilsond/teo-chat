import { createBrowserClient } from '@supabase/ssr'

// Singleton: garante uma única instância do cliente no browser.
// Múltiplas instâncias simultâneas causam timeout no Navigator LockManager
// ao tentar renovar o token de autenticação.
let _client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}
