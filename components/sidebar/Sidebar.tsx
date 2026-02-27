'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ModelKey, UserProfile, Conversation } from '@/types'
import ModelList from './ModelList'
import ConversationList from './ConversationList'
import UserMenu from './UserMenu'
import UsageCounter from '@/components/ui/UsageCounter'
import UpgradeModal from '@/components/ui/UpgradeModal'

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
  const [showUpgrade, setShowUpgrade] = useState(false)
  const userPlan = profile?.plan ?? 'free'
  const router = useRouter()

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
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
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          className="flex-shrink-0 flex items-center gap-2.5"
          style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--sidebar-border)' }}
        >
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 33, height: 33, background: 'var(--accent)',
              borderRadius: 9, boxShadow: '0 2px 8px rgba(232,88,12,0.32)',
            }}
          >
            {/* Cruz simples */}
            <svg width="15" height="15" viewBox="0 0 20 20" fill="white">
              <rect x="8.5" y="2" width="3" height="16" rx="1"/>
              <rect x="2" y="7" width="16" height="3" rx="1"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.3px', lineHeight: 1 }}>
              Teo Chat
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
              Estudo Teológico com IA
            </div>
          </div>
        </div>

        {/* Seção modelos */}
        <div style={{ padding: '14px 16px 5px', fontSize: 9, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase' as const, color: '#B0B4C2' }}>
          Modelos de Estudo
        </div>

        <ModelList
          activeModel={activeModel}
          onSelect={(key) => { onModelSelect(key); onClose() }}
          userPlan={userPlan}
          onUpgradeNeeded={() => setShowUpgrade(true)}
        />

        {/* Nova Conversa */}
        <div style={{ padding: '4px 8px 0' }}>
          <button
            onClick={() => { onNewChat(); onClose() }}
            className="w-full flex items-center justify-center gap-1.5 transition-all"
            style={{
              padding: '7px 12px', borderRadius: 7,
              border: '1px dashed #B0B4C2', fontSize: 11, fontWeight: 600,
              color: '#5A5E6B', background: 'transparent', cursor: 'pointer',
            }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = '#E6E9F0'; el.style.color = '#1a1a1a'; el.style.borderColor = '#9096A6' }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = '#5A5E6B'; el.style.borderColor = '#B0B4C2' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nova Conversa
          </button>
        </div>

        {/* Divisor */}
        <div style={{ height: 1, background: 'var(--sidebar-border)', margin: '10px 16px' }} />

        {/* Histórico */}
        <div style={{ padding: '0 16px 6px', fontSize: 9, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase' as const, color: '#4A4E5A' }}>
          Histórico
        </div>

        {/* Lista de conversas com scroll — wrapper garante que o footer nunca sai da tela */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <ConversationList conversations={conversations} loading={conversationsLoading} />
        </div>

        {/* Footer */}
        <div
          className="flex-shrink-0"
          style={{ padding: '10px 10px 12px', borderTop: '1px solid var(--sidebar-border)' }}
        >
          {userPlan === 'free' && <UsageCounter />}

          {/* Como usar */}
          <button
            onClick={() => { router.push('/welcome'); onClose() }}
            className="w-full flex items-center gap-2 transition-all"
            style={{
              padding: '7px 10px',
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              marginBottom: 6,
              color: '#5A5E6B',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#E6E9F0'; e.currentTarget.style.color = '#1a1a1a' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5A5E6B' }}
          >
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              border: '1.5px solid currentColor',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, flexShrink: 0,
            }}>?</span>
            Como usar o Teo Chat
          </button>

          {profile && <UserMenu profile={profile} />}
        </div>
      </aside>

      {showUpgrade && (
        <UpgradeModal reason="pro_model" onClose={() => setShowUpgrade(false)} />
      )}
    </>
  )
}
