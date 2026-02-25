'use client'

import { ModelKey, UserProfile, Conversation } from '@/types'
import ModelList from './ModelList'
import ConversationList from './ConversationList'
import UserMenu from './UserMenu'

interface Props {
  activeModel: ModelKey
  onModelSelect: (key: ModelKey) => void
  onNewChat: () => void
  isOpen: boolean
  onClose: () => void
  profile: UserProfile | null
  conversations: Conversation[]
  conversationsLoading: boolean
}

export default function Sidebar({
  activeModel,
  onModelSelect,
  onNewChat,
  isOpen,
  onClose,
  profile,
  conversations,
  conversationsLoading,
}: Props) {
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 bottom-0 md:relative md:translate-x-0
          flex flex-col z-50 transition-transform duration-300 flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          width: 'var(--sidebar-w)',
          background: 'linear-gradient(135deg, var(--wood-medium), var(--wood-dark))',
          borderRight: '3px solid var(--amber)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0"
          style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,183,77,0.5)',
              }}
            >
              ✝
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight" style={{ color: 'var(--white-warm)' }}>
                Teo Chat
              </h1>
              <p className="text-xs" style={{ color: 'var(--gold)' }}>
                Estudo Teológico com IA
              </p>
            </div>
          </div>
        </div>

        {/* Área de conteúdo rolável */}
        <div className="flex flex-col overflow-hidden" style={{ flex: 1 }}>
          {/* Lista de modelos */}
          <div className="flex-shrink-0">
            <ModelList
              activeModel={activeModel}
              onSelect={(key) => {
                onModelSelect(key)
                onClose()
              }}
            />
          </div>

          {/* Divisor */}
          <div
            className="mx-3.5 flex-shrink-0"
            style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,183,77,0.4), transparent)',
              margin: '4px 14px 0',
            }}
          />

          {/* Label histórico */}
          <div
            className="flex-shrink-0"
            style={{
              padding: '10px 18px 2px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,183,77,0.65)',
            }}
          >
            Histórico
          </div>

          {/* Lista de conversas — ocupa o espaço restante */}
          <ConversationList
            conversations={conversations}
            loading={conversationsLoading}
          />
        </div>

        {/* Footer */}
        <div
          className="flex-shrink-0"
          style={{ padding: '14px 20px 18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <button
            onClick={() => {
              onNewChat()
              onClose()
            }}
            className="w-full py-2 mb-2.5 rounded-lg text-sm font-semibold tracking-tight transition-all"
            style={{
              background: 'rgba(255,140,0,0.15)',
              border: '1px solid rgba(255,140,0,0.4)',
              color: 'var(--gold)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,140,0,0.28)'
              el.style.borderColor = 'var(--amber)'
              el.style.color = 'var(--white-warm)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,140,0,0.15)'
              el.style.borderColor = 'rgba(255,140,0,0.4)'
              el.style.color = 'var(--gold)'
            }}
          >
            + Nova Conversa
          </button>

          {profile && (
            <div className="mt-2">
              <UserMenu profile={profile} />
            </div>
          )}

          <p className="text-xs text-center font-medium opacity-80 mt-2" style={{ color: 'var(--gold)' }}>
            Lar Church — Lugar de Amor e Recomeço
          </p>
        </div>
      </aside>
    </>
  )
}
