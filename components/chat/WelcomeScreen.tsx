'use client'

import { ModelMeta } from '@/types'

interface Props {
  model: ModelMeta
  onChipClick?: (chip: string) => void
}

export default function WelcomeScreen({ model, onChipClick }: Props) {
  return (
    <div
      className="flex flex-col items-center text-center px-6 py-10"
      style={{ animation: 'fadeInUp 0.5s ease both' }}
    >
      {/* Ícone do modelo */}
      <div
        className="flex items-center justify-center"
        style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'linear-gradient(135deg, #FEF0E8, #FDDCC8)',
          border: '2px solid #F9C9A8',
          fontSize: 28, marginBottom: 20,
        }}
      >
        {model.icon}
      </div>

      {/* Nome do modelo */}
      <h2
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 26, fontWeight: 700, color: '#1a1a1a',
          letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 4,
        }}
      >
        {model.name}
      </h2>

      {/* Sublinhado laranja */}
      <div
        style={{
          width: 40, height: 3, borderRadius: 99,
          background: 'linear-gradient(90deg, #E8580C, #F97316)',
          margin: '8px auto 16px',
        }}
      />

      {/* Descrição */}
      <p style={{ fontSize: 14, color: '#6B6E7A', maxWidth: 420, lineHeight: 1.7, marginBottom: 20 }}>
        {model.welcome}
      </p>

      {/* Chips de temas */}
      {model.blocks && model.blocks.length > 0 && (
        <div
          className="flex flex-wrap justify-center gap-2"
          style={{ maxWidth: 480, marginBottom: 24 }}
        >
          {model.blocks.map((block) => (
            <button
              key={block}
              onClick={() => onChipClick?.(block)}
              style={{
                padding: '5px 13px',
                borderRadius: 99,
                background: '#fff',
                border: '1px solid #E0E3EC',
                fontSize: 12, color: '#6B6E7A',
                cursor: onChipClick ? 'pointer' : 'default',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (onChipClick) {
                  e.currentTarget.style.background = '#FEF0E8'
                  e.currentTarget.style.borderColor = '#F9C9A8'
                  e.currentTarget.style.color = '#E8580C'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.borderColor = '#E0E3EC'
                e.currentTarget.style.color = '#6B6E7A'
              }}
            >
              {block}
            </button>
          ))}
        </div>
      )}

      {/* Versículo */}
      <div
        className="text-left relative"
        style={{
          maxWidth: 400, width: '100%',
          background: '#fff',
          border: '1px solid #E0E3EC',
          borderRadius: 12,
          padding: '14px 18px 14px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
            borderRadius: '12px 0 0 12px',
            background: 'linear-gradient(180deg, #E8580C, #F97316)',
          }}
        />
        <p style={{ fontSize: 13, fontStyle: 'italic', color: '#4A4E5A', lineHeight: 1.6, marginBottom: 6 }}>
          {model.verse}
        </p>
        {model.verseRef && (
          <p style={{ fontSize: 11, color: '#A8ACBA', fontWeight: 600 }}>
            {model.verseRef}
          </p>
        )}
      </div>
    </div>
  )
}
