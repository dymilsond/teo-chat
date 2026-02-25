import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/conversations — lista conversas do usuário
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(60)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ conversations: data })
}

// POST /api/conversations — cria nova conversa
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { model, title } = await req.json()

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, model, title: title || 'Nova Conversa' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ conversation: data }, { status: 201 })
}
