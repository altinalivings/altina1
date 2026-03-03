'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Plus, Calendar as CalendarIcon, List, ChevronLeft, ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { SiteVisit, Column, VisitStatus, FollowUp } from '@/types/crm'
import { VISIT_STATUS_COLORS } from '@/lib/crm/constants'
import { formatDate, formatTime, formatEnumLabel } from '@/lib/crm/formatters'
import DataTable from '@/components/crm/ui/DataTable'
import Badge from '@/components/crm/ui/Badge'
import Tabs from '@/components/crm/ui/Tabs'
import Select from '@/components/crm/ui/Select'
import SearchInput from '@/components/crm/ui/SearchInput'
import EmptyState from '@/components/crm/ui/EmptyState'
import Avatar from '@/components/crm/ui/Avatar'

// Calendar helper functions
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function VisitsPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [visits, setVisits] = useState<SiteVisit[]>([])
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Calendar state
  const now = new Date()
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())

  const fetchVisits = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_visits')
        .select(`
          *,
          lead:leads!site_visits_lead_id_fkey(id, name, phone),
          property:properties!site_visits_property_id_fkey(id, name),
          assigned_user:profiles!site_visits_assigned_to_fkey(id, full_name, avatar_url)
        `)
        .order('scheduled_date', { ascending: false })

      if (error) throw error
      setVisits(data || [])
    } catch (err) {
      console.error('Failed to fetch visits:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchVisits()
  }, [fetchVisits])

  // Fetch follow-ups for calendar
  useEffect(() => {
    const fetchFollowUps = async () => {
      const { data } = await supabase
        .from('follow_ups')
        .select('id, title, due_date, due_time, type, lead:leads!follow_ups_lead_id_fkey(id, name)')
        .eq('is_completed', false)
      setFollowUps((data || []) as unknown as FollowUp[])
    }
    fetchFollowUps()
  }, [supabase])

  // Follow-ups grouped by date for calendar
  const followUpsByDate = useMemo(() => {
    const map: Record<string, FollowUp[]> = {}
    followUps.forEach(fu => {
      const dateKey = fu.due_date.split('T')[0]
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(fu)
    })
    return map
  }, [followUps])

  // Filter
  const filtered = useMemo(() => {
    return visits.filter(v => {
      if (search) {
        const q = search.toLowerCase()
        const leadName = (v.lead as { name?: string } | null)?.name?.toLowerCase() || ''
        const propName = (v.property as { name?: string } | null)?.name?.toLowerCase() || ''
        const projName = v.project_name?.toLowerCase() || ''
        if (!leadName.includes(q) && !propName.includes(q) && !projName.includes(q)) return false
      }
      if (statusFilter && v.status !== statusFilter) return false
      return true
    })
  }, [visits, search, statusFilter])

  const statusOptions: { value: string; label: string }[] = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
    { value: 'rescheduled', label: 'Rescheduled' },
  ]

  // DataTable columns
  const columns: Column<SiteVisit>[] = [
    {
      key: 'lead',
      header: 'Lead',
      render: (row) => {
        const lead = row.lead as { name?: string; phone?: string } | null
        return (
          <div>
            <p className="font-medium text-white">{lead?.name || 'Unknown'}</p>
            {lead?.phone && <p className="text-xs text-altina-muted">{lead.phone}</p>}
          </div>
        )
      },
    },
    {
      key: 'property',
      header: 'Property',
      render: (row) => {
        const prop = row.property as { name?: string } | null
        return (
          <span className="text-altina-muted">{prop?.name || row.project_name || '-'}</span>
        )
      },
    },
    {
      key: 'scheduled_date',
      header: 'Date',
      sortable: true,
      render: (row) => (
        <span className="text-white">{formatDate(row.scheduled_date)}</span>
      ),
    },
    {
      key: 'scheduled_time',
      header: 'Time',
      render: (row) => (
        <span className="text-altina-muted">{formatTime(row.scheduled_time)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge label={row.status} variant="visit" />
      ),
    },
    {
      key: 'assigned_to',
      header: 'Assigned To',
      render: (row) => {
        const user = row.assigned_user as { full_name?: string; avatar_url?: string | null } | null
        if (!user) return <span className="text-altina-muted">-</span>
        return (
          <div className="flex items-center gap-2">
            <Avatar name={user.full_name} src={user.avatar_url} size="sm" />
            <span className="text-sm text-altina-muted">{user.full_name}</span>
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: '',
      width: '80px',
      align: 'right',
      render: (row) => (
        <Link
          href={`/crm/visits/${row.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-medium text-altina-gold hover:underline"
        >
          View
        </Link>
      ),
    },
  ]

  // Calendar: visits grouped by date
  const visitsByDate = useMemo(() => {
    const map: Record<string, SiteVisit[]> = {}
    visits.forEach(v => {
      const dateKey = v.scheduled_date.split('T')[0]
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(v)
    })
    return map
  }, [visits])

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const goToPrevMonth = () => {
    if (calMonth === 0) { setCalYear(calYear - 1); setCalMonth(11) }
    else setCalMonth(calMonth - 1)
  }

  const goToNextMonth = () => {
    if (calMonth === 11) { setCalYear(calYear + 1); setCalMonth(0) }
    else setCalMonth(calMonth + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Visits</h1>
          <p className="mt-1 text-sm text-altina-muted">
            Schedule and track property site visits
          </p>
        </div>
        <Link
          href="/crm/visits/new"
          className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Schedule Visit
        </Link>
      </div>

      {/* View Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={[
            { key: 'list', label: 'List View' },
            { key: 'calendar', label: 'Calendar View' },
          ]}
          active={viewMode}
          onChange={(key) => setViewMode(key as 'list' | 'calendar')}
        />

        {viewMode === 'list' && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-64">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by lead or property..."
              />
            </div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              placeholder="All Statuses"
              className="w-full sm:w-40"
            />
          </div>
        )}
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          onRowClick={(row) => router.push(`/crm/visits/${row.id}`)}
          emptyTitle="No site visits found"
          emptyDescription={search || statusFilter ? 'Try adjusting your filters.' : 'Schedule your first site visit to get started.'}
          emptyAction={
            <Link
              href="/crm/visits/new"
              className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black"
            >
              <Plus size={16} />
              Schedule Visit
            </Link>
          }
        />
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {/* Calendar Header */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={goToPrevMonth}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="text-lg font-semibold text-white">
              {MONTH_NAMES[calMonth]} {calYear}
            </h3>
            <button
              onClick={goToNextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {WEEKDAYS.map(day => (
              <div key={day} className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-altina-muted">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] rounded-xl bg-white/[0.01] p-2" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayVisits = visitsByDate[dateKey] || []
              const dayFollowUps = followUpsByDate[dateKey] || []
              const totalItems = dayVisits.length + dayFollowUps.length
              const isToday = dateKey === todayKey

              return (
                <div
                  key={day}
                  className={`min-h-[80px] rounded-xl border p-2 transition-colors ${
                    isToday
                      ? 'border-altina-gold/30 bg-altina-gold/5'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'text-altina-gold' : 'text-altina-muted'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {/* Visits (blue/green per status) */}
                    {dayVisits.slice(0, 2).map((visit) => {
                      const colors = VISIT_STATUS_COLORS[visit.status]
                      return (
                        <div
                          key={visit.id}
                          onClick={() => router.push(`/crm/visits/${visit.id}`)}
                          className={`cursor-pointer truncate rounded px-1 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}
                          title={`Visit: ${(visit.lead as { name?: string } | null)?.name || 'Visit'} ${formatTime(visit.scheduled_time)}`}
                        >
                          ● {(visit.lead as { name?: string } | null)?.name || 'Visit'}
                        </div>
                      )
                    })}
                    {/* Follow-ups (amber) */}
                    {dayFollowUps.slice(0, 2).map((fu) => (
                      <div
                        key={fu.id}
                        className="cursor-pointer truncate rounded bg-amber-500/15 px-1 py-0.5 text-[10px] font-medium text-amber-400"
                        title={`Follow-up: ${fu.title}`}
                      >
                        ↻ {fu.title}
                      </div>
                    ))}
                    {totalItems > 4 && (
                      <span className="text-[10px] text-altina-muted">
                        +{totalItems - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 border-t border-white/10 pt-4">
            {(Object.entries(VISIT_STATUS_COLORS) as [VisitStatus, { bg: string; text: string }][]).map(([status, colors]) => (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${colors.bg} ${colors.text.replace('text-', 'bg-').replace('/15', '')}`} />
                <span className="text-[11px] text-altina-muted">{formatEnumLabel(status)}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/30" />
              <span className="text-[11px] text-altina-muted">Follow-up</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
