import { MercadoPagoConfig, PreApproval } from 'mercadopago'

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN!

export const mpClient = new MercadoPagoConfig({ accessToken })
export const mpPreApproval = new PreApproval(mpClient)

// Consulta estado real de uma assinatura diretamente na API MP.
// Webhook é apenas gatilho — essa função é a fonte de verdade.
export async function getPreapprovalStatus(preapprovalId: string): Promise<{
  status: string
  payer_email: string | null
} | null> {
  try {
    const res = await fetch(
      `https://api.mercadopago.com/preapproval/${preapprovalId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    return {
      status: data.status ?? 'unknown',
      payer_email: data.payer_email ?? null,
    }
  } catch {
    return null
  }
}

// Busca o preapproval autorizado mais recente do usuário pelo email.
// Usado como fallback quando mp_preapproval_id não foi salvo no perfil
// (ex: webhook perdido por deploy atrasado).
export async function searchLatestAuthorizedPreapproval(payerEmail: string): Promise<{
  id: string
  status: string
} | null> {
  try {
    const planId = process.env.MERCADO_PAGO_PLAN_ID
    if (!planId) return null

    const url = new URL('https://api.mercadopago.com/preapproval/search')
    url.searchParams.set('preapproval_plan_id', planId)
    url.searchParams.set('payer_email', payerEmail)
    url.searchParams.set('status', 'authorized')

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    if (!res.ok) return null

    const data = await res.json()
    const results: Array<{ id: string; status: string; date_created: string }> =
      data.results ?? []

    if (results.length === 0) return null

    // Mais recente primeiro
    results.sort(
      (a, b) =>
        new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
    )

    return { id: results[0].id, status: results[0].status }
  } catch {
    return null
  }
}
