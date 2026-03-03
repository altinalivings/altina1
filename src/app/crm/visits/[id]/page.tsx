'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, Clock, MapPin, User, Building2,
  Car, Star, CheckCircle2, XCircle, AlertCircle, Eye
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { SiteVisit, VisitStatus } from '@/types/crm'
import { VISIT_STATUS_COLORS } from '@/lib/crm/constants'
import { formatDate, formatTime, formatDateTime, formatEnumLabel, formatPhone, timeAgo } from '@/lib/crm/formatters'
import Badge from '@/components/crm/ui/Badge'
import Avatar from '@/components/crm/ui/Avatar'
import ConfirmDialog from '@/components/crm/ui/ConfirmDialog'
import EmptyState from '@/components/crm/ui/EmptyState'
import toast from 'react-hot-toast'

export default function VisitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [visit, setVisit] = useState<SiteVisit | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Feedback form state
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [interestedUnits, setInterestedUnits] = useState('')
  const [nextAction, setNextAction] = useState('')

  // Cancel dialog
  const [showCancel, setShowCancel] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const fetchVisit = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('site_visits')
        .select(`
          *,
          lead:leads!site_visits_lead_id_fkey(id, name, phone, email, stage),
          property:properties!site_visits_property_id_fkey(id, name, developer, city, location),
          assigned_user:profiles!site_visits_assigned_to_fkey(id, full_name, avatar_url, phone)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setVisit(data)

      // Populate feedback fields if already completed
      if (data.rating) setRating(data.rating)
      if (data.feedback) setFeedbackText(data.feedback)
      if (data.interested_units) setInterestedUnits(data.interested_units.join(', '))
      if (data.next_action) setNextAction(data.next_action)
    } catch (err) {
      console.error('Failed to fetch visit:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, id])

  useEffect(() => {
    if (id) fetchVisit()
  }, [id, fetchVisit])

  const updateStatus = async (status: VisitStatus, extra?: Record<string, unknown>) => {
    setUpdating(true)
    try {
      const updateData: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
        ...extra,
      }

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('site_visits')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      toast.success(`Visit marked as ${formatEnumLabel(status)}`)
      fetchVisit()
    } catch (err) {
      console.error('Failed to update visit:', err)
      toast.error('Failed to update visit status')
    } finally {
      setUpdating(false)
    }
  }

  const handleConfirm = () => updateStatus('confirmed')

  const handleComplete = () => setShowFeedback(true)

  const handleSubmitFeedback = async () => {
    const unitsArr = interestedUnits
      ? interestedUnits.split(',').map(u => u.trim()).filter(Boolean)
      : null

    await updateStatus('completed', {
      rating: rating || null,
      feedback: feedbackText.trim() || null,
      interested_units: unitsArr,
      next_action: nextAction.trim() || null,
    })

    setShowFeedback(false)
  }

  const handleCancel = async () => {
    await updateStatus('cancelled', {
      cancelled_reason: cancelReason.trim() || null,
    })
    setShowCancel(false)
    setCancelReason('')
  }

  const handleNoShow = () => updateStatus('no_show')

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
      </div>
    )
  }

  if (!visit) {
    return (
      <EmptyState
        title="Visit not found"
        description="The site visit you're looking for doesn't exist."
        action={
          <Link
            href="/crm/visits"
            className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black"
          >
            <ArrowLeft size={16} />
            Back to Visits
          </Link>
        }
      />
    )
  }

  const lead = visit.lead as { id?: string; name?: string; phone?: string; email?: string; stage?: string } | null
  const property = visit.property as { id?: string; name?: string; developer?: string; city?: string; location?: string } | null
  const agent = visit.assigned_user as { id?: string; full_name?: string; avatar_url?: string | null; phone?: string } | null

  const canConfirm = visit.status === 'scheduled' || visit.status === 'rescheduled'
  const canComplete = visit.status === 'scheduled' || visit.status === 'confirmed' || visit.status === 'rescheduled'
  const canCancel = visit.status !== 'completed' && visit.status !== 'cancelled'
  const canNoShow = visit.status === 'scheduled' || visit.status === 'confirmed'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push('/crm/visits')}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Site Visit</h1>
              <Badge label={visit.status} variant="visit" size="md" />
            </div>
            <p className="mt-1 text-sm text-altina-muted">
              Scheduled {timeAgo(visit.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Visit Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Lead Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-altina-muted">
            <User size={14} />
            Lead
          </div>
          {lead ? (
            <div>
              <Link
                href={`/crm/leads/${lead.id}`}
                className="text-lg font-semibold text-white hover:text-altina-gold transition-colors"
              >
                {lead.name}
              </Link>
              {lead.phone && (
                <p className="mt-1 text-sm text-altina-muted">
                  <a href={`tel:${lead.phone}`} className="hover:text-altina-gold transition-colors">
                    {formatPhone(lead.phone)}
                  </a>
                </p>
              )}
              {lead.email && (
                <p className="text-sm text-altina-muted">{lead.email}</p>
              )}
              {lead.stage && (
                <div className="mt-2">
                  <Badge label={lead.stage} variant="stage" />
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-altina-muted">Unknown lead</p>
          )}
        </div>

        {/* Property Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-altina-muted">
            <Building2 size={14} />
            Property
          </div>
          {property ? (
            <div>
              <Link
                href={`/crm/properties/${property.id}`}
                className="text-lg font-semibold text-white hover:text-altina-gold transition-colors"
              >
                {property.name}
              </Link>
              {property.developer && (
                <p className="mt-0.5 text-sm text-altina-muted">by {property.developer}</p>
              )}
              {(property.location || property.city) && (
                <p className="mt-1 flex items-center gap-1 text-sm text-altina-muted">
                  <MapPin size={12} />
                  {[property.location, property.city].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-altina-muted">
              {visit.project_name || 'No property selected'}
            </p>
          )}
        </div>
      </div>

      {/* Schedule & Assignment */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-altina-muted">
              <Calendar size={12} />
              Date
            </div>
            <p className="text-sm font-medium text-white">{formatDate(visit.scheduled_date)}</p>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-altina-muted">
              <Clock size={12} />
              Time
            </div>
            <p className="text-sm font-medium text-white">{formatTime(visit.scheduled_time)}</p>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-altina-muted">
              <User size={12} />
              Assigned To
            </div>
            {agent ? (
              <div className="flex items-center gap-2">
                <Avatar name={agent.full_name} src={agent.avatar_url} size="sm" />
                <span className="text-sm font-medium text-white">{agent.full_name}</span>
              </div>
            ) : (
              <p className="text-sm text-altina-muted">Unassigned</p>
            )}
          </div>
        </div>

        {/* Pickup */}
        {visit.pickup_required && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <Car size={16} className="mt-0.5 shrink-0 text-altina-gold" />
            <div>
              <p className="text-sm font-medium text-white">Pickup Required</p>
              {visit.pickup_location && (
                <p className="text-xs text-altina-muted">{visit.pickup_location}</p>
              )}
              {visit.vehicle_details && (
                <p className="text-xs text-altina-muted">{visit.vehicle_details}</p>
              )}
            </div>
          </div>
        )}

        {/* Feedback/Notes */}
        {visit.feedback && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-altina-muted">Notes</p>
            <p className="mt-1 text-sm text-white/80">{visit.feedback}</p>
          </div>
        )}
      </div>

      {/* Status Actions */}
      {(canConfirm || canComplete || canCancel || canNoShow) && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            {canConfirm && (
              <button
                onClick={handleConfirm}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl bg-cyan-500/15 px-4 py-2.5 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/25 disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                Confirm Visit
              </button>
            )}
            {canComplete && (
              <button
                onClick={handleComplete}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl bg-green-500/15 px-4 py-2.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/25 disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                Mark Completed
              </button>
            )}
            {canNoShow && (
              <button
                onClick={handleNoShow}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl bg-orange-500/15 px-4 py-2.5 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/25 disabled:opacity-50"
              >
                <Eye size={16} />
                No Show
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => setShowCancel(true)}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
              >
                <XCircle size={16} />
                Cancel Visit
              </button>
            )}
          </div>
        </div>
      )}

      {/* Feedback (if completed or showing form) */}
      {(visit.status === 'completed' || showFeedback) && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Visit Feedback
          </h3>

          {/* Star Rating */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-altina-muted">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={visit.status === 'completed' && !showFeedback}
                  className="transition-transform hover:scale-110 disabled:cursor-default"
                >
                  <Star
                    size={28}
                    className={
                      (hoverRating || rating) >= star
                        ? 'fill-altina-gold text-altina-gold'
                        : 'text-white/20'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-altina-muted">Feedback</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
              readOnly={visit.status === 'completed' && !showFeedback}
              placeholder="How did the visit go? Client reactions, interests, concerns..."
              className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50 read-only:opacity-60"
            />
          </div>

          {/* Interested Units */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-altina-muted">
              Interested Units <span className="text-altina-muted/50">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={interestedUnits}
              onChange={(e) => setInterestedUnits(e.target.value)}
              readOnly={visit.status === 'completed' && !showFeedback}
              placeholder="e.g. A-1201, A-1502, B-803"
              className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50 read-only:opacity-60"
            />
          </div>

          {/* Next Action */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-altina-muted">Next Action</label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              readOnly={visit.status === 'completed' && !showFeedback}
              placeholder="e.g. Send quotation for A-1201, Schedule 2nd visit"
              className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50 read-only:opacity-60"
            />
          </div>

          {showFeedback && (
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowFeedback(false)}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={updating}
                className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                {updating ? 'Saving...' : 'Complete Visit'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancelled Reason */}
      {visit.status === 'cancelled' && visit.cancelled_reason && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-400">Cancellation Reason</p>
              <p className="mt-1 text-sm text-white/80">{visit.cancelled_reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Completion info */}
      {visit.status === 'completed' && visit.completed_at && (
        <p className="text-xs text-altina-muted">
          Completed {formatDateTime(visit.completed_at)}
        </p>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowCancel(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1A1C] p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-white">Cancel Visit</h3>
            <p className="mt-1 text-sm text-altina-muted">
              Are you sure you want to cancel this visit?
            </p>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Reason <span className="text-altina-muted/50">(optional)</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={2}
                placeholder="Why is this visit being cancelled?"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 placeholder:text-altina-muted/50"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowCancel(false); setCancelReason('') }}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
              >
                Keep Visit
              </button>
              <button
                onClick={handleCancel}
                disabled={updating}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {updating ? 'Cancelling...' : 'Cancel Visit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
