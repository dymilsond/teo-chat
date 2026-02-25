'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ModelKey } from '@/types'
import { MODELS } from '@/lib/models'
import ChatArea from '@/components/chat/ChatArea'
import { useConversations } from '@/contexts/ConversationsContext'

function ChatPage() {
  const searchParams = useSearchParams()
  const { refresh: refreshConversations } = useConversations()
  const modelParam = searchParams.get('model') as ModelKey | null
  const model: ModelKey = modelParam && MODELS[modelParam] ? modelParam : 'abc'

  function handleConversationCreated(id: string) {
    // Atualiza a URL sem causar re-render (sem navegar)
    window.history.replaceState(null, '', `/chat/${id}`)
    // Refresca a lista de conversas na sidebar
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
