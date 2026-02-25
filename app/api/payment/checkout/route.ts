import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const planId = process.env.MERCADO_PAGO_PLAN_ID
    if (!planId) {
      return Response.json({ error: 'Plano MP não configurado.' }, { status: 500 })
    }

    // Redireciona para a página de checkout do plano no MP.
    // O MP cria o preapproval quando o usuário conclui o pagamento
    // e nos notifica via webhook — mapeamos via payer_email.
    const initPoint = `https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=${planId}`

    return Response.json({ init_point: initPoint })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
