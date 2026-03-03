'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, FileCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Booking, Column, PaginationState } from '@/types/crm'
import DataTable from '@/components/crm/ui/DataTable'
import Badge from '@/components/crm/ui/Badge'
import { formatINR, formatDate } from '@/lib/crm/formatters'

export default function BookingsPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 25, total: 0 })
  const [statusFilter, setStatusFilter] = useState('')

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('bookings')
      .select('*, lead:leads!bookings_lead_id_fkey(name, phone), property:properties!bookings_property_id_fkey(name, city), unit:units!bookings_unit_id_fkey(unit_number, configuration)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize - 1)

    if (statusFilter) query = query.eq('status', statusFilter)

    const { data, count, error } = await query
    if (!error && data) {
      setBookings(data as unknown as Booking[])
      setPagination(prev => ({ ...prev, total: count || 0 }))
    }
    setLoading(false)
  }, [supabase, pagination.page, pagination.pageSize, statusFilter])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const columns: Column<Booking>[] = [
    {
      key: 'booking_number',
      header: 'Booking #',
      sortable: true,
      render: (row) => <span className="font-mono text-altina-gold">{row.booking_number}</span>,
    },
    {
      key: 'buyer_name',
      header: 'Buyer',
      render: (row) => (
        <div>
          <p className="font-medium text-white">{row.buyer_name}</p>
          <p className="text-xs text-altina-muted">{row.buyer_phone}</p>
        </div>
      ),
    },
    {
      key: 'property',
      header: 'Property / Unit',
      render: (row) => (
        <div>
          <p className="text-white">{(row.property as { name: string })?.name || '-'}</p>
          <p className="text-xs text-altina-muted">{(row.unit as { unit_number: string; configuration: string })?.unit_number} - {(row.unit as { configuration: string })?.configuration}</p>
        </div>
      ),
    },
    {
      key: 'total_payable',
      header: 'Amount',
      align: 'right',
      render: (row) => <span className="font-medium text-white">{formatINR(row.total_payable)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge label={row.status} variant="booking" />,
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: (row) => <span className="text-altina-muted">{formatDate(row.created_at)}</span>,
    },
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending_approval', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'agreement_sent', label: 'Agreement Sent' },
    { value: 'agreement_signed', label: 'Agreement Signed' },
    { value: 'registered', label: 'Registered' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-sm text-altina-muted">Manage property bookings and agreements</p>
        </div>
        <Link
          href="/crm/bookings/new"
          className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          New Booking
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })) }}
          className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm text-white outline-none"
        >
          {statusOptions.map(o => (
            <option key={o.value} value={o.value} className="bg-[#1A1A1C]">{o.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(p => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setPagination(p => ({ ...p, pageSize, page: 1 }))}
        onRowClick={(row) => router.push(`/crm/bookings/${row.id}`)}
        emptyTitle="No bookings yet"
        emptyDescription="Create your first booking to get started"
        emptyAction={
          <Link href="/crm/bookings/new" className="text-sm text-altina-gold hover:underline">
            Create Booking
          </Link>
        }
      />
    </div>
  )
}
