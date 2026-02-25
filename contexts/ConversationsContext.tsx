'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Conversation } from '@/types'

interface ConversationsContextType {
  conversations: Conversation[]
  loading: boolean
  refresh: () => Promise<void>
}

const ConversationsContext = createContext<ConversationsContextType>({
  conversations: [],
  loading: true,
  refresh: async () => {},
})

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations')
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations || [])
      }
    } catch (err) {
      console.error('Erro ao buscar conversas:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <ConversationsContext.Provider value={{ conversations, loading, refresh }}>
      {children}
    </ConversationsContext.Provider>
  )
}

export function useConversations() {
  return useContext(ConversationsContext)
}
