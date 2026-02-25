'use client'

import { useEffect, useState } from 'react'
import type { Plan } from '@/types'

interface UsageData {
  current: number
  limit: number
  plan: Plan
}

export default function UsageCounter() {
  const [usage, setUsage] = useState<UsageData | null>(null)

  useEffect(() => {
    fetch('/api/user/usage')
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setUsage(data)
      })
      .catch(() => {})
  }, [])

  if (!usage || usage.plan === 'pro') return null

  const pct = Math.min((usage.current / usage.limit) * 100, 100)
  const isNearLimit = usage.current >= usage.limit - 2
  const isAtLimit = usage.current >= usage.limit

  const barColor = isAtLimit
    ? '#ef4444'
    : isNearLimit
    ? '#f97316'
    : 'var(--amber)'

  return (
    <div
      style={{
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 10,
        marginBottom: 8,
        border: isAtLimit ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 5,
        }}
      >
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Mensagens este mês
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: isAtLimit ? '#ef4444' : isNearLimit ? '#f97316' : 'var(--gold)',
          }}
        >
          {usage.current}/{usage.limit}
        </span>
      </div>

      {/* Barra de progresso */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 99, height: 4, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: barColor,
            borderRadius: 99,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {isAtLimit && (
        <p style={{ fontSize: 10, color: '#ef4444', marginTop: 5, fontWeight: 600 }}>
          Limite atingido — faça upgrade para continuar
        </p>
      )}
    </div>
  )
}
