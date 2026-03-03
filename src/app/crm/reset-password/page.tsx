'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // Supabase auto-processes the hash fragment and exchanges the token for a session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    // Also check if we already have a session (token already exchanged)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    toast.success('Password updated successfully!')
    router.push('/crm/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0C] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-altina-gold">ALTINA CRM</h1>
          <p className="mt-2 text-sm text-altina-muted">Set your new password</p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errorMsg}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          {!ready ? (
            <div className="py-8 text-center">
              <Loader2 size={24} className="mx-auto mb-3 animate-spin text-altina-gold" />
              <p className="text-sm text-altina-muted">Verifying your reset link...</p>
              <p className="mt-4 text-xs text-altina-muted">
                If this takes too long, the link may have expired.{' '}
                <button onClick={() => router.push('/crm/login')} className="text-altina-gold hover:underline">
                  Go back to login
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-altina-muted">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg('') }}
                    required
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 pr-11 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
                    autoFocus
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

              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-altina-muted">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg('') }}
                  required
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-altina-gold px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-altina-muted">
          ALTINA Livings CRM &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
