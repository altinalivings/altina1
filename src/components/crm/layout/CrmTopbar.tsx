'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, X } from 'lucide-react'
import Link from 'next/link'
import type { Profile } from '@/types/crm'
import { createClient } from '@/lib/supabase/client'

export default function CrmTopbar({ profile }: { profile: Profile | null }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!profile) return
    const supabase = createClient()
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('is_read', false)
      .then(({ count }) => {
        setUnreadCount(count || 0)
      })
  }, [profile])

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0B0B0C] px-6">
      {/* Left: Breadcrumb/Title */}
      <div className="flex items-center gap-4">
        {searchOpen ? (
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <Search size={16} className="text-altina-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, properties..."
              className="w-64 bg-transparent text-sm text-white outline-none placeholder:text-altina-muted"
              autoFocus
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery('') }}>
              <X size={16} className="text-altina-muted hover:text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-altina-muted transition-colors hover:border-white/20 hover:text-white"
          >
            <Search size={16} />
            <span>Search...</span>
            <kbd className="ml-8 rounded bg-white/10 px-1.5 py-0.5 text-xs">Ctrl+K</kbd>
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Link
          href="/crm/settings"
          className="relative rounded-xl p-2 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User info */}
        <Link
          href="/crm/settings"
          className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-altina-gold/20 text-xs font-semibold text-altina-gold">
            {profile?.full_name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">{profile?.full_name || 'User'}</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
