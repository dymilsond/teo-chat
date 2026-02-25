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
