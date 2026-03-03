'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ExternalLink, CheckCircle2, XCircle,
  Banknote, Calendar, Tag, FileText, User, Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Expense, UserRole } from '@/types/crm'
import {
  EXPENSE_STATUS_COLORS, EXPENSE_STATUS_LABELS, EXPENSE_CATEGORY_LABELS,
} from '@/lib/crm/constants'
import { formatINR, formatDate, formatDateTime } from '@/lib/crm/formatters'
import Avatar from '@/components/crm/ui/Avatar'
import ConfirmDialog from '@/components/crm/ui/ConfirmDialog'
import toast from 'react-hot-toast'

export default function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null)

  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [acting, setActing] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setCurrentUserId(user.id)
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single()
      if (profile) setCurrentRole(profile.role as UserRole)
    })
  }, [supabase])

  const fetchExpense = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          submitter:profiles!expenses_submitted_by_fkey(id, full_name, avatar_url, role),
          approver:profiles!expenses_approved_by_fkey(id, full_name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setExpense(data as Expense)
    } catch (err) {
      console.error('Failed to load expense:', err)
      toast.error('Failed to load expense')
    } finally {
      setLoading(false)
    }
  }, [supabase, id])

  useEffect(() => {
    fetchExpense()
  }, [fetchExpense])

  const canApprove = currentRole === 'admin' || currentRole === 'manager'
  const isOwner = expense?.submitted_by === currentUserId

  const handleApprove = async () => {
    setActing(true)
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          status: 'approved',
          approved_by: currentUserId,
          approved_at: new Date().toISOString(),
          rejection_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      toast.success('Expense approved')
      fetchExpense()
    } catch {
      toast.error('Failed to approve expense')
    } finally {
      setActing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    setActing(true)
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          status: 'rejected',
          approved_by: currentUserId,
          approved_at: new Date().toISOString(),
          rejection_reason: rejectionReason.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      toast.success('Expense rejected')
      setShowRejectDialog(false)
      fetchExpense()
    } catch {
      toast.error('Failed to reject expense')
    } finally {
      setActing(false)
    }
  }

  const handleMarkReimbursed = async () => {
    setActing(true)
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          status: 'reimbursed',
          reimbursed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      toast.success('Expense marked as reimbursed')
      fetchExpense()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setActing(false)
    }
  }

  const handleDelete = async () => {
    setActing(true)
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id)
      if (error) throw error
      toast.success('Expense deleted')
      router.push('/crm/expenses')
    } catch {
      toast.error('Failed to delete expense')
      setActing(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-white/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    )
  }

  if (!expense) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-altina-muted">Expense not found.</p>
        <Link href="/crm/expenses" className="mt-4 text-sm text-altina-gold hover:underline">
          Back to expenses
        </Link>
      </div>
    )
  }

  const statusColors = EXPENSE_STATUS_COLORS[expense.status]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/crm/expenses"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white truncate">{expense.title}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
              {EXPENSE_STATUS_LABELS[expense.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-altina-muted">
            Submitted {formatDateTime(expense.created_at)}
          </p>
        </div>
      </div>

      {/* Amount hero */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-altina-gold/10">
              <Banknote size={24} className="text-altina-gold" />
            </div>
            <div>
              <p className="text-xs text-altina-muted">Expense Amount</p>
              <p className="text-3xl font-bold text-white">{formatINR(expense.amount)}</p>
            </div>
          </div>
          {expense.receipt_url && (
            <a
              href={expense.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
            >
              <ExternalLink size={14} />
              View Receipt
            </a>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">Details</h2>
        <dl className="space-y-4">
          <div className="flex items-start gap-3">
            <Tag size={16} className="mt-0.5 shrink-0 text-altina-muted" />
            <div>
              <dt className="text-xs text-altina-muted">Category</dt>
              <dd className="text-sm text-white">
                {EXPENSE_CATEGORY_LABELS[expense.category] || expense.category}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar size={16} className="mt-0.5 shrink-0 text-altina-muted" />
            <div>
              <dt className="text-xs text-altina-muted">Expense Date</dt>
              <dd className="text-sm text-white">{formatDate(expense.expense_date)}</dd>
            </div>
          </div>
          {expense.submitter && (
            <div className="flex items-start gap-3">
              <User size={16} className="mt-0.5 shrink-0 text-altina-muted" />
              <div>
                <dt className="text-xs text-altina-muted">Submitted By</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <Avatar name={expense.submitter.full_name} src={expense.submitter.avatar_url} size="sm" />
                  <span className="text-sm text-white">{expense.submitter.full_name}</span>
                  <span className="text-xs capitalize text-altina-muted">
                    ({expense.submitter.role?.replace('_', ' ')})
                  </span>
                </dd>
              </div>
            </div>
          )}
          {expense.description && (
            <div className="flex items-start gap-3">
              <FileText size={16} className="mt-0.5 shrink-0 text-altina-muted" />
              <div>
                <dt className="text-xs text-altina-muted">Description</dt>
                <dd className="text-sm text-white/80">{expense.description}</dd>
              </div>
            </div>
          )}
          {expense.notes && (
            <div className="flex items-start gap-3">
              <FileText size={16} className="mt-0.5 shrink-0 text-altina-muted" />
              <div>
                <dt className="text-xs text-altina-muted">Additional Notes</dt>
                <dd className="text-sm text-white/80">{expense.notes}</dd>
              </div>
            </div>
          )}
        </dl>
      </div>

      {/* Approval Info */}
      {(expense.status === 'approved' || expense.status === 'rejected' || expense.status === 'reimbursed') && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            {expense.status === 'rejected' ? 'Rejection Details' : 'Approval Details'}
          </h2>
          <dl className="space-y-3">
            {expense.approver && (
              <div>
                <dt className="text-xs text-altina-muted">
                  {expense.status === 'rejected' ? 'Rejected By' : 'Approved By'}
                </dt>
                <dd className="mt-1 text-sm text-white">{expense.approver.full_name}</dd>
              </div>
            )}
            {expense.approved_at && (
              <div>
                <dt className="text-xs text-altina-muted">
                  {expense.status === 'rejected' ? 'Rejected At' : 'Approved At'}
                </dt>
                <dd className="text-sm text-white">{formatDateTime(expense.approved_at)}</dd>
              </div>
            )}
            {expense.rejection_reason && (
              <div>
                <dt className="text-xs text-altina-muted">Reason</dt>
                <dd className="mt-1 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300">
                  {expense.rejection_reason}
                </dd>
              </div>
            )}
            {expense.reimbursed_at && (
              <div>
                <dt className="text-xs text-altina-muted">Reimbursed At</dt>
                <dd className="text-sm text-white">{formatDateTime(expense.reimbursed_at)}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        {/* Manager/Admin: Approve & Reject for submitted expenses */}
        {canApprove && expense.status === 'submitted' && (
          <>
            <button
              onClick={handleApprove}
              disabled={acting}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              Approve
            </button>
            <button
              onClick={() => setShowRejectDialog(true)}
              disabled={acting}
              className="flex items-center gap-2 rounded-xl bg-red-600/80 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <XCircle size={16} />
              Reject
            </button>
          </>
        )}

        {/* Admin: Mark reimbursed for approved expenses */}
        {currentRole === 'admin' && expense.status === 'approved' && (
          <button
            onClick={handleMarkReimbursed}
            disabled={acting}
            className="flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-400 transition-colors hover:bg-blue-500/20 disabled:opacity-50"
          >
            <Banknote size={16} />
            Mark as Reimbursed
          </button>
        )}

        {/* Owner: Delete draft */}
        {isOwner && expense.status === 'draft' && (
          <>
            <Link
              href={`/crm/expenses/${id}/edit`}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
            >
              Edit Draft
            </Link>
            <button
              onClick={handleDelete}
              disabled={acting}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
            >
              Delete
            </button>
          </>
        )}

        {expense.status === 'submitted' && isOwner && !canApprove && (
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <Clock size={16} />
            Awaiting approval from your manager
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <ConfirmDialog
        open={showRejectDialog}
        onClose={() => { setShowRejectDialog(false); setRejectionReason('') }}
        onConfirm={handleReject}
        title="Reject Expense"
        description=""
        confirmLabel="Reject Expense"
        variant="danger"
        loading={acting}
      >
        <div className="mt-3">
          <label className="mb-1.5 block text-sm font-medium text-altina-muted">
            Reason for rejection <span className="text-red-400">*</span>
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
            placeholder="Explain why this expense is being rejected..."
            className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </ConfirmDialog>
    </div>
  )
}
