import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/conversations/[id]/messages — retorna mensagens de uma conversa
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Verifica que a conversa pertence ao usuário
  const { data: conv, error: convError } = await supabase
    .from('conversations')
    .select('id, model')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (convError || !conv) {
    return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
  }

  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  if (msgError) {
    return NextResponse.json({ error: msgError.message }, { status: 500 })
  }

  return NextResponse.json({ messages, model: conv.model })
}
