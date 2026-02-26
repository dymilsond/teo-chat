'use client'

import { ModelMeta } from '@/types'

interface Props {
  model: ModelMeta
  onMenuOpen?: () => void
}

export default function ChatHeader({ model, onMenuOpen }: Props) {
  function handleMenuClick() {
    window.dispatchEvent(new CustomEvent('sidebar-open'))
    onMenuOpen?.()
  }

  return (
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        height: 60,
        padding: '0 20px',
        background: '#fff',
        borderBottom: '1px solid #E0E3EC',
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger — só mobile */}
        <button
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: '#F5F6FA', border: '1px solid #E0E3EC',
            color: '#6B6E7A', cursor: 'pointer', flexShrink: 0,
          }}
          onClick={handleMenuClick}
          aria-label="Menu"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Badge do modelo */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, #E8580C, #F97316)',
            color: '#fff',
            fontFamily: "'Fraunces', serif",
            fontSize: 10, fontWeight: 700, letterSpacing: '-0.3px',
            boxShadow: '0 2px 8px rgba(232,88,12,0.3)',
          }}
        >
          {model.shortName}
        </div>

        {/* Nome + subtítulo */}
        <div>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 15, fontWeight: 600, color: '#1a1a1a',
            letterSpacing: '-0.3px', lineHeight: 1.2,
          }}>
            {model.name}
          </div>
          <div style={{ fontSize: 10, color: '#A8ACBA', marginTop: 1 }}>
            Lar Church · Estudo Teológico
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        style={{
          background: '#F5F6FA',
          border: '1px solid #E0E3EC',
          fontSize: 11, fontWeight: 600, color: '#6B6E7A',
        }}
      >
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#4caf50', display: 'inline-block',
            animation: 'pulse-green 2s ease-in-out infinite',
          }}
        />
        Ativo
      </div>
    </header>
  )
}
