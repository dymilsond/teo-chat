import { createClient } from '@/lib/supabase/server'
import type { UserProfile } from '@/types'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    return Response.json(profile as UserProfile)
  }

  // Perfil não existe — cria automaticamente.
  // Isso ocorre quando o trigger on_auth_user_created falhou ou
  // o usuário é pré-existente e não tem linha em profiles.
  const { data: created, error: upsertError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email ?? '',
        full_name: user.user_metadata?.full_name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
        plan: 'free',
        mp_subscription_status: 'none',
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )
    .select()
    .single()

  if (upsertError || !created) {
    return Response.json({ error: 'Erro ao criar perfil.' }, { status: 500 })
  }

  return Response.json(created as UserProfile)
}
