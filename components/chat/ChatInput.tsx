'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  disabled?: boolean
}

export default function ChatInput({ value, onChange, onSend, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 130) + 'px'
  }, [value])

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <footer
      className="flex-shrink-0"
      style={{
        padding: '14px 28px 18px',
        background: 'var(--white)',
        borderTop: '3px solid var(--amber)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="flex items-end gap-2.5 rounded-xl px-4 py-2.5 transition-all"
        style={{
          background: 'var(--white-warm)',
          border: '2px solid rgba(255,140,0,0.25)',
        }}
        onFocus={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--amber)'
          el.style.boxShadow = '0 0 0 3px rgba(255,140,0,0.12)'
        }}
        onBlur={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'rgba(255,140,0,0.25)'
          el.style.boxShadow = 'none'
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Digite um versículo, passagem ou pergunta teológica..."
          disabled={disabled}
          className="flex-1 bg-transparent border-none outline-none text-sm leading-relaxed resize-none overflow-y-auto"
          style={{
            minHeight: '22px',
            maxHeight: '130px',
            color: 'var(--black-modern)',
            fontFamily: 'inherit',
          }}
        />

        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--amber), var(--orange))',
            border: 'none',
            boxShadow: '0 6px 20px rgba(255,140,0,0.4)',
            opacity: disabled || !value.trim() ? 0.5 : 1,
            cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!disabled && value.trim()) {
              const el = e.currentTarget
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 10px 28px rgba(255,140,0,0.55)'
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.transform = 'translateY(0)'
            el.style.boxShadow = '0 6px 20px rgba(255,140,0,0.4)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" width="17" height="17">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <p className="text-center mt-2 opacity-60" style={{ fontSize: '0.68rem', color: 'var(--wood-medium)' }}>
        <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--black-soft)', fontFamily: 'inherit' }}>Enter</kbd>
        {' '}para enviar &nbsp;·&nbsp;{' '}
        <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--black-soft)', fontFamily: 'inherit' }}>Shift+Enter</kbd>
        {' '}para nova linha
      </p>
    </footer>
  )
}
