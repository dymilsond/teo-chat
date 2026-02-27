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

  const canSend = !disabled && !!value.trim()

  return (
    <footer
      className="flex-shrink-0"
      style={{
        padding: '12px 20px 16px',
        background: '#EEF0F5',
        borderTop: '1px solid #E0E3EC',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'flex-end', gap: 10,
          background: '#fff',
          border: '1.5px solid #E0E3EC',
          borderRadius: 14,
          padding: '8px 8px 8px 16px',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocusCapture={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = '#E8580C'
          el.style.boxShadow = '0 0 0 3px rgba(232,88,12,0.10)'
        }}
        onBlurCapture={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = '#E0E3EC'
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
          className="flex-1 bg-transparent border-none outline-none resize-none overflow-y-auto"
          style={{
            minHeight: 24, maxHeight: 130,
            fontSize: 16, lineHeight: 1.5,
            color: '#1a1a1a', fontFamily: 'inherit',
          }}
        />

        <button
          onClick={onSend}
          disabled={!canSend}
          className="flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: canSend ? '#E8580C' : '#E0E3EC',
            border: 'none',
            cursor: canSend ? 'pointer' : 'not-allowed',
            boxShadow: canSend ? '0 4px 12px rgba(232,88,12,0.35)' : 'none',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            if (canSend) {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(232,88,12,0.45)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = canSend ? '0 4px 12px rgba(232,88,12,0.35)' : 'none'
          }}
        >
          <svg viewBox="0 0 24 24" fill={canSend ? 'white' : '#A8ACBA'} width="15" height="15">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: 8, fontSize: 10.5, color: '#B0B4C2' }}>
        <kbd style={{ padding: '1px 5px', borderRadius: 4, background: '#fff', border: '1px solid #E0E3EC', color: '#6B6E7A', fontFamily: 'inherit', fontSize: 10 }}>Enter</kbd>
        {' '}para enviar &nbsp;·&nbsp;{' '}
        <kbd style={{ padding: '1px 5px', borderRadius: 4, background: '#fff', border: '1px solid #E0E3EC', color: '#6B6E7A', fontFamily: 'inherit', fontSize: 10 }}>Shift+Enter</kbd>
        {' '}para nova linha
      </p>
    </footer>
  )
}
