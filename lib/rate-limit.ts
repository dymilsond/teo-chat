import { createClient } from '@/lib/supabase/server'
import type { Plan } from '@/types'

export const FREE_MONTHLY_LIMIT = 10

function getMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export async function checkRateLimit(
  userId: string,
  plan: Plan
): Promise<{ allowed: boolean; current: number; limit: number }> {
  if (plan === 'pro') {
    return { allowed: true, current: 0, limit: 999999 }
  }

  const supabase = await createClient()
  const monthKey = getMonthKey()

  const { data } = await supabase
    .from('usage_counters')
    .select('count')
    .eq('user_id', userId)
    .eq('month_key', monthKey)
    .maybeSingle()

  const current = (data as { count: number } | null)?.count ?? 0
  const allowed = current < FREE_MONTHLY_LIMIT

  return { allowed, current, limit: FREE_MONTHLY_LIMIT }
}

export async function incrementUsage(userId: string): Promise<void> {
  const supabase = await createClient()
  const monthKey = getMonthKey()

  const { data: existing } = await supabase
    .from('usage_counters')
    .select('id, count')
    .eq('user_id', userId)
    .eq('month_key', monthKey)
    .maybeSingle()

  const row = existing as { id: string; count: number } | null

  if (row) {
    await supabase
      .from('usage_counters')
      .update({ count: row.count + 1 })
      .eq('id', row.id)
  } else {
    await supabase
      .from('usage_counters')
      .insert({ user_id: userId, month_key: monthKey, count: 1 })
  }
}
