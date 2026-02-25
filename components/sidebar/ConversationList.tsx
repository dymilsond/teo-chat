'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Conversation } from '@/types'
import { MODELS } from '@/lib/models'

interface Props {
  conversations: Conversation[]
  loading: boolean
}

function groupByDate(conversations: Conversation[]) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(todayStart)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const groups: { label: string; items: Conversation[] }[] = [
    { label: 'Hoje', items: [] },
    { label: 'Últimos 7 dias', items: [] },
    { label: 'Anteriores', items: [] },
  ]

  for (const conv of conversations) {
    const date = new Date(conv.updated_at)
    if (date >= todayStart) {
      groups[0].items.push(conv)
    } else if (date >= weekAgo) {
      groups[1].items.push(conv)
    } else {
      groups[2].items.push(conv)
    }
  }

  return groups.filter((g) => g.items.length > 0)
}

export default function ConversationList({ conversations, loading }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  if (loading) {
    return (
      <div
        style={{
          padding: '12px 18px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: 12,
          fontStyle: 'italic',
        }}
      >
        Carregando...
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div
        style={{
          padding: '12px 18px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: 12,
          fontStyle: 'italic',
        }}
      >
        Nenhuma conversa ainda
      </div>
    )
  }

  const groups = groupByDate(conversations)

  return (
    <div
      className="overflow-y-auto"
      style={{ flex: 1, paddingBottom: 8 }}
    >
      {groups.map((group) => (
        <div key={group.label}>
          {/* Label do grupo */}
          <div
            style={{
              padding: '10px 18px 4px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,183,77,0.65)',
            }}
          >
            {group.label}
          </div>

          {group.items.map((conv) => {
            const isActive = pathname === `/chat/${conv.id}`
            const modelMeta = MODELS[conv.model]

            return (
              <button
                key={conv.id}
                onClick={() => router.push(`/chat/${conv.id}`)}
                title={conv.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 18px 6px 14px',
                  fontSize: 12.5,
                  lineHeight: 1.35,
                  background: isActive ? 'rgba(255,140,0,0.18)' : 'transparent',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                  borderLeft: isActive
                    ? '2px solid var(--amber)'
                    : '2px solid transparent',
                  color: isActive ? 'var(--white-warm)' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.color = 'var(--white-warm)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }
                }}
              >
                {/* Ícone do modelo */}
                <span style={{ fontSize: 13, flexShrink: 0 }}>
                  {modelMeta?.icon ?? '💬'}
                </span>
                {/* Título truncado */}
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {conv.title}
                </span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
