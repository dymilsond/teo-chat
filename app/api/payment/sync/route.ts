import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPreapprovalStatus, searchLatestAuthorizedPreapproval } from '@/lib/mercadopago'

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
      .select('mp_preapproval_id, mp_subscription_status, plan, email')
      .eq('id', user.id)
      .single()

    const admin = createAdminClient()

    // Caminho principal: temos o preapproval_id salvo → consulta direta
    if (
      profile?.mp_preapproval_id &&
      profile.mp_subscription_status !== 'none' &&
      profile.mp_subscription_status !== 'cancelled'
    ) {
      const remote = await getPreapprovalStatus(profile.mp_preapproval_id)
      if (!remote) return Response.json({ synced: false })

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
    }

    // Caminho fallback: sem preapproval_id (webhook perdido antes do deploy)
    // Busca por email na API MP para recuperar assinaturas ativas.
    if (profile?.email && profile.plan !== 'pro') {
      const found = await searchLatestAuthorizedPreapproval(profile.email)
      if (found) {
        await admin
          .from('profiles')
          .update({
            plan: 'pro',
            mp_subscription_status: 'authorized',
            mp_preapproval_id: found.id,
          })
          .eq('id', user.id)
        return Response.json({ synced: true, plan: 'pro' })
      }
    }

    return Response.json({ synced: false })
  } catch (err) {
    console.error('[sync] Erro:', err)
    return Response.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
