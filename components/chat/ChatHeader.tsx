'use client'

import { ModelMeta } from '@/types'

interface Props {
  model: ModelMeta
  onMenuOpen?: () => void // mantido por compatibilidade, mas não é mais necessário
}

export default function ChatHeader({ model, onMenuOpen }: Props) {
  function handleMenuClick() {
    // Dispara evento global que o AppShell (layout) escuta
    window.dispatchEvent(new CustomEvent('sidebar-open'))
    onMenuOpen?.()
  }

  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-7"
      style={{
        height: '66px',
        background: 'linear-gradient(135deg, var(--wood-medium), var(--wood-dark))',
        borderBottom: '3px solid var(--amber)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger — só mobile */}
        <button
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-lg mr-1"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--amber)', border: 'none', cursor: 'pointer' }}
          onClick={handleMenuClick}
          aria-label="Menu"
        >
          ☰
        </button>

        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,183,77,0.4)',
          }}
        >
          {model.icon}
        </div>
        <div>
          <div className="font-bold text-base" style={{ color: 'var(--white-warm)' }}>
            {model.name}
          </div>
          <div className="text-xs hidden sm:block" style={{ color: 'var(--gold)' }}>
            Lar Church · Estudo Teológico
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,183,77,0.35)',
          color: 'var(--gold)',
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#4caf50', animation: 'pulse-green 2s ease-in-out infinite' }}
        />
        Ativo
      </div>
    </header>
  )
}
