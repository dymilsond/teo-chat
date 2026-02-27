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

  const initials = profile.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : profile.email[0].toUpperCase()

  const displayName = profile.full_name || profile.email.split('@')[0]

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 transition-all"
        style={{
          padding: '7px 10px',
          borderRadius: 9,
          border: '1px solid #E0E3EC',
          background: '#fff',
          cursor: 'pointer',
          outline: 'none',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C8CCD8' }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = '#E0E3EC' }}
        aria-expanded={open}
      >
        {/* Avatar */}
        <div
          className="flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #E8580C, #F97316)',
            color: '#fff', fontSize: 11, fontWeight: 700,
            fontFamily: "'Fraunces', serif",
          }}
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-left">
          <div style={{
            fontSize: 12, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {displayName}
          </div>
          <div style={{ fontSize: 10, color: profile.plan === 'pro' ? '#E8580C' : '#A8ACBA', marginTop: 1 }}>
            {profile.plan === 'pro' ? '⭐ Pro' : 'Plano Grátis'}
          </div>
        </div>

        {/* Chevron */}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#A8ACBA" strokeWidth="2.5"
          style={{
            flexShrink: 0, transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: 0, right: 0,
            background: '#fff',
            border: '1px solid #E0E3EC',
            borderRadius: 10,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          {profile.plan === 'free' && (
            <>
              <button
                onClick={() => { router.push('/pricing'); setOpen(false) }}
                className="w-full text-left"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', fontSize: 12, fontWeight: 600,
                  color: '#E8580C', border: 'none', background: 'transparent', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF0E8' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                ⭐ Upgrade para Pro
              </button>
              <div style={{ height: 1, background: '#F0F2F7' }} />
            </>
          )}

          <button
            onClick={() => { router.push('/profile'); setOpen(false) }}
            className="w-full text-left"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', fontSize: 12,
              color: '#4A4E5A', border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F6FA' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            👤 Minha conta
          </button>

          <button
            onClick={() => { router.push('/welcome'); setOpen(false) }}
            className="w-full text-left"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', fontSize: 12,
              color: '#4A4E5A', border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F6FA' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            ❓ Como usar
          </button>

          <div style={{ height: 1, background: '#F0F2F7' }} />

          <button
            onClick={handleSignOut}
            className="w-full text-left"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', fontSize: 12,
              color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            🚪 Sair
          </button>
        </div>
      )}
    </div>
  )
}
