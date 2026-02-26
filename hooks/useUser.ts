'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types'

export function useUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile')

        if (!res.ok) {
          // 401 = não autenticado; qualquer outro erro = problema temporário
          setProfile(null)
          return
        }

        const data: UserProfile = await res.json()
        setProfile(data)

        // Reconciliação silenciosa: verifica estado real no MP para cobrir
        // webhooks perdidos. Roda para qualquer usuário não-Pro (o endpoint
        // não faz chamada desnecessária à API MP se não houver preapproval).
        if (data.plan !== 'pro' && data.mp_subscription_status !== 'cancelled') {
          fetch('/api/payment/sync', { method: 'POST' })
            .then((r) => r.json())
            .then((res) => {
              if (res.synced && res.plan && res.plan !== data.plan) {
                setProfile((prev) => (prev ? { ...prev, plan: res.plan } : prev))
              }
            })
            .catch(() => {})
        }
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()

    // Escuta mudanças de autenticação (login/logout) via Supabase Realtime.
    // Não chamamos supabase.auth.getUser() aqui — apenas detectamos eventos
    // e delegamos ao endpoint de API para evitar o Navigator LockManager.
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null)
        setLoading(false)
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setLoading(true)
        await fetchProfile()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { profile, loading }
}
