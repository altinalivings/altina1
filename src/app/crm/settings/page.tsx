'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/crm'
import Avatar from '@/components/crm/ui/Avatar'
import toast from 'react-hot-toast'
import { User, Users } from 'lucide-react'

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data as Profile)
        setFullName(data.full_name)
        setPhone(data.phone || '')
      }
      setLoading(false)
    }
    fetchProfile()
  }, [supabase])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName, phone: phone || null }).eq('id', profile.id)
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success('Profile updated')
    setSaving(false)
  }

  if (loading) return <div className="py-20 text-center text-altina-muted">Loading...</div>

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Settings Tabs */}
      <div className="flex gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-altina-gold/20 px-4 py-2 text-sm font-medium text-altina-gold">
          <User size={16} />
          My Profile
        </div>
        {isAdmin && (
          <Link
            href="/crm/settings/team"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-altina-muted transition-colors hover:border-altina-gold/30 hover:text-white"
          >
            <Users size={16} />
            Team Management
          </Link>
        )}
      </div>

      {/* Profile Card */}
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-center gap-4">
            <Avatar name={profile?.full_name} size="lg" />
            <div>
              <p className="text-lg font-semibold text-white">{profile?.full_name}</p>
              <p className="text-sm text-altina-muted">{profile?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-altina-gold/20 px-2 py-0.5 text-xs font-medium capitalize text-altina-gold">
                {profile?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-altina-muted"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 rounded-xl bg-altina-gold px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
