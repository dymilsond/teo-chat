import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPreapprovalStatus } from '@/lib/mercadopago'

// Reconciliação silenciosa — corrige plano se webhook foi perdido/atrasado.
// Chamado pelo frontend após carregar o profile.
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('mp_preapproval_id, mp_subscription_status, plan')
      .eq('id', user.id)
      .single()

    // Sem preapproval ou já cancelado → nada a fazer
    if (
      !profile?.mp_preapproval_id ||
      profile.mp_subscription_status === 'none' ||
      profile.mp_subscription_status === 'cancelled'
    ) {
      return Response.json({ synced: false })
    }

    // Consulta estado REAL na API MP — nunca deriva do banco local
    const remote = await getPreapprovalStatus(profile.mp_preapproval_id)
    if (!remote) {
      return Response.json({ synced: false })
    }

    const admin = createAdminClient()

    if (remote.status === 'authorized') {
      await admin
        .from('profiles')
        .update({ plan: 'pro', mp_subscription_status: 'authorized' })
        .eq('id', user.id)
      return Response.json({ synced: true, plan: 'pro' })
    }

    if (remote.status === 'paused' || remote.status === 'cancelled') {
      await admin
        .from('profiles')
        .update({ plan: 'free', mp_subscription_status: remote.status })
        .eq('id', user.id)
      return Response.json({ synced: true, plan: 'free' })
    }

    if (remote.status === 'pending') {
      await admin
        .from('profiles')
        .update({ mp_subscription_status: 'pending' })
        .eq('id', user.id)
    }

    return Response.json({ synced: false })
  } catch (err) {
    console.error('[sync] Erro:', err)
    return Response.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
