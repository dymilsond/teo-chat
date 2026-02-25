'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types'

interface UserMenuProps {
  profile: UserProfile
}

export default function UserMenu({ profile }: UserMenuProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Iniciais do nome
  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : profile.email[0].toUpperCase()

  const displayName = profile.full_name || profile.email.split('@')[0]

  return (
    <div className="user-menu-wrapper" ref={wrapperRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="user-avatar">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={displayName} />
          ) : initials}
        </div>
        <div className="user-info">
          <div className="user-name">{displayName}</div>
          <div className={`user-plan ${profile.plan}`}>
            {profile.plan === 'pro' ? '⭐ Pro' : 'Grátis'}
          </div>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            opacity: 0.6,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="user-menu-dropdown">
          {profile.plan === 'free' && (
            <>
              <button
                className="user-menu-item"
                onClick={() => { router.push('/pricing'); setOpen(false) }}
              >
                ⭐ Upgrade para Pro
              </button>
              <div className="user-menu-divider" />
            </>
          )}
          <button className="user-menu-item" onClick={() => setOpen(false)}>
            👤 Minha conta
          </button>
          <div className="user-menu-divider" />
          <button className="user-menu-item danger" onClick={handleSignOut}>
            🚪 Sair
          </button>
        </div>
      )}
    </div>
  )
}
