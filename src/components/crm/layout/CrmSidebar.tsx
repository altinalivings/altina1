'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Building2, MapPin, Clock,
  FileCheck, IndianRupee, Settings, ChevronLeft, ChevronRight, LogOut, Receipt, X
} from 'lucide-react'
import type { Profile } from '@/types/crm'
import { CRM_NAV } from '@/lib/crm/constants'
import { getInitials } from '@/lib/crm/formatters'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useMobileSidebar } from './MobileSidebarContext'

const ICONS: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard, Users, Building2, MapPin, Clock,
  FileCheck, IndianRupee, Settings, Receipt,
}

export default function CrmSidebar({ profile }: { profile: Profile | null }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, close } = useMobileSidebar()

  // Close mobile sidebar on route change
  useEffect(() => {
    close()
  }, [pathname, close])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/crm/login')
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/crm/dashboard" className="text-lg font-bold text-altina-gold">
            ALTINA CRM
          </Link>
        )}
        {/* Close button on mobile, collapse toggle on desktop */}
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              close()
            } else {
              setCollapsed(!collapsed)
            }
          }}
          className="rounded-lg p-1.5 text-altina-muted hover:bg-white/5 hover:text-white"
        >
          <span className="md:hidden"><X size={18} /></span>
          <span className="hidden md:inline">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {CRM_NAV.map((item) => {
          const Icon = ICONS[item.icon]
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-altina-gold/10 text-altina-gold'
                  : 'text-altina-muted hover:bg-white/5 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {Icon && <Icon size={20} className="shrink-0" />}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-altina-gold/20 text-sm font-semibold text-altina-gold">
            {getInitials(profile?.full_name)}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">
                {profile?.full_name || 'User'}
              </p>
              <p className="truncate text-xs capitalize text-altina-muted">
                {profile?.role?.replace('_', ' ') || 'Agent'}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-altina-muted hover:bg-white/5 hover:text-red-400"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside
        className={`hidden md:flex flex-col border-r border-white/10 bg-[#0B0B0C] transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay + drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[#0B0B0C] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
