'use client'

import { useEffect, useRef } from 'react'
import { ModelKey, Message } from '@/types'
import { MODELS } from '@/lib/models'
import { useChat } from '@/hooks/useChat'
import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import WelcomeScreen from './WelcomeScreen'

interface Props {
  model: ModelKey
  conversationId?: string
  initialMessages?: Message[]
  onMenuOpen?: () => void
  onConversationCreated?: (id: string) => void
}

export default function ChatArea({
  model,
  conversationId,
  initialMessages,
  onMenuOpen,
  onConversationCreated,
}: Props) {
  const modelMeta = MODELS[model]
  const { messages, input, setInput, isLoading, error, sendMessage } = useChat({
    model,
    initialMessages,
    conversationId,
    onConversationCreated,
  })
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full">
      <ChatHeader model={modelMeta} onMenuOpen={onMenuOpen} />

      <div
        className="flex-1 overflow-y-auto flex flex-col gap-4"
        style={{ padding: '28px 28px 12px', scrollBehavior: 'smooth' }}
      >
        {messages.length === 0 && (
          <WelcomeScreen
            model={modelMeta}
            onChipClick={(chip) => setInput(chip)}
          />
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} modelIcon={modelMeta.icon} />
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <TypingIndicator />
        )}

        {error && (
          <div
            className="text-sm px-4 py-3 rounded-xl animate-fade-up"
            style={{
              background: '#FFF3F3',
              border: '1px solid #FFB3B3',
              color: '#C62828',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => sendMessage()}
        disabled={isLoading}
      />
    </div>
  )
}
