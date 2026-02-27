'use client'

import { useRouter } from 'next/navigation'
import { MODEL_LIST } from '@/lib/models'

export default function WelcomePage() {
  const router = useRouter()

  function handleStart() {
    localStorage.setItem('teo_welcome_seen', '1')
    router.push('/chat')
  }

  return (
    <div style={{ overflowY: 'auto', height: '100%', background: '#F7F8FA' }}>

      {/* ── Hero ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #E8580C 0%, #F97316 60%, #FDBA74 100%)',
          padding: '56px 24px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Círculos decorativos */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />

        {/* Ícone */}
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 32,
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          ✝
        </div>

        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(26px, 5vw, 36px)',
          fontWeight: 800,
          color: '#fff',
          margin: '0 0 12px',
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
        }}>
          Bem-vindo ao Teo Chat
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.88)',
          fontSize: 16,
          lineHeight: 1.6,
          margin: '0 auto',
          maxWidth: 480,
        }}>
          Estudo bíblico profundo com inteligência artificial.
          Cinco métodos especializados para você ir mais fundo na Palavra.
        </p>

        {/* Verso bíblico */}
        <div style={{
          marginTop: 28,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 12,
          padding: '14px 20px',
          maxWidth: 460,
          margin: '28px auto 0',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
            "A exposição das tuas palavras ilumina e dá entendimento aos simples."
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, margin: '6px 0 0', fontWeight: 600 }}>
            — Salmo 119:130
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px 48px' }}>

        {/* ── O que é o Teo Chat? ── */}
        <section style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>O que é o Teo Chat?</h2>
          <p style={bodyText}>
            O Teo Chat é um assistente de estudo bíblico criado para pastores, líderes, estudantes
            e qualquer pessoa que queira ir além da leitura superficial da Bíblia. Usando
            inteligência artificial avançada, ele transforma qualquer versículo ou passagem em
            um estudo rico, estruturado e aplicável.
          </p>

          {/* 3 benefícios */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 20 }}>
            {[
              { icon: '📖', title: 'Profundidade', desc: 'Análise exegética e teológica em segundos' },
              { icon: '⚡', title: 'Velocidade', desc: 'Estudo completo em menos de 1 minuto' },
              { icon: '🎯', title: 'Praticidade', desc: 'Pronto para usar no sermão ou devocional' },
            ].map((b) => (
              <div key={b.title} style={benefitCard}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a', marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Os 5 Modelos ── */}
        <section style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Os 5 métodos de estudo</h2>
          <p style={{ ...bodyText, marginBottom: 16 }}>
            Cada método foi projetado para um tipo diferente de estudo. Escolha o que melhor
            se encaixa na sua necessidade.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MODEL_LIST.map((m) => (
              <div key={m.key} style={modelCard}>
                {/* Badge */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: m.plan === 'free'
                    ? 'linear-gradient(135deg, #E8580C, #F97316)'
                    : '#F5EDE8',
                  color: m.plan === 'free' ? '#fff' : '#C8886A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Fraunces', serif",
                  fontSize: 11, fontWeight: 700,
                  border: m.plan === 'free' ? 'none' : '1px solid #EDD8CC',
                }}>
                  {m.shortName}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{m.name}</span>
                    {m.plan === 'pro' && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        color: '#E8580C', background: '#FEF0E8', border: '1px solid #F9C9A8',
                      }}>PRO</span>
                    )}
                    {m.plan === 'free' && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        color: '#2E7D32', background: '#E8F5E9', border: '1px solid #A5D6A7',
                      }}>GRÁTIS</span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0', lineHeight: 1.5 }}>
                    {m.welcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Como usar ── */}
        <section style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Como usar?</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {[
              {
                num: '1',
                title: 'Escolha o método',
                desc: 'Na barra lateral, selecione o método de estudo que melhor atende sua necessidade.',
              },
              {
                num: '2',
                title: 'Digite o texto bíblico',
                desc: 'Escreva o versículo, a passagem ou o nome do livro que deseja estudar.',
              },
              {
                num: '3',
                title: 'Receba o estudo completo',
                desc: 'Em segundos, o Teo Chat gera um estudo rico, estruturado e pronto para uso.',
              },
            ].map((step) => (
              <div key={step.num} style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                background: '#fff', borderRadius: 12,
                padding: '16px', border: '1px solid #E0E3EC',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #E8580C, #F97316)',
                  color: '#fff', fontWeight: 800, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', marginBottom: 4 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ marginTop: 40, textAlign: 'center' }}>
          <button
            onClick={handleStart}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #E8580C, #F97316)',
              color: '#fff',
              border: 'none',
              padding: '16px 40px',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(232,88,12,0.35)',
              fontFamily: 'inherit',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(232,88,12,0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(232,88,12,0.35)'
            }}
          >
            Começar a estudar →
          </button>

          <p style={{ marginTop: 12, fontSize: 12, color: '#B0B4C2' }}>
            Sempre disponível no menu da sidebar
          </p>
        </section>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 11, color: '#ccc', marginTop: 40 }}>
          Lar Church — Lugar de Amor e Recomeço
        </p>
      </div>
    </div>
  )
}

// ── Estilos ──────────────────────────────────────────────────────────────────
const sectionTitle: React.CSSProperties = {
  fontFamily: "'Fraunces', serif",
  fontSize: 20,
  fontWeight: 700,
  color: '#1a1a1a',
  margin: '0 0 12px',
  letterSpacing: '-0.3px',
}

const bodyText: React.CSSProperties = {
  fontSize: 14,
  color: '#555',
  lineHeight: 1.7,
  margin: 0,
}

const benefitCard: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: '16px',
  border: '1px solid #E0E3EC',
  textAlign: 'center',
}

const modelCard: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  alignItems: 'flex-start',
  background: '#fff',
  borderRadius: 12,
  padding: '14px 16px',
  border: '1px solid #E0E3EC',
}
