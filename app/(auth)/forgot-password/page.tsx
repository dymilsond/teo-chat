'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError('Não foi possível enviar o email. Verifique o endereço e tente novamente.')
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">✝</span>
          <span className="auth-logo-text">Teo Chat</span>
        </div>

        {sent ? (
          <div className="auth-success">
            <div className="success-icon">📧</div>
            <h2>Email enviado!</h2>
            <p>
              Enviamos um link para <strong>{email}</strong>.<br />
              Verifique sua caixa de entrada e clique no link para redefinir sua senha.
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
              Não recebeu?{' '}
              <button
                onClick={() => setSent(false)}
                style={{ color: 'var(--amber)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Tentar novamente
              </button>
            </p>
          </div>
        ) : (
          <>
            <h1 className="auth-title">Esqueceu a senha?</h1>
            <p className="auth-subtitle">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="auth-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                    <span className="loading-dot" />
                  </span>
                ) : 'Enviar link de redefinição'}
              </button>
            </form>
          </>
        )}

        <p className="auth-footer" style={{ marginTop: '1.5rem' }}>
          <Link href="/login">← Voltar para o login</Link>
        </p>
      </div>
    </div>
  )
}
