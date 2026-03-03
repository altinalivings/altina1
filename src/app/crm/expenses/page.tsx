'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Receipt, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/crm/ui/DataTable'
import Badge from '@/components/crm/ui/Badge'
import Avatar from '@/components/crm/ui/Avatar'
import Select from '@/components/crm/ui/Select'
import SearchInput from '@/components/crm/ui/SearchInput'
import { formatINR, formatDate, formatEnumLabel } from '@/lib/crm/formatters'
import {
  EXPENSE_STATUS_COLORS, EXPENSE_STATUS_LABELS,
  EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORIES,
} from '@/lib/crm/constants'
import type { Expense, Column, PaginationState, ExpenseStatus, ExpenseCategory } from '@/types/crm'

export default function ExpensesPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | ''>('')
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | ''>('')
  const [myOnly, setMyOnly] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1, pageSize: 25, total: 0,
  })

  // Stats
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedThisMonth: 0,
    totalThisMonth: 0,
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id)
    })
  }, [supabase])

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          submitter:profiles!expenses_submitted_by_fkey(id, full_name, avatar_url, role),
          approver:profiles!expenses_approved_by_fkey(id, full_name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })

      if (statusFilter) query = query.eq('status', statusFilter)
      if (categoryFilter) query = query.eq('category', categoryFilter)
      if (myOnly && currentUserId) query = query.eq('submitted_by', currentUserId)
      if (search) query = query.ilike('title', `%${search}%`)

      const from = (pagination.page - 1) * pagination.pageSize
      query = query.range(from, from + pagination.pageSize - 1)

      const { data, error, count } = await query
      if (error) throw error

      setExpenses((data as Expense[]) || [])
      setPagination(prev => ({ ...prev, total: count || 0 }))

      // Compute stats from full dataset (separate queries)
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)

      const [pendingRes, monthRes] = await Promise.all([
        supabase.from('expenses').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
        supabase.from('expenses').select('amount').gte('expense_date', monthStart).in('status', ['approved', 'reimbursed']),
      ])

      const monthTotal = (monthRes.data || []).reduce((sum, e) => sum + Number(e.amount), 0)
      setStats({
        pendingCount: pendingRes.count || 0,
        approvedThisMonth: (monthRes.data || []).length,
        totalThisMonth: monthTotal,
      })
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, statusFilter, categoryFilter, myOnly, currentUserId, search, pagination.page, pagination.pageSize])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [search, statusFilter, categoryFilter, myOnly])

  const STATUS_OPTIONS = [
    { value: 'submitted',  label: 'Pending Approval' },
    { value: 'approved',   label: 'Approved' },
    { value: 'rejected',   label: 'Rejected' },
    { value: 'reimbursed', label: 'Reimbursed' },
    { value: 'draft',      label: 'Draft' },
  ]

  const columns: Column<Expense>[] = useMemo(() => [
    {
      key: 'title',
      header: 'Expense',
      width: '240px',
      render: (e) => (
        <div>
          <p className="font-medium text-white">{e.title}</p>
          <p className="text-xs text-altina-muted">
            {EXPENSE_CATEGORY_LABELS[e.category] || formatEnumLabel(e.category)}
          </p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (e) => (
        <span className="font-semibold text-white">{formatINR(e.amount)}</span>
      ),
    },
    {
      key: 'expense_date',
      header: 'Date',
      render: (e) => (
        <span className="text-sm text-altina-muted">{formatDate(e.expense_date)}</span>
      ),
    },
    {
      key: 'submitted_by',
      header: 'Submitted By',
      render: (e) => e.submitter ? (
        <div className="flex items-center gap-2">
          <Avatar name={e.submitter.full_name} src={e.submitter.avatar_url} size="sm" />
          <span className="text-sm text-white">{e.submitter.full_name}</span>
        </div>
      ) : <span className="text-sm text-altina-muted">—</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => {
        const colors = EXPENSE_STATUS_COLORS[e.status]
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
            {EXPENSE_STATUS_LABELS[e.status]}
          </span>
        )
      },
    },
    {
      key: 'created_at',
      header: 'Submitted',
      render: (e) => (
        <span className="text-sm text-altina-muted">{formatDate(e.created_at)}</span>
      ),
    },
  ], [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="mt-1 text-sm text-altina-muted">
            Track and manage team expense claims
          </p>
        </div>
        <Link
          href="/crm/expenses/new"
          className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Submit Expense
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Clock size={20} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-altina-muted">Pending Approval</p>
              <p className="text-2xl font-bold text-white">{stats.pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-xs text-altina-muted">Approved This Month</p>
              <p className="text-2xl font-bold text-white">{stats.approvedThisMonth}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-altina-gold/10">
              <TrendingUp size={20} className="text-altina-gold" />
            </div>
            <div>
              <p className="text-xs text-altina-muted">Total This Month</p>
              <p className="text-2xl font-bold text-white">{formatINR(stats.totalThisMonth)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-64">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search expenses..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as ExpenseStatus | '')}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
          className="w-44"
        />
        <Select
          value={categoryFilter}
          onChange={(v) => setCategoryFilter(v as ExpenseCategory | '')}
          options={EXPENSE_CATEGORIES}
          placeholder="All Categories"
          className="w-48"
        />
        <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-white/15 px-3 py-2 text-sm text-altina-muted hover:bg-white/5">
          <input
            type="checkbox"
            checked={myOnly}
            onChange={(e) => setMyOnly(e.target.checked)}
            className="h-3.5 w-3.5 accent-altina-gold"
          />
          My expenses only
        </label>
      </div>

      {/* Table */}
      <DataTable<Expense>
        columns={columns}
        data={expenses}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize, page: 1 }))}
        onRowClick={(e) => router.push(`/crm/expenses/${e.id}`)}
        emptyTitle="No expenses found"
        emptyDescription="Submit your first expense claim."
        emptyAction={
          <Link
            href="/crm/expenses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2 text-sm font-semibold text-black"
          >
            <Plus size={16} />
            Submit Expense
          </Link>
        }
      />
    </div>
  )
}
