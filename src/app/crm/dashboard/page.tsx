import { createServerSupabase } from '@/lib/supabase/server'
import { STAGE_LABELS, STAGE_COLORS, LEAD_SOURCES } from '@/lib/crm/constants'
import { formatINRCompact, timeAgo, formatDate, formatTime } from '@/lib/crm/formatters'
import StatsCard from '@/components/crm/ui/StatsCard'
import Badge from '@/components/crm/ui/Badge'
import Timeline from '@/components/crm/ui/Timeline'
import { Users, UserPlus, MapPin, AlertCircle } from 'lucide-react'
import type { LeadStage, LeadSource, LeadActivity, FollowUp, SiteVisit } from '@/types/crm'
import { PipelineChart, SourcePieChart } from './charts'

export const dynamic = 'force-dynamic'

type StageCount = { stage: LeadStage; count: number }
type SourceCount = { source: LeadSource; count: number }

export default async function DashboardPage() {
  const supabase = createServerSupabase()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()
  const tomorrowISO = new Date(today.getTime() + 86_400_000).toISOString()

  // Parallel data fetches
  const [
    totalLeadsRes,
    newTodayRes,
    siteVisitsTodayRes,
    overdueFollowUpsRes,
    leadsByStageRes,
    leadsBySourceRes,
    recentActivityRes,
    todayFollowUpsRes,
    todayVisitsRes,
  ] = await Promise.all([
    // Total leads
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),

    // New leads today
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayISO)
      .lt('created_at', tomorrowISO),

    // Site visits today
    supabase
      .from('site_visits')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_date', todayISO.split('T')[0])
      .lte('scheduled_date', todayISO.split('T')[0])
      .in('status', ['scheduled', 'confirmed']),

    // Overdue follow-ups
    supabase
      .from('follow_ups')
      .select('id', { count: 'exact', head: true })
      .lt('due_date', todayISO.split('T')[0])
      .eq('is_completed', false),

    // Leads by stage
    supabase.rpc('count_leads_by_stage') as unknown as { data: StageCount[] | null; error: unknown },

    // Leads by source
    supabase.rpc('count_leads_by_source') as unknown as { data: SourceCount[] | null; error: unknown },

    // Recent activities
    supabase
      .from('lead_activities')
      .select('id, lead_id, type, title, description, created_at, creator:profiles!lead_activities_created_by_fkey(full_name)')
      .order('created_at', { ascending: false })
      .limit(10),

    // Today's follow-ups
    supabase
      .from('follow_ups')
      .select('id, lead_id, title, type, priority, due_date, due_time, is_completed, lead:leads!follow_ups_lead_id_fkey(name, phone), assigned_user:profiles!follow_ups_assigned_to_fkey(full_name)')
      .gte('due_date', todayISO.split('T')[0])
      .lte('due_date', todayISO.split('T')[0])
      .eq('is_completed', false)
      .order('due_time', { ascending: true })
      .limit(15),

    // Today's visits
    supabase
      .from('site_visits')
      .select('id, lead_id, project_name, scheduled_date, scheduled_time, status, lead:leads!site_visits_lead_id_fkey(name, phone), assigned_user:profiles!site_visits_assigned_to_fkey(full_name)')
      .gte('scheduled_date', todayISO.split('T')[0])
      .lte('scheduled_date', todayISO.split('T')[0])
      .in('status', ['scheduled', 'confirmed'])
      .order('scheduled_time', { ascending: true })
      .limit(15),
  ])

  const totalLeads = totalLeadsRes.count ?? 0
  const newToday = newTodayRes.count ?? 0
  const siteVisitsToday = siteVisitsTodayRes.count ?? 0
  const overdueFollowUps = overdueFollowUpsRes.count ?? 0

  // Build stage data for chart
  const stageData = buildStageData(leadsByStageRes.data)
  const sourceData = buildSourceData(leadsBySourceRes.data)

  const recentActivities = (recentActivityRes.data ?? []) as unknown as LeadActivity[]
  const todayFollowUps = (todayFollowUpsRes.data ?? []) as unknown as (FollowUp & { lead: { name: string; phone: string } })[]
  const todayVisits = (todayVisitsRes.data ?? []) as unknown as (SiteVisit & { lead: { name: string; phone: string } })[]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={<Users size={20} />}
        />
        <StatsCard
          title="New Today"
          value={newToday}
          icon={<UserPlus size={20} />}
        />
        <StatsCard
          title="Site Visits Today"
          value={siteVisitsToday}
          icon={<MapPin size={20} />}
        />
        <StatsCard
          title="Overdue Follow-ups"
          value={overdueFollowUps}
          icon={<AlertCircle size={20} />}
          change={overdueFollowUps > 0 ? `${overdueFollowUps} need attention` : undefined}
          trend={overdueFollowUps > 0 ? 'down' : undefined}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pipeline Chart - takes 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-semibold text-altina-muted uppercase tracking-wider">Lead Pipeline</h2>
          <PipelineChart data={stageData} />
        </div>

        {/* Source Pie Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-semibold text-altina-muted uppercase tracking-wider">Lead Sources</h2>
          <SourcePieChart data={sourceData} />
        </div>
      </div>

      {/* Bottom Row: Activity + Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-semibold text-altina-muted uppercase tracking-wider">Recent Activity</h2>
          <Timeline items={recentActivities} />
        </div>

        {/* Today's Tasks */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-semibold text-altina-muted uppercase tracking-wider">Today&apos;s Tasks</h2>

          {/* Follow-ups Due Today */}
          {todayFollowUps.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-xs font-medium text-altina-gold">Follow-ups ({todayFollowUps.length})</h3>
              <div className="space-y-2">
                {todayFollowUps.map((fu) => (
                  <a
                    key={fu.id}
                    href={`/crm/leads/${fu.lead_id}`}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 transition-colors hover:border-altina-gold/30 hover:bg-white/[0.04]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{fu.title}</p>
                      <p className="truncate text-xs text-altina-muted">
                        {fu.lead?.name} {fu.due_time ? `at ${formatTime(fu.due_time)}` : ''}
                      </p>
                    </div>
                    <Badge label={fu.priority} variant="priority" size="sm" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Visits Today */}
          {todayVisits.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-medium text-altina-gold">Site Visits ({todayVisits.length})</h3>
              <div className="space-y-2">
                {todayVisits.map((v) => (
                  <a
                    key={v.id}
                    href={`/crm/leads/${v.lead_id}`}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 transition-colors hover:border-altina-gold/30 hover:bg-white/[0.04]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {v.lead?.name}
                      </p>
                      <p className="truncate text-xs text-altina-muted">
                        {v.project_name} {v.scheduled_time ? `at ${formatTime(v.scheduled_time)}` : ''}
                      </p>
                    </div>
                    <Badge label={v.status} variant="visit" size="sm" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {todayFollowUps.length === 0 && todayVisits.length === 0 && (
            <p className="py-8 text-center text-sm text-altina-muted">No tasks for today</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Helpers ──

function buildStageData(raw: StageCount[] | null) {
  const stages: LeadStage[] = [
    'new', 'contacted', 'qualified', 'site_visit_scheduled',
    'site_visit_done', 'negotiation', 'booking', 'won', 'lost', 'junk',
  ]

  const map = new Map<string, number>()
  if (raw) {
    for (const r of raw) map.set(r.stage, r.count)
  }

  return stages.map((s) => ({
    stage: s,
    label: STAGE_LABELS[s],
    count: map.get(s) ?? 0,
    fill: stageChartColor(s),
  }))
}

function stageChartColor(stage: LeadStage): string {
  const map: Record<LeadStage, string> = {
    new: '#3B82F6',
    contacted: '#06B6D4',
    qualified: '#10B981',
    site_visit_scheduled: '#8B5CF6',
    site_visit_done: '#A855F7',
    negotiation: '#F59E0B',
    booking: '#EAB308',
    won: '#22C55E',
    lost: '#EF4444',
    junk: '#737373',
  }
  return map[stage]
}

function buildSourceData(raw: SourceCount[] | null) {
  const sourceLabels: Record<string, string> = {}
  for (const s of LEAD_SOURCES) sourceLabels[s.value] = s.label

  if (!raw || raw.length === 0) return []

  const colors = [
    '#C9A227', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
    '#EF4444', '#06B6D4', '#A855F7', '#EC4899', '#6366F1',
    '#14B8A6', '#737373',
  ]

  return raw
    .filter((r) => r.count > 0)
    .map((r, i) => ({
      source: r.source,
      label: sourceLabels[r.source] ?? r.source,
      count: r.count,
      fill: colors[i % colors.length],
    }))
}
