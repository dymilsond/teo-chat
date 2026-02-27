'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'

interface UsageData {
  current: number
  limit: number
  plan: string
  allowed: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const { profile, loading: profileLoading } = useUser()
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)
  const [syncSuccess, setSyncSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/user/usage')
      .then((r) => r.json())
      .then((data) => { if (!data.error) setUsage(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!profileLoading && !profile) {
      router.push('/login')
    }
  }, [profile, profileLoading, router])

  const handleSync = async () => {
    setSyncing(true)
    setSyncMsg(null)
    setSyncSuccess(false)
    try {
      const res = await fetch('/api/payment/sync', { method: 'POST' })
      const data = await res.json()
      if (data.synced && data.plan === 'pro') {
        setSyncSuccess(true)
        setSyncMsg('Plano atualizado para Pro! Recarregando...')
        setTimeout(() => window.location.reload(), 1800)
      } else {
        setSyncMsg('Nenhuma assinatura ativa encontrada.')
      }
    } catch {
      setSyncMsg('Erro ao verificar. Tente novamente.')
    } finally {
      setSyncing(false)
    }
  }

  if (profileLoading || !profile) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>Carregando...</p>
      </div>
    )
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : profile.email[0].toUpperCase()

  const displayName = profile.full_name || profile.email.split('@')[0]
  const isPro = profile.plan === 'pro'
  const usagePct = usage ? Math.min((usage.current / usage.limit) * 100, 100) : 0

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    authorized: { label: '✓ Ativa',    color: '#2E7D32', bg: '#E8F5E9' },
    pending:    { label: '⏳ Pendente', color: '#E65100', bg: '#FFF3E0' },
    paused:     { label: '⏸ Pausada',  color: '#E65100', bg: '#FFF3E0' },
    cancelled:  { label: '✕ Cancelada', color: '#C62828', bg: '#FFEBEE' },
    none:       { label: 'Sem assinatura', color: '#999', bg: '#f5f5f5' },
  }
  const subStatus = profile.mp_subscription_status ?? 'none'
  const statusInfo = statusMap[subStatus] ?? statusMap['none']

  const showSyncCard = !isPro || subStatus === 'pending'

  return (
    <div style={{ overflowY: 'auto', height: '100%', padding: '28px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Back link */}
        <Link
          href="/chat"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#888',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: 28,
          }}
        >
          ← Voltar ao chat
        </Link>

        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3E2723', marginBottom: 24 }}>
          Minha Conta
        </h1>

        {/* ── Informações da conta ── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Avatar */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF8C00, #5D4037)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.3rem',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : initials}
            </div>

            {/* Name + badge + email */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', margin: 0 }}>
                  {displayName}
                </p>
                {/* Plan badge */}
                <span
                  style={{
                    padding: '3px 12px',
                    borderRadius: 99,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    background: isPro
                      ? 'linear-gradient(135deg, #FFB74D, #FF8C00)'
                      : '#f0f0f0',
                    color: isPro ? '#fff' : '#999',
                    flexShrink: 0,
                  }}
                >
                  {isPro ? '⭐ Pro' : 'Grátis'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.email}
              </p>
            </div>
          </div>
        </div>

        {/* ── Assinatura / Uso ── */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>
            {isPro ? 'Sua Assinatura' : 'Uso este mês'}
          </h2>

          {isPro ? (
            <>
              {/* Status */}
              <div style={rowStyle}>
                <span style={labelStyle}>Status</span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: statusInfo.color,
                    background: statusInfo.bg,
                    padding: '3px 10px',
                    borderRadius: 99,
                  }}
                >
                  {statusInfo.label}
                </span>
              </div>

              {/* Mensagens */}
              <div style={rowStyle}>
                <span style={labelStyle}>Mensagens</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2E7D32' }}>
                  ∞ Ilimitadas
                </span>
              </div>

              {/* Modelos */}
              <div style={{ ...rowStyle, marginBottom: 20 }}>
                <span style={labelStyle}>Modelos</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}>
                  Todos os 5
                </span>
              </div>

              <a
                href="https://www.mercadopago.com.br/subscriptions"
                target="_blank"
                rel="noopener noreferrer"
                style={outlineBtnStyle}
              >
                Gerenciar assinatura no Mercado Pago ↗
              </a>
            </>
          ) : (
            <>
              {/* Barra de uso */}
              {usage && (
                <>
                  <div style={rowStyle}>
                    <span style={labelStyle}>Mensagens usadas</span>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: usage.current >= usage.limit ? '#ef4444' : '#1A1A1A',
                      }}
                    >
                      {usage.current} / {usage.limit}
                    </span>
                  </div>

                  <div
                    style={{
                      height: 8,
                      background: '#f0f0f0',
                      borderRadius: 99,
                      overflow: 'hidden',
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${usagePct}%`,
                        background:
                          usagePct >= 100
                            ? '#ef4444'
                            : usagePct >= 80
                            ? '#f97316'
                            : '#FF8C00',
                        borderRadius: 99,
                        transition: 'width 0.4s',
                      }}
                    />
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: 20 }}>
                    O limite reinicia no primeiro dia de cada mês.
                  </p>
                </>
              )}

              {/* CTA upgrade */}
              <Link
                href="/pricing"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.75rem',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #FF8C00, #FF6F00)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 14px rgba(255,140,0,0.35)',
                }}
              >
                ⭐ Fazer upgrade para Pro — R$19/mês
              </Link>
            </>
          )}
        </div>

        {/* ── Sincronizar plano ── */}
        {showSyncCard && (
          <div style={cardStyle}>
            <h2 style={sectionTitle}>Já assinou?</h2>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 14, lineHeight: 1.5 }}>
              Se você realizou o pagamento mas o plano ainda não foi atualizado, clique abaixo
              para sincronizar sua assinatura.
            </p>

            {syncMsg && (
              <p
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: syncSuccess ? '#2E7D32' : '#C62828',
                  marginBottom: 12,
                  padding: '8px 12px',
                  background: syncSuccess ? '#E8F5E9' : '#FFEBEE',
                  borderRadius: 8,
                }}
              >
                {syncMsg}
              </p>
            )}

            <button
              onClick={handleSync}
              disabled={syncing}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: 12,
                border: '2px solid #e0e0e0',
                background: '#fff',
                color: syncing ? '#ccc' : '#5D4037',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: syncing ? 'not-allowed' : 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              {syncing ? '🔄 Verificando...' : '🔄 Verificar assinatura'}
            </button>
          </div>
        )}

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#ccc',
            marginTop: 32,
            marginBottom: 16,
          }}
        >
          Lar Church — Lugar de Amor e Recomeço
        </p>
      </div>
    </div>
  )
}

// ── Estilos reutilizáveis ────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: '1.5rem',
  marginBottom: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#3E2723',
  marginBottom: 16,
  margin: '0 0 16px',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#666',
}

const outlineBtnStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  padding: '0.65rem',
  borderRadius: 12,
  border: '2px solid #e0e0e0',
  color: '#5D4037',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
}
