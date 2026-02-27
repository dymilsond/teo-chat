'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { ModelKey } from '@/types'
import { MODELS } from '@/lib/models'
import ChatArea from '@/components/chat/ChatArea'
import { useConversations } from '@/contexts/ConversationsContext'

function ChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refresh: refreshConversations } = useConversations()
  const modelParam = searchParams.get('model') as ModelKey | null
  const model: ModelKey = modelParam && MODELS[modelParam] ? modelParam : 'abc'

  // Redireciona para /welcome no primeiro acesso
  useEffect(() => {
    if (!localStorage.getItem('teo_welcome_seen')) {
      router.replace('/welcome')
    }
  }, [router])

  // Reconciliação no carregamento do chat — cobre aba antiga aberta
  // e casos onde o usuário voltou após pagamento sem webhook ainda.
  useEffect(() => {
    fetch('/api/payment/sync', { method: 'POST' }).catch(() => {})
  }, [])

  function handleConversationCreated(id: string) {
    window.history.replaceState(null, '', `/chat/${id}`)
    refreshConversations()
  }

  return (
    <ChatArea
      model={model}
      onConversationCreated={handleConversationCreated}
    />
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          className="flex-1 flex items-center justify-center"
          style={{ color: 'var(--wood-medium)' }}
        >
          Carregando...
        </div>
      }
    >
      <ChatPage />
    </Suspense>
  )
}
