'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types'

export function useUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        const p = data as UserProfile
        setProfile(p)

        // Reconciliação silenciosa: verifica estado real no MP para cobrir
        // webhooks perdidos. Roda para qualquer usuário não-Pro (o endpoint
        // não faz chamada desnecessária à API MP se não houver preapproval).
        if (p.plan !== 'pro' && p.mp_subscription_status !== 'cancelled') {
          fetch('/api/payment/sync', { method: 'POST' })
            .then((r) => r.json())
            .then((res) => {
              if (res.synced && res.plan && res.plan !== p.plan) {
                setProfile((prev) => prev ? { ...prev, plan: res.plan } : prev)
              }
            })
            .catch(() => {})
        }
      } else {
        // Perfil não existe — cria automaticamente.
        // Isso acontece quando o usuário faz login pela primeira vez via Google OAuth.
        const { data: created } = await supabase
          .from('profiles')
          .upsert(
            {
              id: user.id,
              email: user.email ?? '',
              full_name: user.user_metadata?.full_name ?? null,
              avatar_url: user.user_metadata?.avatar_url ?? null,
              plan: 'free',
              mp_subscription_status: 'none',
            },
            { onConflict: 'id', ignoreDuplicates: true }
          )
          .select()
          .single()

        if (created) {
          setProfile(created as UserProfile)

          // Tenta recuperar plano Pro pelo e-mail (caso o usuário já pagou
          // mas o ID mudou por ser uma conta Google nova).
          fetch('/api/payment/sync', { method: 'POST' })
            .then((r) => r.json())
            .then((res) => {
              if (res.synced && res.plan === 'pro') {
                setProfile((prev) => prev ? { ...prev, plan: 'pro' } : prev)
              }
            })
            .catch(() => {})
        }
      }

      setLoading(false)
    }

    fetchProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string) => {
        if (event === 'SIGNED_OUT') {
          setProfile(null)
        } else if (event === 'SIGNED_IN') {
          await fetchProfile()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { profile, loading }
}
