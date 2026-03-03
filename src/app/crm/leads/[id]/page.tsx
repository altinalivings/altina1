'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Phone, MessageCircle, Mail, Calendar, Pencil,
  MapPin, Globe, Smartphone, Monitor, ExternalLink, User, Clock,
  Building2, IndianRupee, Tag, Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Badge from '@/components/crm/ui/Badge'
import Avatar from '@/components/crm/ui/Avatar'
import Tabs from '@/components/crm/ui/Tabs'
import Timeline from '@/components/crm/ui/Timeline'
import EmptyState from '@/components/crm/ui/EmptyState'
import LeadScoreBadge from '@/components/crm/leads/LeadScoreBadge'
import LeadStageSelector from '@/components/crm/leads/LeadStageSelector'
import {
  formatPhone, timeAgo, formatDate, formatDateTime, formatINR, formatEnumLabel, getInitials,
} from '@/lib/crm/formatters'
import type { Lead, LeadActivity, LeadStage, SiteVisit, FollowUp } from '@/types/crm'
import toast from 'react-hot-toast'

type DetailTab = 'overview' | 'timeline' | 'visits' | 'followups'

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const leadId = params.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [activities, setActivities] = useState<LeadActivity[]>([])
  const [visits, setVisits] = useState<SiteVisit[]>([])
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')
  const [stageChanging, setStageChanging] = useState(false)

  const fetchLead = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, assigned_user:profiles!leads_assigned_to_fkey(*), channel_partner:profiles!leads_channel_partner_id_fkey(*)')
        .eq('id', leadId)
        .single()

      if (error) throw error
      setLead(data as Lead)
    } catch (err) {
      console.error('Failed to fetch lead:', err)
      toast.error('Failed to load lead details')
      router.push('/crm/leads')
    }
  }, [supabase, leadId, router])

  const fetchActivities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('lead_activities')
        .select('*, creator:profiles!lead_activities_created_by_fkey(*)')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setActivities((data as LeadActivity[]) || [])
    } catch (err) {
      console.error('Failed to fetch activities:', err)
    }
  }, [supabase, leadId])

  const fetchVisits = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_visits')
        .select('*, assigned_user:profiles!site_visits_assigned_to_fkey(*), property:properties(*)')
        .eq('lead_id', leadId)
        .order('scheduled_date', { ascending: false })

      if (error) throw error
      setVisits((data as SiteVisit[]) || [])
    } catch (err) {
      console.error('Failed to fetch visits:', err)
    }
  }, [supabase, leadId])

  const fetchFollowUps = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('follow_ups')
        .select('*, assigned_user:profiles!follow_ups_assigned_to_fkey(*)')
        .eq('lead_id', leadId)
        .order('due_date', { ascending: false })

      if (error) throw error
      setFollowUps((data as FollowUp[]) || [])
    } catch (err) {
      console.error('Failed to fetch follow-ups:', err)
    }
  }, [supabase, leadId])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([fetchLead(), fetchActivities(), fetchVisits(), fetchFollowUps()])
      setLoading(false)
    }
    init()
  }, [fetchLead, fetchActivities, fetchVisits, fetchFollowUps])

  const handleStageChange = useCallback(
    async (newStage: LeadStage) => {
      if (!lead || newStage === lead.stage) return
      setStageChanging(true)

      try {
        const oldStage = lead.stage

        const { error: updateErr } = await supabase
          .from('leads')
          .update({ stage: newStage, updated_at: new Date().toISOString() })
          .eq('id', leadId)

        if (updateErr) throw updateErr

        const { data: userData } = await supabase.auth.getUser()

        await supabase.from('lead_activities').insert({
          lead_id: leadId,
          type: 'stage_change',
          title: `Stage changed from ${formatEnumLabel(oldStage)} to ${formatEnumLabel(newStage)}`,
          old_stage: oldStage,
          new_stage: newStage,
          created_by: userData.user?.id || null,
        })

        setLead((prev) => (prev ? { ...prev, stage: newStage } : null))
        toast.success(`Stage updated to ${formatEnumLabel(newStage)}`)
        fetchActivities()
      } catch (err) {
        console.error('Stage change failed:', err)
        toast.error('Failed to change stage')
      } finally {
        setStageChanging(false)
      }
    },
    [lead, leadId, supabase, fetchActivities]
  )

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-altina-gold" />
      </div>
    )
  }

  if (!lead) return null

  const phoneClean = lead.phone.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/91${phoneClean.length === 10 ? phoneClean : phoneClean.slice(-10)}`
  const mailtoUrl = lead.email ? `mailto:${lead.email}` : null

  const tabItems = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Timeline', count: activities.length },
    { key: 'visits', label: 'Visits', count: visits.length },
    { key: 'followups', label: 'Follow-ups', count: followUps.length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/crm/leads"
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
            <Badge label={lead.stage} variant="stage" size="md" />
            <Badge label={lead.quality} variant="quality" size="md" />
            <LeadScoreBadge score={lead.score} size="md" />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-altina-muted">
            <span className="flex items-center gap-1">
              <Phone size={13} />
              {formatPhone(lead.phone)}
            </span>
            {lead.email && (
              <span className="flex items-center gap-1">
                <Mail size={13} />
                {lead.email}
              </span>
            )}
            {lead.project_name && (
              <span className="flex items-center gap-1">
                <Building2 size={13} />
                {lead.project_name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons + Stage Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`tel:${lead.phone}`}
          className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
        >
          <Phone size={15} />
          Call
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          <MessageCircle size={15} />
          WhatsApp
        </a>
        {mailtoUrl && (
          <a
            href={mailtoUrl}
            className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            <Mail size={15} />
            Email
          </a>
        )}
        <Link
          href={`/crm/visits?lead_id=${leadId}`}
          className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
        >
          <Calendar size={15} />
          Schedule Visit
        </Link>
        <Link
          href={`/crm/leads/${leadId}/edit`}
          className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
        >
          <Pencil size={15} />
          Edit
        </Link>

        <div className="ml-auto">
          <LeadStageSelector
            value={lead.stage}
            onChange={handleStageChange}
            disabled={stageChanging}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabItems}
        active={activeTab}
        onChange={(key) => setActiveTab(key as DetailTab)}
      />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Contact Details */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
              <User size={16} className="text-altina-gold" />
              Contact Details
            </h3>
            <dl className="space-y-3">
              <DetailRow label="Full Name" value={lead.name} />
              <DetailRow label="Phone" value={formatPhone(lead.phone)} />
              {lead.alternate_phone && (
                <DetailRow label="Alt. Phone" value={formatPhone(lead.alternate_phone)} />
              )}
              <DetailRow label="Email" value={lead.email || '-'} />
              <DetailRow label="Created" value={formatDateTime(lead.created_at)} />
              <DetailRow label="Last Contacted" value={lead.last_contacted_at ? timeAgo(lead.last_contacted_at) : 'Never'} />
              <DetailRow label="Next Follow-up" value={lead.next_follow_up ? formatDate(lead.next_follow_up) : 'Not set'} />
              <DetailRow label="Follow-up Count" value={String(lead.follow_up_count)} />
              <DetailRow label="Site Visit Count" value={String(lead.site_visit_count)} />
            </dl>
          </div>

          {/* Interest & Budget */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
              <IndianRupee size={16} className="text-altina-gold" />
              Interest &amp; Budget
            </h3>
            <dl className="space-y-3">
              <DetailRow
                label="Budget Range"
                value={
                  lead.budget_min || lead.budget_max
                    ? `${formatINR(lead.budget_min)} - ${formatINR(lead.budget_max)}`
                    : '-'
                }
              />
              <DetailRow label="Preferred Location" value={lead.preferred_location || '-'} />
              <DetailRow label="Configuration" value={lead.preferred_config || '-'} />
              <DetailRow label="Property Type" value={lead.property_type ? formatEnumLabel(lead.property_type) : '-'} />
              <DetailRow label="Project" value={lead.project_name || '-'} />
              {lead.notes && <DetailRow label="Notes" value={lead.notes} />}
            </dl>
          </div>

          {/* Attribution */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
              <Globe size={16} className="text-altina-gold" />
              Attribution
            </h3>
            <dl className="space-y-3">
              <DetailRow label="Source" value={formatEnumLabel(lead.source)} />
              {lead.source_detail && <DetailRow label="Source Detail" value={lead.source_detail} />}
              {lead.utm_source && <DetailRow label="UTM Source" value={lead.utm_source} />}
              {lead.utm_medium && <DetailRow label="UTM Medium" value={lead.utm_medium} />}
              {lead.utm_campaign && <DetailRow label="UTM Campaign" value={lead.utm_campaign} />}
              {lead.utm_term && <DetailRow label="UTM Term" value={lead.utm_term} />}
              {lead.utm_content && <DetailRow label="UTM Content" value={lead.utm_content} />}
              {lead.gclid && <DetailRow label="GCLID" value={lead.gclid} />}
              {lead.fbclid && <DetailRow label="FBCLID" value={lead.fbclid} />}
              {lead.msclkid && <DetailRow label="MSCLKID" value={lead.msclkid} />}
              {lead.landing_page && (
                <DetailRow
                  label="Landing Page"
                  value={
                    <a
                      href={lead.landing_page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-altina-gold hover:underline"
                    >
                      {new URL(lead.landing_page).pathname}
                      <ExternalLink size={12} />
                    </a>
                  }
                />
              )}
              {lead.referrer && <DetailRow label="Referrer" value={lead.referrer} />}
              {lead.device_type && (
                <DetailRow
                  label="Device"
                  value={
                    <span className="flex items-center gap-1.5">
                      {lead.device_type === 'mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                      {formatEnumLabel(lead.device_type)}
                    </span>
                  }
                />
              )}
              {lead.session_id && <DetailRow label="Session ID" value={lead.session_id} />}
              {lead.ga_cid && <DetailRow label="GA Client ID" value={lead.ga_cid} />}
            </dl>
          </div>

          {/* Assignment */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
              <Tag size={16} className="text-altina-gold" />
              Assignment &amp; Meta
            </h3>
            <dl className="space-y-3">
              <DetailRow
                label="Assigned To"
                value={
                  lead.assigned_user ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={lead.assigned_user.full_name} src={lead.assigned_user.avatar_url} size="sm" />
                      <span>{lead.assigned_user.full_name}</span>
                    </div>
                  ) : (
                    'Unassigned'
                  )
                }
              />
              {lead.assigned_at && <DetailRow label="Assigned At" value={formatDateTime(lead.assigned_at)} />}
              {lead.channel_partner && (
                <DetailRow
                  label="Channel Partner"
                  value={
                    <div className="flex items-center gap-2">
                      <Avatar name={lead.channel_partner.full_name} src={lead.channel_partner.avatar_url} size="sm" />
                      <span>{lead.channel_partner.full_name}</span>
                    </div>
                  }
                />
              )}
              <DetailRow label="Quality" value={formatEnumLabel(lead.quality)} />
              <DetailRow label="Score" value={String(lead.score)} />
              {lead.lost_reason && <DetailRow label="Lost Reason" value={lead.lost_reason} />}
              {lead.tags?.length > 0 && (
                <DetailRow
                  label="Tags"
                  value={
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-altina-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  }
                />
              )}
              {lead.form_mode && <DetailRow label="Form Mode" value={lead.form_mode} />}
            </dl>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <Timeline items={activities} />
        </div>
      )}

      {activeTab === 'visits' && (
        <div className="space-y-4">
          {visits.length === 0 ? (
            <EmptyState
              title="No site visits"
              description="No visits have been scheduled for this lead."
              action={
                <Link
                  href={`/crm/visits?lead_id=${leadId}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2 text-sm font-semibold text-black"
                >
                  <Calendar size={16} />
                  Schedule Visit
                </Link>
              }
            />
          ) : (
            visits.map((visit) => (
              <div
                key={visit.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">
                        {visit.project_name || visit.property?.name || 'Site Visit'}
                      </h4>
                      <Badge label={visit.status} variant="visit" />
                    </div>
                    <p className="mt-1 text-sm text-altina-muted">
                      <Calendar size={13} className="mr-1 inline" />
                      {formatDate(visit.scheduled_date)}
                      {visit.scheduled_time && ` at ${visit.scheduled_time}`}
                    </p>
                  </div>
                  {visit.assigned_user && (
                    <div className="flex items-center gap-2">
                      <Avatar name={visit.assigned_user.full_name} src={visit.assigned_user.avatar_url} size="sm" />
                      <span className="text-xs text-altina-muted">{visit.assigned_user.full_name}</span>
                    </div>
                  )}
                </div>
                {visit.feedback && (
                  <p className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-altina-muted">
                    {visit.feedback}
                  </p>
                )}
                {visit.rating != null && (
                  <div className="mt-2 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < visit.rating! ? 'text-altina-gold' : 'text-white/20'}`}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'followups' && (
        <div className="space-y-4">
          {followUps.length === 0 ? (
            <EmptyState
              title="No follow-ups"
              description="No follow-ups have been scheduled for this lead."
            />
          ) : (
            followUps.map((fu) => (
              <div
                key={fu.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{fu.title}</h4>
                      <Badge label={fu.priority} variant="priority" />
                      {fu.is_completed && (
                        <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] font-medium text-green-400">
                          Completed
                        </span>
                      )}
                    </div>
                    {fu.description && (
                      <p className="mt-1 text-sm text-altina-muted">{fu.description}</p>
                    )}
                    <p className="mt-1 text-xs text-altina-muted">
                      <Clock size={12} className="mr-1 inline" />
                      Due: {formatDate(fu.due_date)}
                      {fu.due_time && ` at ${fu.due_time}`}
                    </p>
                  </div>
                  {fu.assigned_user && (
                    <div className="flex items-center gap-2">
                      <Avatar name={fu.assigned_user.full_name} src={fu.assigned_user.avatar_url} size="sm" />
                      <span className="text-xs text-altina-muted">{fu.assigned_user.full_name}</span>
                    </div>
                  )}
                </div>
                {fu.outcome && (
                  <p className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-altina-muted">
                    Outcome: {fu.outcome}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

/* Reusable detail row */
function DetailRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-sm text-altina-muted">{label}</dt>
      <dd className="text-right text-sm text-white">{value}</dd>
    </div>
  )
}
