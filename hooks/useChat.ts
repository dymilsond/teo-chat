'use client'

import { useState, useCallback, useRef } from 'react'
import { Message, ModelKey } from '@/types'

interface UseChatOptions {
  model: ModelKey
  initialMessages?: Message[]
  conversationId?: string
  onConversationCreated?: (id: string) => void
}

export function useChat({
  model,
  initialMessages = [],
  conversationId,
  onConversationCreated,
}: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Rastreia o ID da conversa atual (pode ser criado no primeiro envio)
  const currentConvIdRef = useRef<string | undefined>(conversationId)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim()
      if (!content || isLoading) return

      setInput('')
      setError(null)

      const userMsg: Message = {
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      }

      const newMessages = [...messages, userMsg]
      setMessages(newMessages)
      setIsLoading(true)

      // Placeholder para a resposta da IA
      const aiPlaceholder: Message = {
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      }
      setMessages([...newMessages, aiPlaceholder])

      abortRef.current = new AbortController()

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: newMessages,
            conversationId: currentConvIdRef.current,
          }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || `HTTP ${res.status}`)
        }

        // Captura o ID da conversa criada (ou confirmada) pelo servidor
        const serverConvId = res.headers.get('X-Conversation-Id')
        const isNewConversation = !currentConvIdRef.current && !!serverConvId
        if (serverConvId) {
          currentConvIdRef.current = serverConvId
        }

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data: ')) continue

            const data = trimmed.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                fullText += parsed.content
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: fullText,
                  }
                  return updated
                })
              }
            } catch {
              // ignora linhas inválidas
            }
          }
        }

        // Notifica após o stream completar (mensagem salva no DB)
        if (isNewConversation && serverConvId && onConversationCreated) {
          onConversationCreated(serverConvId)
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return

        const msg = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(msg)
        setMessages((prev) => prev.filter((m) => !(m.role === 'assistant' && m.content === '')))
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [input, messages, model, isLoading, onConversationCreated]
  )

  function reset() {
    setMessages([])
    setInput('')
    setError(null)
    setIsLoading(false)
    currentConvIdRef.current = conversationId
    abortRef.current?.abort()
  }

  return { messages, input, setInput, isLoading, error, sendMessage, reset }
}
