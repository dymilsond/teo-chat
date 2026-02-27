'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ModelKey } from '@/types'
import Sidebar from '@/components/sidebar/Sidebar'
import { useUser } from '@/hooks/useUser'
import { ConversationsProvider, useConversations } from '@/contexts/ConversationsContext'

function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeModel, setActiveModel] = useState<ModelKey>('abc')
  const { profile } = useUser()
  const { conversations, loading: convLoading } = useConversations()

  // Abre sidebar automaticamente no primeiro load se for mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(true)
    }
  }, [])

  // Escuta o evento disparado pelo botão hamburger em qualquer página
  useEffect(() => {
    function handleSidebarOpen() {
      setSidebarOpen(true)
    }
    window.addEventListener('sidebar-open', handleSidebarOpen)
    return () => window.removeEventListener('sidebar-open', handleSidebarOpen)
  }, [])

  function handleModelSelect(key: ModelKey) {
    setActiveModel(key)
    router.push(`/chat?model=${key}`)
  }

  function handleNewChat() {
    router.push('/chat')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#fff' }}>
      <Sidebar
        activeModel={activeModel}
        onModelSelect={handleModelSelect}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
        conversations={conversations}
        conversationsLoading={convLoading}
      />

      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConversationsProvider>
      <AppShell>{children}</AppShell>
    </ConversationsProvider>
  )
}
