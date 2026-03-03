'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Commission, Column, PaginationState } from '@/types/crm'
import DataTable from '@/components/crm/ui/DataTable'
import Badge from '@/components/crm/ui/Badge'
import StatsCard from '@/components/crm/ui/StatsCard'
import { formatINR, formatDate, formatPercent } from '@/lib/crm/formatters'
import { IndianRupee, CheckCircle, Clock, Receipt } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CommissionsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 25, total: 0 })
  const [statusFilter, setStatusFilter] = useState('')

  const [totalPending, setTotalPending] = useState(0)
  const [totalApproved, setTotalApproved] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)

  const fetchCommissions = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('commissions')
      .select('*, booking:bookings(booking_number, buyer_name, property:properties(name)), earner:profiles(full_name, role)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize - 1)

    if (statusFilter) query = query.eq('status', statusFilter)

    const { data, count } = await query
    setCommissions((data || []) as unknown as Commission[])
    setPagination(prev => ({ ...prev, total: count || 0 }))
    setLoading(false)
  }, [supabase, pagination.page, pagination.pageSize, statusFilter])

  useEffect(() => { fetchCommissions() }, [fetchCommissions])

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      const { data: all } = await supabase.from('commissions').select('net_payable, status')
      if (all) {
        setTotalPending(all.filter(c => c.status === 'pending').reduce((s, c) => s + (c.net_payable || 0), 0))
        setTotalApproved(all.filter(c => c.status === 'approved' || c.status === 'invoice_raised').reduce((s, c) => s + (c.net_payable || 0), 0))
        setTotalPaid(all.filter(c => c.status === 'paid').reduce((s, c) => s + (c.net_payable || 0), 0))
      }
    }
    fetchStats()
  }, [supabase])

  const handleApprove = async (commId: string) => {
    const { error } = await supabase.from('commissions').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', commId)
    if (error) { toast.error(error.message); return }
    toast.success('Commission approved')
    fetchCommissions()
  }

  const handleMarkPaid = async (commId: string) => {
    const { error } = await supabase.from('commissions').update({ status: 'paid', paid_date: new Date().toISOString().split('T')[0] }).eq('id', commId)
    if (error) { toast.error(error.message); return }
    toast.success('Commission marked as paid')
    fetchCommissions()
  }

  const columns: Column<Commission>[] = [
    {
      key: 'booking',
      header: 'Booking',
      render: (row) => {
        const b = row.booking as unknown as { booking_number: string; buyer_name: string; property: { name: string } }
        return (
          <div>
            <p className="font-mono text-xs text-altina-gold">{b?.booking_number}</p>
            <p className="text-sm text-white">{b?.buyer_name}</p>
          </div>
        )
      },
    },
    {
      key: 'earner',
      header: 'Earner',
      render: (row) => {
        const e = row.earner as unknown as { full_name: string; role: string }
        return (
          <div>
            <p className="text-white">{e?.full_name}</p>
            <p className="text-xs capitalize text-altina-muted">{e?.role?.replace('_', ' ')}</p>
          </div>
        )
      },
    },
    { key: 'base_amount', header: 'Base Value', align: 'right', render: (row) => <span className="text-altina-muted">{formatINR(row.base_amount)}</span> },
    { key: 'commission_pct', header: '%', align: 'center', render: (row) => <span className="text-white">{formatPercent(row.commission_pct, 2)}</span> },
    { key: 'commission_amount', header: 'Commission', align: 'right', render: (row) => <span className="font-medium text-white">{formatINR(row.commission_amount)}</span> },
    { key: 'tds_deducted', header: 'TDS', align: 'right', render: (row) => <span className="text-red-400">-{formatINR(row.tds_deducted || 0)}</span> },
    { key: 'net_payable', header: 'Net Payable', align: 'right', render: (row) => <span className="font-semibold text-altina-gold">{formatINR(row.net_payable)}</span> },
    { key: 'status', header: 'Status', render: (row) => <Badge label={row.status} variant="default" /> },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <button onClick={(e) => { e.stopPropagation(); handleApprove(row.id) }} className="rounded-lg bg-green-500/20 px-2 py-1 text-xs text-green-400 hover:bg-green-500/30">Approve</button>
          )}
          {(row.status === 'approved' || row.status === 'invoice_raised') && (
            <button onClick={(e) => { e.stopPropagation(); handleMarkPaid(row.id) }} className="rounded-lg bg-blue-500/20 px-2 py-1 text-xs text-blue-400 hover:bg-blue-500/30">Mark Paid</button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Commissions</h1>
        <p className="text-sm text-altina-muted">Track and manage sales commissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard title="Pending" value={formatINR(totalPending)} icon={<Clock size={20} />} />
        <StatsCard title="Approved / Processing" value={formatINR(totalApproved)} icon={<Receipt size={20} />} />
        <StatsCard title="Total Paid" value={formatINR(totalPaid)} icon={<CheckCircle size={20} />} />
      </div>

      {/* Filter */}
      <div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none"
        >
          <option value="" className="bg-[#1A1A1C]">All Statuses</option>
          <option value="pending" className="bg-[#1A1A1C]">Pending</option>
          <option value="approved" className="bg-[#1A1A1C]">Approved</option>
          <option value="invoice_raised" className="bg-[#1A1A1C]">Invoice Raised</option>
          <option value="paid" className="bg-[#1A1A1C]">Paid</option>
          <option value="cancelled" className="bg-[#1A1A1C]">Cancelled</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={commissions}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(p => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setPagination(p => ({ ...p, pageSize, page: 1 }))}
        emptyTitle="No commissions"
        emptyDescription="Commissions will appear here when bookings are created"
      />
    </div>
  )
}
