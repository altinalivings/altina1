'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function CrmLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/crm/dashboard'
  const wasDeactivated = searchParams.get('deactivated') === '1'

  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    const supabase = createClient()

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      // Friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Invalid email or password. Please check your credentials and try again.')
      } else if (error.message.includes('Email not confirmed')) {
        setErrorMsg('Your email is not confirmed. Check your inbox for the confirmation link.')
      } else {
        setErrorMsg(error.message)
      }
      setLoading(false)
      return
    }

    // Check if user is active
    if (authData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_active, deactivation_reason')
        .eq('id', authData.user.id)
        .single()

      if (profile && !profile.is_active) {
        await supabase.auth.signOut()
        setErrorMsg('Your account has been deactivated. Please contact your administrator.')
        setLoading(false)
        return
      }
    }

    toast.success('Signed in successfully! Redirecting...')
    router.push(redirectTo)
    router.refresh()
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${redirectTo}` },
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    setMagicSent(true)
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail) return
    setForgotLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/crm/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()

      if (data.status === 'deactivated') {
        setErrorMsg('Your account has been deactivated. Please contact your administrator.')
        setForgotLoading(false)
        return
      }

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong')
        setForgotLoading(false)
        return
      }

      setForgotSent(true)
    } catch {
      setErrorMsg('Network error. Please try again.')
    }
    setForgotLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0C] p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-altina-gold">ALTINA CRM</h1>
          <p className="mt-2 text-sm text-altina-muted">Sign in to your CRM account</p>
        </div>

        {/* Deactivated warning */}
        {wasDeactivated && !errorMsg && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
            Your account has been deactivated. Please contact your administrator.
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgot ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            {forgotSent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-altina-gold/20">
                  <svg className="h-8 w-8 text-altina-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">Check your email</h2>
                <p className="mt-2 text-sm text-altina-muted">
                  If an account exists for <strong className="text-white">{forgotEmail}</strong>, you&apos;ll receive a password reset link.
                </p>
                <button
                  onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail('') }}
                  className="mt-4 text-sm text-altina-gold hover:underline"
                >
                  Back to login
                </button>
              </div>
            ) : (
              <>
                <h2 className="mb-2 text-lg font-semibold text-white">Reset Password</h2>
                <p className="mb-6 text-sm text-altina-muted">Enter your email and we&apos;ll send you a link to reset your password.</p>
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <label className="mb-1.5 block text-sm font-medium text-altina-muted">Email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="you@altinalivings.com"
                      className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-altina-gold px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {forgotLoading && <Loader2 size={16} className="animate-spin" />}
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
                <button
                  onClick={() => { setShowForgot(false); setForgotEmail('') }}
                  className="mt-4 block w-full text-center text-sm text-altina-muted hover:text-white"
                >
                  Back to login
                </button>
              </>
            )}
          </div>
        ) : (
          /* Main Login Card */
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            {magicSent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-altina-gold/20">
                  <svg className="h-8 w-8 text-altina-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">Check your email</h2>
                <p className="mt-2 text-sm text-altina-muted">
                  We sent a magic link to <strong className="text-white">{email}</strong>
                </p>
                <button
                  onClick={() => setMagicSent(false)}
                  className="mt-4 text-sm text-altina-gold hover:underline"
                >
                  Try a different method
                </button>
              </div>
            ) : (
              <>
                {/* Mode tabs */}
                <div className="mb-6 flex rounded-xl bg-white/5 p-1">
                  <button
                    onClick={() => setMode('password')}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                      mode === 'password'
                        ? 'bg-altina-gold/20 text-altina-gold'
                        : 'text-altina-muted hover:text-white'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    onClick={() => setMode('magic')}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                      mode === 'magic'
                        ? 'bg-altina-gold/20 text-altina-gold'
                        : 'text-altina-muted hover:text-white'
                    }`}
                  >
                    Magic Link
                  </button>
                </div>

                <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink}>
                  {/* Email */}
                  <div className="mb-4">
                    <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMsg('') }}
                      required
                      placeholder="you@altinalivings.com"
                      className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
                    />
                  </div>

                  {/* Password (only in password mode) */}
                  {mode === 'password' && (
                    <div className="mb-2">
                      <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setErrorMsg('') }}
                          required
                          placeholder="Enter your password"
                          className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 pr-11 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-altina-muted transition-colors hover:text-white"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Forgot password link */}
                  {mode === 'password' && (
                    <div className="mb-6 text-right">
                      <button
                        type="button"
                        onClick={() => { setShowForgot(true); setForgotEmail(email); setErrorMsg('') }}
                        className="text-xs text-altina-muted transition-colors hover:text-altina-gold"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-altina-gold px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading
                      ? 'Signing in...'
                      : mode === 'password'
                        ? 'Sign In'
                        : 'Send Magic Link'
                    }
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-altina-muted">
          ALTINA Livings CRM &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
