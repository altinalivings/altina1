'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/types/crm'
import DataTable from '@/components/crm/ui/DataTable'
import Avatar from '@/components/crm/ui/Avatar'
import type { Column } from '@/types/crm'
import toast from 'react-hot-toast'
import { Plus, X, UserPlus, User, Users, KeyRound, Ban, CheckCircle } from 'lucide-react'

export default function TeamPage() {
  const supabase = useMemo(() => createClient(), [])
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [inviteForm, setInviteForm] = useState({ email: '', full_name: '', phone: '', role: 'agent' as UserRole })
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null)
  const [resetTarget, setResetTarget] = useState<{ id: string; name: string } | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [resetting, setResetting] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string } | null>(null)
  const [deactivateReason, setDeactivateReason] = useState('')
  const [deactivating, setDeactivating] = useState(false)

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setUsers((data || []) as Profile[])
      setLoading(false)
    })
  }, [supabase])

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    if (error) { toast.error(error.message); return }
    toast.success('Role updated')
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  const handleDeactivate = async () => {
    if (!deactivateTarget) return
    if (!deactivateReason.trim()) {
      toast.error('Please provide a reason for deactivation')
      return
    }
    setDeactivating(true)
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false, deactivation_reason: deactivateReason.trim() })
      .eq('id', deactivateTarget.id)
    if (error) { toast.error(error.message); setDeactivating(false); return }
    toast.success(`${deactivateTarget.name} has been deactivated`)
    setUsers(prev => prev.map(u => u.id === deactivateTarget.id ? { ...u, is_active: false, deactivation_reason: deactivateReason.trim() } : u))
    setDeactivateTarget(null)
    setDeactivateReason('')
    setDeactivating(false)
  }

  const handleReactivate = async (userId: string, name: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: true, deactivation_reason: null })
      .eq('id', userId)
    if (error) { toast.error(error.message); return }
    toast.success(`${name} has been reactivated`)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: true, deactivation_reason: null } : u))
  }

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.full_name) {
      toast.error('Email and name are required')
      return
    }
    setInviting(true)
    try {
      const res = await fetch('/crm/api/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to create user')
        return
      }
      toast.success('Invite sent!')
      setInvitedEmail(inviteForm.email)
      const { data: refreshed } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers((refreshed || []) as Profile[])
      setInviteForm({ email: '', full_name: '', phone: '', role: 'agent' })
    } catch {
      toast.error('Network error')
    } finally {
      setInviting(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetTarget || !newPassword) return
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setResetting(true)
    try {
      const res = await fetch('/crm/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: resetTarget.id, new_password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to reset password')
        return
      }
      toast.success(`Password reset for ${resetTarget.name}`)
      setResetTarget(null)
      setNewPassword('')
    } catch {
      toast.error('Network error')
    } finally {
      setResetting(false)
    }
  }

  const roles: { value: UserRole; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'agent', label: 'Agent' },
    { value: 'channel_partner', label: 'Channel Partner' },
  ]

  const columns: Column<Profile>[] = [
    {
      key: 'full_name',
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.full_name} size="sm" />
          <div>
            <p className="font-medium text-white">{row.full_name}</p>
            <p className="text-xs text-altina-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (row) => <span className="text-altina-muted">{row.phone || '-'}</span> },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <select
          value={row.role}
          onChange={(e) => handleRoleChange(row.id, e.target.value as UserRole)}
          className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-xs text-white outline-none"
        >
          {roles.map(r => <option key={r.value} value={r.value} className="bg-[#1A1A1C]">{r.label}</option>)}
        </select>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => (
        <div className="flex flex-col items-start gap-1">
          {row.is_active ? (
            <button
              onClick={() => setDeactivateTarget({ id: row.id, name: row.full_name })}
              className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400"
            >
              Active
            </button>
          ) : (
            <div>
              <button
                onClick={() => handleReactivate(row.id, row.full_name)}
                className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-400"
              >
                Inactive
              </button>
              {row.deactivation_reason && (
                <p className="mt-0.5 max-w-[200px] truncate text-[10px] text-red-400/70" title={row.deactivation_reason}>
                  Reason: {row.deactivation_reason}
                </p>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      render: (row) => <span className="text-xs text-altina-muted">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
    {
      key: 'id',
      header: '',
      render: (row) => (
        <button
          onClick={() => { setResetTarget({ id: row.id, name: row.full_name }); setNewPassword('') }}
          className="rounded-lg p-1.5 text-altina-muted transition-colors hover:bg-white/10 hover:text-white"
          title="Reset Password"
        >
          <KeyRound size={14} />
        </button>
      ),
    },
  ]

  const inputClass = 'w-full rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-altina-muted focus:border-altina-gold/50'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Settings Tabs */}
      <div className="flex gap-2">
        <Link
          href="/crm/settings"
          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-altina-muted transition-colors hover:border-altina-gold/30 hover:text-white"
        >
          <User size={16} />
          My Profile
        </Link>
        <div className="flex items-center gap-2 rounded-xl bg-altina-gold/20 px-4 py-2 text-sm font-medium text-altina-gold">
          <Users size={16} />
          Team Management
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-altina-muted">Manage users, roles, and access permissions</p>
        <button
          onClick={() => { setShowInvite(true); setInvitedEmail(null) }}
          className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Deactivate User Modal */}
      {deactivateTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1A1C] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ban size={18} className="text-red-400" />
                <h3 className="text-sm font-semibold text-white">Deactivate User</h3>
              </div>
              <button onClick={() => { setDeactivateTarget(null); setDeactivateReason('') }} className="text-altina-muted hover:text-white">
                <X size={18} />
              </button>
            </div>
            <p className="mb-4 text-sm text-altina-muted">
              Deactivating <span className="font-medium text-white">{deactivateTarget.name}</span> will prevent them from logging in and accessing the CRM.
            </p>
            <div>
              <label className="mb-1.5 block text-xs text-altina-muted">Reason for deactivation *</label>
              <textarea
                value={deactivateReason}
                onChange={e => setDeactivateReason(e.target.value)}
                placeholder="e.g. Left the organization, Contract ended, Performance issues..."
                rows={3}
                className={inputClass + ' resize-none'}
                autoFocus
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleDeactivate}
                disabled={deactivating || !deactivateReason.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/30 disabled:opacity-50"
              >
                <Ban size={14} />
                {deactivating ? 'Deactivating...' : 'Deactivate User'}
              </button>
              <button
                onClick={() => { setDeactivateTarget(null); setDeactivateReason('') }}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/15"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1A1C] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound size={18} className="text-altina-gold" />
                <h3 className="text-sm font-semibold text-white">Reset Password</h3>
              </div>
              <button onClick={() => setResetTarget(null)} className="text-altina-muted hover:text-white">
                <X size={18} />
              </button>
            </div>
            <p className="mb-4 text-sm text-altina-muted">
              Set a new password for <span className="font-medium text-white">{resetTarget.name}</span>
            </p>
            <input
              type="text"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className={inputClass}
              autoFocus
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleResetPassword}
                disabled={resetting || newPassword.length < 6}
                className="flex-1 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {resetting ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                onClick={() => setResetTarget(null)}
                className="rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/15"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Panel */}
      {showInvite && (
        <div className="rounded-2xl border border-altina-gold/30 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus size={18} className="text-altina-gold" />
              <h3 className="text-sm font-semibold text-white">Add New User</h3>
            </div>
            <button onClick={() => { setShowInvite(false); setInvitedEmail(null) }} className="text-altina-muted hover:text-white">
              <X size={18} />
            </button>
          </div>

          {invitedEmail ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <p className="mb-2 text-sm font-medium text-green-400">Invite sent successfully!</p>
                <p className="text-sm text-altina-muted">
                  An email has been sent to <span className="font-medium text-white">{invitedEmail}</span> with a link to set their password and log in.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setInvitedEmail(null)}
                  className="rounded-xl bg-altina-gold px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                >
                  Invite Another
                </button>
                <button
                  onClick={() => { setInvitedEmail(null); setShowInvite(false) }}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-altina-muted">Full Name *</label>
                <input
                  value={inviteForm.full_name}
                  onChange={e => setInviteForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-altina-muted">Email *</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="john@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-altina-muted">Phone</label>
                <input
                  value={inviteForm.phone}
                  onChange={e => setInviteForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-altina-muted">Role *</label>
                <select
                  value={inviteForm.role}
                  onChange={e => setInviteForm(f => ({ ...f, role: e.target.value as UserRole }))}
                  className={inputClass}
                >
                  {roles.map(r => <option key={r.value} value={r.value} className="bg-[#1A1A1C]">{r.label}</option>)}
                </select>
              </div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="flex items-center gap-2 rounded-xl bg-altina-gold px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {inviting ? 'Creating...' : 'Create User'}
                </button>
                <button
                  onClick={() => setShowInvite(false)}
                  className="rounded-xl bg-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/15"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyTitle="No team members"
        emptyDescription="Click 'Add User' to invite your first team member"
      />
    </div>
  )
}
