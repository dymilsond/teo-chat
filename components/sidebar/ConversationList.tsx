'use client'

import { useState, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Conversation } from '@/types'

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
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [conversations, search])

  const groups = useMemo(() => groupByDate(filtered), [filtered])

  return (
    <div className="flex flex-col" style={{ flex: 1, minHeight: 0 }}>
      {/* Search */}
      <div style={{ padding: '0 8px 6px' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#fff', border: '1px solid #E0E3EC',
            borderRadius: 8, padding: '5px 10px',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A8ACBA" strokeWidth="2.5" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar no histórico..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 11, color: '#4A4E5A',
              background: 'transparent', fontFamily: 'inherit',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8ACBA', padding: 0, lineHeight: 1 }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ flex: 1, paddingBottom: 8 }}>
        {loading ? (
          <div style={{ padding: '10px 16px', fontSize: 11, color: '#A8ACBA', fontStyle: 'italic' }}>
            Carregando...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '10px 16px', fontSize: 11, color: '#A8ACBA', fontStyle: 'italic' }}>
            {search ? 'Nenhum resultado' : 'Nenhuma conversa ainda'}
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <div
                style={{
                  padding: '8px 16px 3px',
                  fontSize: 9, fontWeight: 700,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase' as const,
                  color: '#C0C4D0',
                }}
              >
                {group.label}
              </div>

              {group.items.map((conv) => {
                const isActive = pathname === `/chat/${conv.id}`
                return (
                  <button
                    key={conv.id}
                    onClick={() => router.push(`/chat/${conv.id}`)}
                    title={conv.title}
                    className="flex items-center gap-2 text-left transition-all"
                    style={{
                      padding: '6px 10px 6px 12px',
                      margin: '1px 6px',
                      width: 'calc(100% - 12px)',
                      borderRadius: 7,
                      background: isActive ? '#fff' : 'transparent',
                      boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' : 'none',
                      border: 'none', cursor: 'pointer', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#E6E9F0' }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    <svg
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke={isActive ? '#E8580C' : '#A8ACBA'} strokeWidth="2"
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span
                      style={{
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                        fontSize: 11.5,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#1a1a1a' : '#6B6E7A',
                      }}
                    >
                      {conv.title}
                    </span>
                  </button>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
