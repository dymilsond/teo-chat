import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPreapprovalStatus } from '@/lib/mercadopago'

function verifyHmac(
  dataId: string,
  xRequestId: string | null,
  xSignature: string | null,
  secret: string
): boolean {
  if (!xSignature) return false

  const parts = xSignature.split(',')
  const ts = parts.find((p) => p.startsWith('ts='))?.split('=')[1]
  const v1 = parts.find((p) => p.startsWith('v1='))?.split('=')[1]

  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${xRequestId ?? ''};ts:${ts};`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
}

async function applyStateTransition(
  supabase: ReturnType<typeof createAdminClient>,
  profileId: string,
  statusReal: string
) {
  if (statusReal === 'authorized') {
    await supabase
      .from('profiles')
      .update({ plan: 'pro', mp_subscription_status: 'authorized' })
      .eq('id', profileId)
  } else if (statusReal === 'paused' || statusReal === 'cancelled') {
    await supabase
      .from('profiles')
      .update({ plan: 'free', mp_subscription_status: statusReal })
      .eq('id', profileId)
  } else if (statusReal === 'pending') {
    await supabase
      .from('profiles')
      .update({ mp_subscription_status: 'pending' })
      .eq('id', profileId)
  }
  // outros status → ignora
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    // Ignorar eventos sem payload ou sem data.id
    const dataId: string | undefined = body?.data?.id
    if (!dataId) return Response.json({ ok: true }, { status: 200 })

    // Ignorar eventos que não sejam subscription_preapproval
    const topic: string | undefined = body?.type ?? body?.topic
    if (topic && topic !== 'subscription_preapproval') {
      return Response.json({ ok: true }, { status: 200 })
    }

    // Validar HMAC
    const xSignature = req.headers.get('x-signature')
    const xRequestId = req.headers.get('x-request-id')
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET

    if (secret) {
      const valid = verifyHmac(dataId, xRequestId, xSignature, secret)
      if (!valid) {
        console.error('[webhook] HMAC inválido para id:', dataId)
        return Response.json({ error: 'Assinatura inválida.' }, { status: 401 })
      }
    } else if (process.env.NODE_ENV === 'production') {
      // Em produção, secret é obrigatório
      return Response.json({ error: 'Webhook secret não configurado.' }, { status: 401 })
    }

    // Consultar estado REAL na API MP (webhook é apenas gatilho)
    const remote = await getPreapprovalStatus(dataId)
    if (!remote) {
      // Falha ao consultar MP → retorna 500 para MP retentar
      return Response.json({ error: 'Falha ao consultar API MP.' }, { status: 500 })
    }

    const supabase = createAdminClient()

    // Buscar profile por preapproval_id (caso principal)
    let { data: profile } = await supabase
      .from('profiles')
      .select('id, plan, mp_subscription_status')
      .eq('mp_preapproval_id', dataId)
      .maybeSingle()

    // Fallback: buscar por email (cobre múltiplos checkouts + PIX)
    if (!profile && remote.payer_email) {
      const { data: byEmail } = await supabase
        .from('profiles')
        .select('id, plan, mp_subscription_status')
        .eq('email', remote.payer_email)
        .maybeSingle()

      if (byEmail) {
        // Atualiza o preapproval_id para o atual
        await supabase
          .from('profiles')
          .update({ mp_preapproval_id: dataId })
          .eq('id', byEmail.id)
        profile = byEmail
      }
    }

    if (!profile) {
      // Usuário não encontrado — pode ser assinatura de outro sistema
      console.warn('[webhook] Profile não encontrado para preapproval_id:', dataId)
      return Response.json({ ok: true }, { status: 200 })
    }

    await applyStateTransition(supabase, profile.id, remote.status)

    return Response.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('[webhook] Erro interno:', err)
    // 500 → MP retenta automaticamente
    return Response.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
