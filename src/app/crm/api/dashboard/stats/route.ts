import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import type { DashboardStats, LeadStage, LeadSource } from '@/types/crm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServerSupabase()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()
    const tomorrowISO = new Date(today.getTime() + 86_400_000).toISOString()

    // Start of week (Monday)
    const dayOfWeek = today.getDay()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - ((dayOfWeek + 6) % 7))
    const weekStartISO = weekStart.toISOString()

    // Parallel queries
    const [
      totalLeadsRes,
      newTodayRes,
      newThisWeekRes,
      allLeadsRes,
      todayVisitsRes,
      todayFollowUpsRes,
      overdueFollowUpsRes,
      totalBookingsRes,
      totalRevenueRes,
    ] = await Promise.all([
      // Total active leads
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

      // New leads this week
      supabase
        .from('leads')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStartISO),

      // All active leads (stage + source for counting)
      supabase
        .from('leads')
        .select('stage, source')
        .eq('is_active', true),

      // Site visits today
      supabase
        .from('site_visits')
        .select('id', { count: 'exact', head: true })
        .eq('scheduled_date', todayISO.split('T')[0])
        .in('status', ['scheduled', 'confirmed']),

      // Follow-ups due today
      supabase
        .from('follow_ups')
        .select('id', { count: 'exact', head: true })
        .eq('due_date', todayISO.split('T')[0])
        .eq('is_completed', false),

      // Overdue follow-ups
      supabase
        .from('follow_ups')
        .select('id', { count: 'exact', head: true })
        .lt('due_date', todayISO.split('T')[0])
        .eq('is_completed', false),

      // Total bookings (non-cancelled)
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .not('status', 'in', '("cancelled","refunded")'),

      // Total revenue from bookings
      supabase
        .from('bookings')
        .select('net_amount')
        .in('status', ['approved', 'agreement_sent', 'agreement_signed', 'registered']),
    ])

    // Build leadsByStage map from raw leads
    const stages: LeadStage[] = [
      'new', 'contacted', 'qualified', 'site_visit_scheduled',
      'site_visit_done', 'negotiation', 'booking', 'won', 'lost', 'junk',
    ]
    const leadsByStage = {} as Record<LeadStage, number>
    for (const s of stages) leadsByStage[s] = 0

    // Build leadsBySource map
    const sources: LeadSource[] = [
      'website', 'google_ads', 'facebook', 'instagram', 'linkedin',
      'referral', 'walk_in', 'cold_call', 'channel_partner',
      'property_portal', 'whatsapp', 'other',
    ]
    const leadsBySource = {} as Record<LeadSource, number>
    for (const s of sources) leadsBySource[s] = 0

    // Count from raw leads data
    for (const lead of (allLeadsRes.data ?? [])) {
      if (lead.stage in leadsByStage) {
        leadsByStage[lead.stage as LeadStage]++
      }
      if (lead.source && lead.source in leadsBySource) {
        leadsBySource[lead.source as LeadSource]++
      }
    }

    // Total revenue
    const totalRevenue = (totalRevenueRes.data ?? []).reduce(
      (sum, b) => sum + (b.net_amount || 0),
      0
    )

    const stats: DashboardStats = {
      totalLeads: totalLeadsRes.count ?? 0,
      newLeadsToday: newTodayRes.count ?? 0,
      newLeadsThisWeek: newThisWeekRes.count ?? 0,
      newLeadsThisMonth: 0, // Computed below
      leadsInPipeline: 0,
      qualifiedLeads: leadsByStage.qualified ?? 0,
      conversionRate: 0,
      totalBookings: totalBookingsRes.count ?? 0,
      bookingsThisMonth: 0,
      totalRevenue,
      revenueThisMonth: 0,
      pendingPayments: 0,
      overduePayments: 0,
      todayVisits: todayVisitsRes.count ?? 0,
      todayFollowUps: todayFollowUpsRes.count ?? 0,
      overdueFollowUps: overdueFollowUpsRes.count ?? 0,
      leadsByStage,
      leadsBySource,
    }

    // Derived: leads in pipeline = all active stages (not won/lost/junk)
    stats.leadsInPipeline =
      (leadsByStage.new ?? 0) +
      (leadsByStage.contacted ?? 0) +
      (leadsByStage.qualified ?? 0) +
      (leadsByStage.site_visit_scheduled ?? 0) +
      (leadsByStage.site_visit_done ?? 0) +
      (leadsByStage.negotiation ?? 0) +
      (leadsByStage.booking ?? 0)

    // Conversion rate: won / (won + lost) * 100
    const wonCount = leadsByStage.won ?? 0
    const lostCount = leadsByStage.lost ?? 0
    stats.conversionRate = wonCount + lostCount > 0
      ? Math.round((wonCount / (wonCount + lostCount)) * 10000) / 100
      : 0

    return NextResponse.json(stats)
  } catch (err) {
    console.error('Dashboard stats error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
