'use client'

import { ModelKey, Plan } from '@/types'
import { MODEL_LIST } from '@/lib/models'

interface Props {
  activeModel: ModelKey
  onSelect: (key: ModelKey) => void
  userPlan: Plan
  onUpgradeNeeded: () => void
}

const BADGE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  abc: { bg: '#E8580C', color: '#fff', border: '#E8580C' },
  eep: { bg: '#FDEBD5', color: '#B05C20', border: '#F5C99A' },
  emi: { bg: '#FDEBD5', color: '#B05C20', border: '#F5C99A' },
  evr: { bg: '#FDEBD5', color: '#B05C20', border: '#F5C99A' },
  cli: { bg: '#FDEBD5', color: '#B05C20', border: '#F5C99A' },
}

export default function ModelList({ activeModel, onSelect, userPlan, onUpgradeNeeded }: Props) {
  return (
    <div style={{ padding: '0 6px' }}>
      {MODEL_LIST.map((m) => {
        const isActive = m.key === activeModel
        const isLocked = m.plan === 'pro' && userPlan === 'free'
        const badge = BADGE_STYLES[m.key] ?? BADGE_STYLES.eep

        function handleClick() {
          if (isLocked) onUpgradeNeeded()
          else onSelect(m.key)
        }

        return (
          <button
            key={m.key}
            onClick={handleClick}
            className="w-full flex items-center gap-2.5 text-left relative transition-all"
            style={{
              padding: '7px 10px', margin: '1px 0', borderRadius: 8,
              background: isActive ? '#fff' : 'transparent',
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' : 'none',
              border: 'none', cursor: 'pointer',
              opacity: 1,
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#E6E9F0' }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
          >
            {/* Badge do modelo */}
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: 31, height: 31, borderRadius: 7,
                background: isActive ? '#E8580C' : badge.bg,
                color: isActive ? '#fff' : badge.color,
                border: `1px solid ${isActive ? '#E8580C' : badge.border}`,
                fontFamily: "'Fraunces', serif",
                fontSize: 9, fontWeight: 700, letterSpacing: '-0.3px',
              }}
            >
              {m.shortName}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#1a1a1a' : '#3E4250', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {m.name}
              </div>
            </div>

            {/* Tag PRO */}
            {m.plan === 'pro' && (
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4,
                color: '#E8580C', background: '#FEF0E8', border: '1px solid #F9C9A8',
                flexShrink: 0,
              }}>
                PRO
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
