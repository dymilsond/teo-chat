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
      }

      setLoading(false)
    }

    fetchProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
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
