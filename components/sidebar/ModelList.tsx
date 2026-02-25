'use client'

import { ModelKey, Plan } from '@/types'
import { MODEL_LIST } from '@/lib/models'
import LockIcon from '@/components/ui/LockIcon'

interface Props {
  activeModel: ModelKey
  onSelect: (key: ModelKey) => void
  userPlan: Plan
  onUpgradeNeeded: () => void
}

export default function ModelList({ activeModel, onSelect, userPlan, onUpgradeNeeded }: Props) {
  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: '18px 14px 12px' }}>
      <div
        className="text-xs uppercase tracking-widest font-semibold mb-2.5 px-1.5"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        Modelos de Estudo
      </div>

      {MODEL_LIST.map((m) => {
        const isActive = m.key === activeModel
        const isLocked = m.plan === 'pro' && userPlan === 'free'

        function handleClick() {
          if (isLocked) {
            onUpgradeNeeded()
          } else {
            onSelect(m.key)
          }
        }

        return (
          <button
            key={m.key}
            onClick={handleClick}
            className="w-full flex items-start gap-3 px-3.5 py-3 rounded-xl mb-1.5 text-left transition-all relative"
            style={{
              background: isActive ? 'rgba(255,140,0,0.2)' : 'transparent',
              border: isActive ? '1px solid var(--amber)' : '1px solid transparent',
              boxShadow: isActive ? 'inset 4px 0 0 var(--amber)' : 'none',
              cursor: 'pointer',
              opacity: isLocked ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                const el = e.currentTarget
                el.style.background = 'rgba(255,255,255,0.1)'
                el.style.borderColor = 'rgba(255,183,77,0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.borderColor = 'transparent'
              }
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all"
              style={{
                background: isActive ? 'rgba(255,140,0,0.3)' : 'rgba(255,255,255,0.12)',
                border: isActive ? '1px solid rgba(255,140,0,0.6)' : '1px solid rgba(255,183,77,0.2)',
              }}
            >
              {m.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-semibold mb-0.5 transition-colors flex items-center gap-1.5"
                style={{ color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.88)' }}
              >
                {m.shortName}
                {isLocked && (
                  <span style={{ color: 'rgba(255,183,77,0.6)', display: 'flex', alignItems: 'center' }}>
                    <LockIcon size={11} />
                  </span>
                )}
              </div>
              <div
                className="text-xs leading-snug"
                style={{ color: isActive ? 'rgba(255,183,77,0.65)' : 'rgba(255,255,255,0.42)' }}
              >
                {m.desc}
              </div>
            </div>

            {/* Badge Pro */}
            {m.plan === 'pro' && (
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: isLocked
                    ? 'rgba(255,183,77,0.15)'
                    : 'linear-gradient(135deg, #FFB74D, #FF8C00)',
                  color: isLocked ? 'rgba(255,183,77,0.7)' : '#fff',
                  border: isLocked ? '1px solid rgba(255,183,77,0.3)' : 'none',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Pro
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
