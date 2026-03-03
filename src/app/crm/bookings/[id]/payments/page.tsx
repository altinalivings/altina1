'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Check, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Payment } from '@/types/crm'
import Badge from '@/components/crm/ui/Badge'
import { formatINR, formatDate } from '@/lib/crm/formatters'
import toast from 'react-hot-toast'

export default function BookingPaymentsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [milestone, setMilestone] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [mode, setMode] = useState('')
  const [transactionRef, setTransactionRef] = useState('')
  const [bankName, setBankName] = useState('')
  const [paidDate, setPaidDate] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchPayments = async () => {
    const { data } = await supabase.from('payments').select('*').eq('booking_id', id).order('due_date')
    setPayments((data || []) as Payment[])
    setLoading(false)
  }

  useEffect(() => { fetchPayments() }, [id])

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await supabase.from('payments').insert({
      booking_id: id,
      milestone,
      amount: Number(amount),
      due_date: dueDate || null,
      paid_date: paidDate || null,
      status: paidDate ? 'received' : 'pending',
      mode: mode || null,
      transaction_ref: transactionRef || null,
      bank_name: bankName || null,
      notes: notes || null,
    })
    if (error) { toast.error(error.message); setSubmitting(false); return }
    toast.success('Payment added')
    setShowForm(false)
    setMilestone(''); setAmount(''); setDueDate(''); setMode(''); setTransactionRef(''); setBankName(''); setPaidDate(''); setNotes('')
    setSubmitting(false)
    fetchPayments()
  }

  const handleVerify = async (paymentId: string) => {
    const { error } = await supabase.from('payments').update({ status: 'verified', verified_at: new Date().toISOString() }).eq('id', paymentId)
    if (error) { toast.error(error.message); return }
    toast.success('Payment verified')
    fetchPayments()
  }

  const handleMarkReceived = async (paymentId: string) => {
    const { error } = await supabase.from('payments').update({ status: 'received', paid_date: new Date().toISOString().split('T')[0] }).eq('id', paymentId)
    if (error) { toast.error(error.message); return }
    toast.success('Payment marked as received')
    fetchPayments()
  }

  const inputClass = 'w-full rounded-xl border border-white/15 bg-transparent px-4 py-2.5 text-sm text-white outline-none focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50'

  const paymentModes = [
    { value: 'cheque', label: 'Cheque' },
    { value: 'rtgs_neft', label: 'RTGS/NEFT' },
    { value: 'upi', label: 'UPI' },
    { value: 'demand_draft', label: 'Demand Draft' },
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push(`/crm/bookings/${id}`)} className="rounded-lg p-2 text-altina-muted hover:bg-white/5 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Payment Management</h1>
          <p className="text-sm text-altina-muted">Record and verify payments for this booking</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90">
          <Plus size={16} /> Add Payment
        </button>
      </div>

      {/* Add Payment Form */}
      {showForm && (
        <form onSubmit={handleAddPayment} className="rounded-2xl border border-altina-gold/30 bg-white/[0.03] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Record Payment</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm text-altina-muted">Milestone *</label><input type="text" value={milestone} onChange={e => setMilestone(e.target.value)} className={inputClass} required placeholder="e.g., Token Amount" /></div>
            <div><label className="mb-1 block text-sm text-altina-muted">Amount *</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={inputClass} required /></div>
            <div><label className="mb-1 block text-sm text-altina-muted">Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputClass} /></div>
            <div><label className="mb-1 block text-sm text-altina-muted">Paid Date</label><input type="date" value={paidDate} onChange={e => setPaidDate(e.target.value)} className={inputClass} /></div>
            <div>
              <label className="mb-1 block text-sm text-altina-muted">Payment Mode</label>
              <select value={mode} onChange={e => setMode(e.target.value)} className={inputClass}>
                <option value="" className="bg-[#1A1A1C]">Select...</option>
                {paymentModes.map(m => <option key={m.value} value={m.value} className="bg-[#1A1A1C]">{m.label}</option>)}
              </select>
            </div>
            <div><label className="mb-1 block text-sm text-altina-muted">Transaction Ref / UTR</label><input type="text" value={transactionRef} onChange={e => setTransactionRef(e.target.value)} className={inputClass} /></div>
            <div><label className="mb-1 block text-sm text-altina-muted">Bank Name</label><input type="text" value={bankName} onChange={e => setBankName(e.target.value)} className={inputClass} /></div>
            <div><label className="mb-1 block text-sm text-altina-muted">Notes</label><input type="text" value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} /></div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-white/15 px-4 py-2 text-sm text-altina-muted hover:text-white">Cancel</button>
            <button type="submit" disabled={submitting} className="rounded-xl bg-altina-gold px-6 py-2 text-sm font-semibold text-black disabled:opacity-50">{submitting ? 'Saving...' : 'Save Payment'}</button>
          </div>
        </form>
      )}

      {/* Payment List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-10 text-center text-altina-muted">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-12 text-center">
            <CreditCard size={40} className="mx-auto mb-3 text-altina-muted" strokeWidth={1} />
            <p className="text-altina-muted">No payments recorded yet</p>
          </div>
        ) : (
          payments.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <div>
                <p className="font-medium text-white">{p.milestone}</p>
                <p className="mt-0.5 text-xs text-altina-muted">
                  Due: {formatDate(p.due_date)} {p.paid_date && `| Paid: ${formatDate(p.paid_date)}`}
                  {p.mode && ` | ${p.mode.replace('_', '/')}`}
                  {p.transaction_ref && ` | Ref: ${p.transaction_ref}`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-white">{formatINR(p.amount)}</span>
                <Badge label={p.status} variant="payment" size="md" />
                {p.status === 'pending' && (
                  <button onClick={() => handleMarkReceived(p.id)} className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/30">
                    Mark Received
                  </button>
                )}
                {p.status === 'received' && (
                  <button onClick={() => handleVerify(p.id)} className="flex items-center gap-1 rounded-lg bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/30">
                    <Check size={12} /> Verify
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
