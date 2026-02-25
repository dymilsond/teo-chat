import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import PROMPTS from '@/lib/prompts'
import { ModelKey, Message } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { model, messages, conversationId } = (await req.json()) as {
      model: ModelKey
      messages: Message[]
      conversationId?: string
    }

    if (!model || !messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Requisição inválida.' }, { status: 400 })
    }

    const systemPrompt = PROMPTS[model]
    if (!systemPrompt) {
      return Response.json({ error: `Modelo desconhecido: ${model}` }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'API key não configurada.' }, { status: 500 })
    }

    // Autenticar usuário
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    // Criar ou reutilizar conversa
    let actualConversationId: string = conversationId ?? ''

    const lastUserMsg = messages[messages.length - 1]?.content ?? ''

    if (!actualConversationId.length) {
      // Gerar título a partir da primeira mensagem
      const title =
        lastUserMsg.length > 60
          ? lastUserMsg.slice(0, 57).trimEnd() + '...'
          : lastUserMsg || 'Nova Conversa'

      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({ user_id: user.id, model, title })
        .select()
        .single()

      if (convError) {
        console.error('Erro ao criar conversa:', convError)
        return Response.json({ error: 'Erro ao criar conversa.' }, { status: 500 })
      }

      actualConversationId = newConv.id
    } else {
      // Atualiza updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', actualConversationId)
        .eq('user_id', user.id)
    }

    // Salvar mensagem do usuário
    const userMsg = messages[messages.length - 1]
    await supabase.from('messages').insert({
      conversation_id: actualConversationId,
      role: userMsg.role,
      content: userMsg.content,
    })

    // Montar mensagens para OpenAI
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ]

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: apiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text()
      return Response.json({ error: `OpenAI error: ${errorText}` }, { status: 502 })
    }

    const encoder = new TextEncoder()
    const convId = actualConversationId // captura para closure

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openaiRes.body!.getReader()
        const decoder = new TextDecoder()
        let fullAssistantContent = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed.startsWith('data: ')) continue

              const data = trimmed.slice(6)
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                continue
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  fullAssistantContent += content
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  )
                }
              } catch {
                // linha inválida, ignora
              }
            }
          }

          // Salvar resposta do assistente após streaming
          if (fullAssistantContent) {
            await supabase.from('messages').insert({
              conversation_id: convId,
              role: 'assistant',
              content: fullAssistantContent,
            })
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
        'X-Conversation-Id': actualConversationId,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
