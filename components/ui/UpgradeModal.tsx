'use client'

import { useRouter } from 'next/navigation'

interface Props {
  reason: 'pro_model' | 'rate_limit'
  onClose: () => void
}

export default function UpgradeModal({ reason, onClose }: Props) {
  const router = useRouter()

  const isRateLimit = reason === 'rate_limit'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: '2rem',
          maxWidth: 400,
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ícone */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #FFB74D, #FF8C00)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            margin: '0 auto 1.25rem',
          }}
        >
          {isRateLimit ? '⏱️' : '🔓'}
        </div>

        {/* Título */}
        <h2
          style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#1A1A1A',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}
        >
          {isRateLimit ? 'Limite mensal atingido' : 'Modelo exclusivo Pro'}
        </h2>

        {/* Descrição */}
        <p
          style={{
            fontSize: '0.875rem',
            color: '#666',
            textAlign: 'center',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}
        >
          {isRateLimit
            ? 'Você usou todas as 10 mensagens gratuitas deste mês. Faça upgrade para o plano Pro e estude sem limites.'
            : 'Este modelo de estudo é exclusivo para assinantes Pro. Desbloqueie acesso completo com o plano Pro.'}
        </p>

        {/* Benefícios */}
        <div
          style={{
            background: '#FFF8E1',
            borderRadius: 12,
            padding: '0.875rem 1rem',
            marginBottom: '1.25rem',
          }}
        >
          {['Mensagens ilimitadas', 'Todos os 5 modelos de estudo', 'Suporte prioritário', 'Acesso a novidades em primeira mão'].map(
            (item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem',
                  color: '#5D4037',
                  fontWeight: 600,
                  padding: '3px 0',
                }}
              >
                <span style={{ color: '#FF8C00' }}>✓</span>
                {item}
              </div>
            )
          )}
        </div>

        {/* Botões */}
        <button
          onClick={() => {
            onClose()
            router.push('/pricing')
          }}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #FF8C00, #FF6F00)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '0.5rem',
            letterSpacing: '0.02em',
          }}
        >
          Ver plano Pro →
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.6rem',
            background: 'transparent',
            color: '#999',
            border: 'none',
            borderRadius: 12,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Agora não
        </button>
      </div>
    </div>
  )
}
