import { createBrowserClient } from '@supabase/ssr'

// Singleton: garante uma única instância do cliente no browser.
let _client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // Desativa o Navigator LockManager do @supabase/auth-js.
          // O lock exclusivo causa timeout (10s) quando múltiplos componentes
          // chamam getUser() simultaneamente na inicialização da página,
          // impedindo o perfil de carregar e o UserMenu de aparecer.
          lock: <R>(_name: string, _acquireTimeout: number, fn: () => Promise<R>): Promise<R> => fn(),
        },
      }
    )
  }
  return _client
}
