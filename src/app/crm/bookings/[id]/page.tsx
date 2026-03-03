'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Booking, Payment } from '@/types/crm'
import Badge from '@/components/crm/ui/Badge'
import { formatINR, formatDate } from '@/lib/crm/formatters'
import toast from 'react-hot-toast'

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [booking, setBooking] = useState<Booking | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [bookingRes, paymentsRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('*, lead:leads!bookings_lead_id_fkey(name, phone), property:properties!bookings_property_id_fkey(name, city, developer), unit:units!bookings_unit_id_fkey(unit_number, configuration, tower, floor)')
          .eq('id', id)
          .single(),
        supabase.from('payments').select('*').eq('booking_id', id).order('due_date'),
      ])

      if (bookingRes.error) {
        console.error('Failed to load booking:', bookingRes.error)
        toast.error('Failed to load booking: ' + bookingRes.error.message)
      }

      setBooking(bookingRes.data as unknown as Booking)
      setPayments((paymentsRes.data || []) as Payment[])
      setLoading(false)
    }
    fetchData()
  }, [id, supabase])

  const handleStatusChange = async (newStatus: string) => {
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id)
    if (error) { toast.error(error.message); return }

    // Auto-create commissions when booking is approved
    if (newStatus === 'approved' && booking) {
      try {
        const [{ data: leadData }, { data: unitData }, { data: { user } }] = await Promise.all([
          supabase
            .from('leads')
            .select('assigned_to, assigned_user:profiles!leads_assigned_to_fkey(id, full_name, role)')
            .eq('id', booking.lead_id)
            .single(),
          supabase
            .from('units')
            .select('commission_pct')
            .eq('id', booking.unit_id)
            .single(),
          supabase.auth.getUser(),
        ])

        const unitCommPct = unitData?.commission_pct || 2 // fallback to 2% if not set on unit
        const TDS_PCT = 5
        const GST_PCT = 18
        const baseAmount = booking.agreement_value || booking.net_amount

        const createCommission = async (earnerId: string, earnerRole: string, earnerName: string, pct: number) => {
          const commAmount = Math.round(baseAmount * pct / 100)
          const gstOnComm = Math.round(commAmount * GST_PCT / 100)
          const tdsDeducted = Math.round((commAmount + gstOnComm) * TDS_PCT / 100)
          const netPayable = commAmount + gstOnComm - tdsDeducted

          const { error: commErr } = await supabase.from('commissions').insert({
            booking_id: id,
            earner_id: earnerId,
            earner_role: earnerRole,
            base_amount: baseAmount,
            commission_pct: pct,
            commission_amount: commAmount,
            gst_on_commission: gstOnComm,
            tds_deducted: tdsDeducted,
            net_payable: netPayable,
            status: 'pending',
            created_by: user?.id || null,
          })
          if (commErr) {
            console.error(`Failed to create commission for ${earnerName}:`, commErr)
            toast.error(`Commission failed for ${earnerName}: ${commErr.message}`)
          } else {
            toast.success(`${pct}% commission generated for ${earnerName}`)
          }
        }

        // 1. Commission for assigned agent (sales agent)
        const agent = leadData?.assigned_user as unknown as { id: string; full_name: string; role: string } | null
        if (agent) {
          await createCommission(agent.id, agent.role, agent.full_name, unitCommPct)
        } else {
          toast('No assigned agent — agent commission skipped', { icon: '⚠️' })
        }

        // 2. Commission for channel partner (if booking has one)
        if (booking.channel_partner_id) {
          const { data: cpData } = await supabase
            .from('profiles')
            .select('id, full_name, role')
            .eq('id', booking.channel_partner_id)
            .single()
          if (cpData) {
            await createCommission(cpData.id, cpData.role, cpData.full_name, unitCommPct)
          }
        }
      } catch (err) {
        console.error('Commission auto-create error:', err)
      }
    }

    toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)
    setBooking(prev => prev ? { ...prev, status: newStatus as Booking['status'] } : null)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-altina-gold border-t-transparent" /></div>
  if (!booking) return <div className="py-20 text-center text-altina-muted">Booking not found</div>

  const lead = booking.lead as unknown as { name: string; phone: string } | undefined
  const property = booking.property as unknown as { name: string; city: string; developer: string } | undefined
  const unit = booking.unit as unknown as { unit_number: string; configuration: string; tower: string; floor: number } | undefined

  const totalPaid = payments.filter(p => p.status === 'verified' || p.status === 'received').reduce((s, p) => s + p.amount, 0)
  const paidPercent = booking.total_payable > 0 ? (totalPaid / booking.total_payable) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/crm/bookings')} className="rounded-lg p-2 text-altina-muted hover:bg-white/5 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{booking.booking_number}</h1>
            <Badge label={booking.status} variant="booking" size="md" />
          </div>
          <p className="text-sm text-altina-muted">{booking.buyer_name} &bull; {property?.name}</p>
        </div>
        <div className="flex gap-2">
          {booking.status === 'draft' && (
            <button onClick={() => handleStatusChange('pending_approval')} className="flex items-center gap-2 rounded-xl bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400 hover:bg-amber-500/30">
              <FileText size={16} /> Submit for Approval
            </button>
          )}
          {booking.status === 'pending_approval' && (
            <>
              <button onClick={() => handleStatusChange('approved')} className="flex items-center gap-2 rounded-xl bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/30">
                <CheckCircle size={16} /> Approve
              </button>
              <button onClick={() => handleStatusChange('cancelled')} className="flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30">
                <XCircle size={16} /> Reject
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Buyer Details */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-3 text-sm font-semibold text-altina-gold">Buyer Details</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-altina-muted">Name:</span> <span className="text-white">{booking.buyer_name}</span></div>
            <div><span className="text-altina-muted">Phone:</span> <span className="text-white">{booking.buyer_phone}</span></div>
            <div><span className="text-altina-muted">Email:</span> <span className="text-white">{booking.buyer_email || '-'}</span></div>
            <div><span className="text-altina-muted">PAN:</span> <span className="text-white">{booking.buyer_pan || '-'}</span></div>
            {booking.co_applicant_name && (
              <div><span className="text-altina-muted">Co-Applicant:</span> <span className="text-white">{booking.co_applicant_name}</span></div>
            )}
          </div>
        </div>

        {/* Property & Unit */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-3 text-sm font-semibold text-altina-gold">Property & Unit</h3>
          <div className="space-y-2 text-sm">
            <div><span className="text-altina-muted">Property:</span> <span className="text-white">{property?.name}</span></div>
            <div><span className="text-altina-muted">Developer:</span> <span className="text-white">{property?.developer || '-'}</span></div>
            <div><span className="text-altina-muted">City:</span> <span className="text-white">{property?.city || '-'}</span></div>
            <div><span className="text-altina-muted">Unit:</span> <span className="text-white">{unit?.unit_number}</span></div>
            <div><span className="text-altina-muted">Config:</span> <span className="text-white">{unit?.configuration || '-'}</span></div>
            <div><span className="text-altina-muted">Tower/Floor:</span> <span className="text-white">{unit?.tower || '-'} / {unit?.floor ?? '-'}</span></div>
          </div>
        </div>

        {/* Cost Sheet */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-3 text-sm font-semibold text-altina-gold">Cost Sheet</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-altina-muted">Agreement Value</span><span className="text-white">{formatINR(booking.agreement_value)}</span></div>
            {booking.discount > 0 && <div className="flex justify-between"><span className="text-altina-muted">Discount</span><span className="text-red-400">-{formatINR(booking.discount)}</span></div>}
            <div className="flex justify-between border-t border-white/10 pt-1"><span className="text-altina-muted">Net Amount</span><span className="text-white">{formatINR(booking.net_amount)}</span></div>
            {booking.stamp_duty && <div className="flex justify-between"><span className="text-altina-muted">Stamp Duty</span><span className="text-white">{formatINR(booking.stamp_duty)}</span></div>}
            {booking.gst_amount && <div className="flex justify-between"><span className="text-altina-muted">GST</span><span className="text-white">{formatINR(booking.gst_amount)}</span></div>}
            <div className="flex justify-between border-t border-altina-gold/30 pt-2 text-base font-bold"><span className="text-altina-gold">Total Payable</span><span className="text-altina-gold">{formatINR(booking.total_payable)}</span></div>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-altina-gold">Payment Schedule</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-altina-muted">{formatINR(totalPaid)} of {formatINR(booking.total_payable)} ({Math.round(paidPercent)}%)</span>
            <Link href={`/crm/bookings/${id}/payments`} className="text-sm text-altina-gold hover:underline">Manage Payments</Link>
          </div>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-altina-gold transition-all" style={{ width: `${paidPercent}%` }} />
        </div>

        {payments.length > 0 ? (
          <div className="mt-4 space-y-2">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{p.milestone}</p>
                  <p className="text-xs text-altina-muted">Due: {formatDate(p.due_date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">{formatINR(p.amount)}</span>
                  <Badge label={p.status} variant="payment" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-center text-sm text-altina-muted">No payment milestones defined</p>
        )}
      </div>

      {/* KYC Documents */}
      {Array.isArray((booking as unknown as { documents?: unknown[] }).documents) &&
        (booking as unknown as { documents: { type: string; name: string; url: string }[] }).documents.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 text-sm font-semibold text-altina-gold">KYC Documents</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(booking as unknown as { documents: { type: string; name: string; url: string }[] }).documents.map((doc) => (
              <a
                key={doc.type}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm transition-colors hover:border-altina-gold/30 hover:bg-white/[0.05]"
              >
                <FileText size={14} className="shrink-0 text-altina-gold" />
                <span className="min-w-0 flex-1 truncate text-xs text-white">{doc.name}</span>
                <ExternalLink size={12} className="shrink-0 text-altina-muted" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {booking.notes && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-2 text-sm font-semibold text-altina-gold">Notes</h3>
          <p className="text-sm text-altina-muted">{booking.notes}</p>
        </div>
      )}
    </div>
  )
}
