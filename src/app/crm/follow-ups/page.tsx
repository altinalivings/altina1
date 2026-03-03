'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  Clock, Plus, CheckCircle2, AlertTriangle, CalendarClock,
  Phone, Mail, MessageSquare, MapPin, Users, Save, X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { FollowUp, FollowUpPriority, ActivityType, Lead, Profile } from '@/types/crm'
import { PRIORITY_COLORS } from '@/lib/crm/constants'
import { formatDate, formatTime, formatEnumLabel, timeAgo } from '@/lib/crm/formatters'
import Badge from '@/components/crm/ui/Badge'
import Avatar from '@/components/crm/ui/Avatar'
import Select from '@/components/crm/ui/Select'
import EmptyState from '@/components/crm/ui/EmptyState'
import toast from 'react-hot-toast'

const FOLLOW_UP_TYPE_ICONS: Record<string, React.ReactNode> = {
  call: <Phone size={14} />,
  email: <Mail size={14} />,
  whatsapp: <MessageSquare size={14} />,
  meeting: <Users size={14} />,
  site_visit: <MapPin size={14} />,
  follow_up: <CalendarClock size={14} />,
  note: <Clock size={14} />,
}

export default function FollowUpsPage() {
  const supabase = useMemo(() => createClient(), [])

  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  // Inline form state
  const [leads, setLeads] = useState<{ id: string; name: string }[]>([])
  const [agents, setAgents] = useState<{ id: string; full_name: string }[]>([])
  const [newForm, setNewForm] = useState({
    lead_id: '',
    type: 'follow_up' as ActivityType,
    title: '',
    description: '',
    priority: 'medium' as FollowUpPriority,
    due_date: '',
    due_time: '',
    assigned_to: '',
  })
  const [saving, setSaving] = useState(false)

  const fetchFollowUps = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('follow_ups')
        .select(`
          *,
          lead:leads!follow_ups_lead_id_fkey(id, name, phone),
          assigned_user:profiles!follow_ups_assigned_to_fkey(id, full_name, avatar_url)
        `)
        .eq('is_completed', false)
        .order('due_date', { ascending: true })

      if (error) throw error
      setFollowUps(data || [])
    } catch (err) {
      console.error('Failed to fetch follow-ups:', err)
      toast.error('Failed to load follow-ups')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchFollowUps()
  }, [fetchFollowUps])

  // Fetch leads and agents for inline form
  useEffect(() => {
    if (!showAddForm) return
    const fetchOptions = async () => {
      const [leadsRes, agentsRes] = await Promise.all([
        supabase.from('leads').select('id, name').eq('is_active', true).order('name').limit(200),
        supabase.from('profiles').select('id, full_name').eq('is_active', true).order('full_name'),
      ])
      setLeads(leadsRes.data || [])
      setAgents(agentsRes.data || [])
    }
    fetchOptions()
  }, [showAddForm, supabase])

  // Categorize follow-ups
  const { overdue, today, upcoming } = useMemo(() => {
    const now = new Date()
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const overdue: FollowUp[] = []
    const today: FollowUp[] = []
    const upcoming: FollowUp[] = []

    followUps.forEach(fu => {
      const dueDate = fu.due_date.split('T')[0]
      if (dueDate < todayStr) {
        overdue.push(fu)
      } else if (dueDate === todayStr) {
        today.push(fu)
      } else {
        upcoming.push(fu)
      }
    })

    return { overdue, today, upcoming }
  }, [followUps])

  const markComplete = async (followUp: FollowUp) => {
    try {
      const { error } = await supabase
        .from('follow_ups')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', followUp.id)

      if (error) throw error

      toast.success('Follow-up completed')
      setFollowUps(prev => prev.filter(fu => fu.id !== followUp.id))
    } catch (err) {
      console.error('Failed to complete follow-up:', err)
      toast.error('Failed to complete follow-up')
    }
  }

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newForm.lead_id) {
      toast.error('Please select a lead')
      return
    }
    if (!newForm.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!newForm.due_date) {
      toast.error('Due date is required')
      return
    }
    if (!newForm.assigned_to) {
      toast.error('Please assign to someone')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.from('follow_ups').insert({
        lead_id: newForm.lead_id,
        type: newForm.type,
        title: newForm.title.trim(),
        description: newForm.description.trim() || null,
        priority: newForm.priority,
        due_date: newForm.due_date,
        due_time: newForm.due_time || null,
        assigned_to: newForm.assigned_to,
        is_completed: false,
        reminder_sent: false,
      })

      if (error) throw error

      toast.success('Follow-up added')
      setShowAddForm(false)
      setNewForm({
        lead_id: '',
        type: 'follow_up',
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        due_time: '',
        assigned_to: '',
      })
      fetchFollowUps()
    } catch (err) {
      console.error('Failed to add follow-up:', err)
      toast.error('Failed to add follow-up')
    } finally {
      setSaving(false)
    }
  }

  const leadOptions = useMemo(() =>
    leads.map(l => ({ value: l.id, label: l.name })),
    [leads]
  )

  const agentOptions = useMemo(() =>
    agents.map(a => ({ value: a.id, label: a.full_name })),
    [agents]
  )

  const typeOptions: { value: string; label: string }[] = [
    { value: 'follow_up', label: 'Follow Up' },
    { value: 'call', label: 'Call' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'site_visit', label: 'Site Visit' },
    { value: 'note', label: 'Note' },
  ]

  const priorityOptions: { value: string; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ]

  const renderFollowUpCard = (followUp: FollowUp, section: 'overdue' | 'today' | 'upcoming') => {
    const lead = followUp.lead as { id?: string; name?: string; phone?: string } | null
    const agent = followUp.assigned_user as { id?: string; full_name?: string; avatar_url?: string | null } | null
    const icon = FOLLOW_UP_TYPE_ICONS[followUp.type] || <Clock size={14} />

    return (
      <div
        key={followUp.id}
        className={`group flex items-start gap-4 rounded-2xl border p-4 transition-colors ${
          section === 'overdue'
            ? 'border-red-500/20 bg-red-500/[0.03] hover:bg-red-500/[0.06]'
            : section === 'today'
            ? 'border-amber-500/20 bg-amber-500/[0.03] hover:bg-amber-500/[0.06]'
            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.05]'
        }`}
      >
        {/* Checkbox */}
        <button
          onClick={() => markComplete(followUp)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            section === 'overdue'
              ? 'border-red-500/50 hover:bg-red-500/20'
              : section === 'today'
              ? 'border-amber-500/50 hover:bg-amber-500/20'
              : 'border-white/30 hover:bg-white/10'
          }`}
          title="Mark as completed"
        >
          <CheckCircle2
            size={12}
            className="opacity-0 transition-opacity group-hover:opacity-100 text-green-400"
          />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="shrink-0 text-altina-muted">{icon}</span>
              <h4 className="truncate text-sm font-medium text-white">
                {followUp.title}
              </h4>
            </div>
            <Badge label={followUp.priority} variant="priority" />
          </div>

          {/* Lead Name */}
          {lead && (
            <Link
              href={`/crm/leads/${lead.id}`}
              className="mt-1 inline-block text-sm text-altina-gold hover:underline"
            >
              {lead.name}
            </Link>
          )}

          {/* Description */}
          {followUp.description && (
            <p className="mt-1 text-xs text-altina-muted line-clamp-2">
              {followUp.description}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-altina-muted">
            <span className="flex items-center gap-1">
              <CalendarClock size={12} />
              {formatDate(followUp.due_date)}
              {followUp.due_time && ` at ${formatTime(followUp.due_time)}`}
            </span>
            {agent && (
              <span className="flex items-center gap-1.5">
                <Avatar name={agent.full_name} src={agent.avatar_url} size="sm" />
                {agent.full_name}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Follow-ups</h1>
          <p className="mt-1 text-sm text-altina-muted">
            Track and manage your follow-up tasks
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? 'Close' : 'Add Follow-up'}
        </button>
      </div>

      {/* Inline Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddFollowUp}
          className="rounded-2xl border border-altina-gold/20 bg-altina-gold/[0.03] p-6"
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-gold">
            New Follow-up
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Lead"
              value={newForm.lead_id}
              onChange={(v) => setNewForm(prev => ({ ...prev, lead_id: v }))}
              options={leadOptions}
              placeholder="Select lead..."
              required
            />
            <Select
              label="Assigned To"
              value={newForm.assigned_to}
              onChange={(v) => setNewForm(prev => ({ ...prev, assigned_to: v }))}
              options={agentOptions}
              placeholder="Select agent..."
              required
            />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newForm.title}
                onChange={(e) => setNewForm(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="e.g. Follow up on quotation sent"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <Select
              label="Type"
              value={newForm.type}
              onChange={(v) => setNewForm(prev => ({ ...prev, type: v as ActivityType }))}
              options={typeOptions}
              placeholder="Select type..."
            />
            <Select
              label="Priority"
              value={newForm.priority}
              onChange={(v) => setNewForm(prev => ({ ...prev, priority: v as FollowUpPriority }))}
              options={priorityOptions}
              placeholder="Select priority..."
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Due Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={newForm.due_date}
                onChange={(e) => setNewForm(prev => ({ ...prev, due_date: e.target.value }))}
                required
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Due Time</label>
              <input
                type="time"
                value={newForm.due_time}
                onChange={(e) => setNewForm(prev => ({ ...prev, due_time: e.target.value }))}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 [color-scheme:dark]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Description</label>
              <textarea
                value={newForm.description}
                onChange={(e) => setNewForm(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                placeholder="Any additional details..."
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Add Follow-up'}
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="h-5 w-5 animate-pulse rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && followUps.length === 0 && (
        <EmptyState
          title="No pending follow-ups"
          description="All caught up! Add a follow-up to stay on track with your leads."
          icon={<CheckCircle2 size={48} strokeWidth={1} className="text-green-400" />}
          action={
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black"
            >
              <Plus size={16} />
              Add Follow-up
            </button>
          }
        />
      )}

      {/* Sections */}
      {!loading && followUps.length > 0 && (
        <div className="space-y-8">
          {/* Overdue */}
          {overdue.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400">
                  Overdue
                </h2>
                <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
                  {overdue.length}
                </span>
              </div>
              <div className="space-y-2">
                {overdue.map(fu => renderFollowUpCard(fu, 'overdue'))}
              </div>
            </section>
          )}

          {/* Today */}
          {today.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <CalendarClock size={16} className="text-amber-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  Today
                </h2>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  {today.length}
                </span>
              </div>
              <div className="space-y-2">
                {today.map(fu => renderFollowUpCard(fu, 'today'))}
              </div>
            </section>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Clock size={16} className="text-altina-muted" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-altina-muted">
                  Upcoming
                </h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-altina-muted">
                  {upcoming.length}
                </span>
              </div>
              <div className="space-y-2">
                {upcoming.map(fu => renderFollowUpCard(fu, 'upcoming'))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
