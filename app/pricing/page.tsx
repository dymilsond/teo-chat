'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function PricingContent() {
  const searchParams = useSearchParams()
  const paymentParam = searchParams.get('payment')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubscribe() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payment/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        setError(data.error ?? 'Erro ao iniciar checkout.')
        setLoading(false)
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8E1 0%, #FFF3E0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1rem',
      }}
    >
      {/* Banner de processamento (retorno do MP) */}
      {paymentParam === 'pending' && (
        <div
          style={{
            background: '#E8F5E9',
            border: '1px solid #A5D6A7',
            borderRadius: 12,
            padding: '0.875rem 1.25rem',
            marginBottom: '1.5rem',
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#2E7D32',
            fontWeight: 600,
          }}
        >
          Pagamento em processamento... Seu acesso Pro será liberado em instantes após confirmação.
        </div>
      )}

      {/* Logo */}
      <Link
        href="/chat"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          marginBottom: '2.5rem',
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>✝</span>
        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#5D4037' }}>Teo Chat</span>
      </Link>

      {/* Título */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 800,
            color: '#1A1A1A',
            marginBottom: '0.5rem',
          }}
        >
          Estude a Palavra sem limites
        </h1>
        <p style={{ fontSize: '1rem', color: '#666', maxWidth: 480, lineHeight: 1.6 }}>
          Comece gratuitamente e faça upgrade quando precisar de mais.
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 760,
          width: '100%',
        }}
      >
        {/* Plano Free */}
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: '2rem',
            flex: '1 1 300px',
            maxWidth: 340,
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: '2px solid #f0f0f0',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#999',
                background: '#f5f5f5',
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              Gratuito
            </span>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1A1A1A' }}>R$ 0</span>
              <span style={{ color: '#999', fontSize: '0.9rem' }}>/mês</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.4rem' }}>
              Para começar a estudar
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { ok: true, text: '10 mensagens por mês' },
              { ok: true, text: 'Modelo ABC — Análise Bíblica Completa' },
              { ok: false, text: 'Modelos EEP, EMI, EVR, CLI' },
              { ok: false, text: 'Mensagens ilimitadas' },
              { ok: false, text: 'Suporte prioritário' },
            ].map((item) => (
              <div
                key={item.text}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '5px 0',
                  fontSize: '0.875rem',
                  color: item.ok ? '#333' : '#bbb',
                }}
              >
                <span style={{ color: item.ok ? '#4CAF50' : '#ddd', flexShrink: 0, marginTop: 1 }}>
                  {item.ok ? '✓' : '✕'}
                </span>
                {item.text}
              </div>
            ))}
          </div>

          <Link
            href="/chat"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '0.7rem',
              borderRadius: 12,
              border: '2px solid #e0e0e0',
              color: '#666',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Continuar grátis
          </Link>
        </div>

        {/* Plano Pro */}
        <div
          style={{
            background: 'linear-gradient(135deg, #5D4037, #3E2723)',
            borderRadius: 20,
            padding: '2rem',
            flex: '1 1 300px',
            maxWidth: 340,
            boxShadow: '0 16px 50px rgba(93,64,55,0.35)',
            border: '2px solid rgba(255,183,77,0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: 'linear-gradient(135deg, #FFB74D, #FF8C00)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: 99,
            }}
          >
            Recomendado
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,183,77,0.7)',
                background: 'rgba(255,183,77,0.1)',
                padding: '3px 8px',
                borderRadius: 6,
              }}
            >
              Pro
            </span>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFB74D' }}>R$ 19</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>/mês</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.4rem' }}>
              Para quem estuda de verdade
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {[
              'Mensagens ilimitadas',
              'Todos os 5 modelos de estudo',
              'ABC — Análise Bíblica Completa',
              'EEP — Estudo Expositivo Profundo',
              'EMI — Mente do Inspirado',
              'EVR — Estudo Verso Real',
              'CLI — Contexto do Livro',
              'Suporte prioritário',
              'Novidades em primeira mão',
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '4px 0',
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                <span style={{ color: '#FFB74D', flexShrink: 0, marginTop: 1 }}>✓</span>
                {item}
              </div>
            ))}
          </div>

          {error && (
            <p style={{ fontSize: '0.8rem', color: '#FFAB40', marginBottom: '0.75rem', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? 'rgba(255,140,0,0.5)' : 'linear-gradient(135deg, #FF8C00, #FF6F00)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.02em',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Aguarde...' : 'Assinar Pro'}
          </button>

          <p
            style={{
              textAlign: 'center',
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '0.5rem',
              lineHeight: 1.4,
            }}
          >
            Pagamento seguro via Mercado Pago · PIX e cartão
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 540, width: '100%', marginTop: '3rem' }}>
        <h2
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#5D4037',
            textAlign: 'center',
            marginBottom: '1.25rem',
          }}
        >
          Perguntas frequentes
        </h2>

        {[
          {
            q: 'O que conta como "mensagem"?',
            a: 'Cada vez que você envia um texto e recebe uma resposta do Teo Chat conta como 1 mensagem.',
          },
          {
            q: 'O limite reinicia todo mês?',
            a: 'Sim. A contagem de 10 mensagens reinicia no primeiro dia de cada mês.',
          },
          {
            q: 'Posso cancelar quando quiser?',
            a: 'Sim. Você pode cancelar sua assinatura a qualquer momento diretamente pelo Mercado Pago, sem multas.',
          },
          {
            q: 'O pagamento é seguro?',
            a: 'Sim. Todo o processamento é feito pelo Mercado Pago. Não armazenamos dados do seu cartão.',
          },
        ].map((item) => (
          <div
            key={item.q}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: '1rem 1.25rem',
              marginBottom: '0.75rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
          >
            <p style={{ fontWeight: 700, color: '#333', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
              {item.q}
            </p>
            <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.a}</p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '2.5rem', fontSize: '0.8rem', color: '#bbb', textAlign: 'center' }}>
        Lar Church — Lugar de Amor e Recomeço
      </p>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#FFF8E1' }} />}>
      <PricingContent />
    </Suspense>
  )
}
