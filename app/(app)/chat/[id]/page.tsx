import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ModelKey, Message } from '@/types'
import ChatArea from '@/components/chat/ChatArea'

interface Props {
  params: Promise<{ id: string }>
}

async function getConversationData(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: conv, error: convError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (convError || !conv) return null

  const { data: messages } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  return {
    conversation: conv,
    messages: (messages ?? []) as Message[],
  }
}

export default async function ConversationPage({ params }: Props) {
  const { id } = await params
  const data = await getConversationData(id)

  if (!data) {
    redirect('/chat')
  }

  return (
    <ChatArea
      model={data.conversation.model as ModelKey}
      conversationId={id}
      initialMessages={data.messages}
    />
  )
}
