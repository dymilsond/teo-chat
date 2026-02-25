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
        setProfile(data as UserProfile)
      }

      setLoading(false)
    }

    fetchProfile()

    // Escuta mudanças de auth (login/logout)
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
