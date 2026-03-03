'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, ArrowRightLeft, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/crm/ui/DataTable'
import Badge from '@/components/crm/ui/Badge'
import Avatar from '@/components/crm/ui/Avatar'
import LeadFilters, { type LeadFilterState } from '@/components/crm/leads/LeadFilters'
import LeadScoreBadge from '@/components/crm/leads/LeadScoreBadge'
import ConfirmDialog from '@/components/crm/ui/ConfirmDialog'
import { formatPhone, timeAgo, formatDate, formatEnumLabel } from '@/lib/crm/formatters'
import type { Lead, Column, PaginationState } from '@/types/crm'
import toast from 'react-hot-toast'

export default function LeadsPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const [filters, setFilters] = useState<LeadFilterState>({
    search: '',
    stage: '',
    source: '',
    quality: '',
  })

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 25,
    total: 0,
  })

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('leads')
        .select('*, assigned_user:profiles!leads_assigned_to_fkey(*)', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (filters.stage) {
        query = query.eq('stage', filters.stage)
      }
      if (filters.source) {
        query = query.eq('source', filters.source)
      }
      if (filters.quality) {
        query = query.eq('quality', filters.quality)
      }
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        )
      }

      const from = (pagination.page - 1) * pagination.pageSize
      const to = from + pagination.pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setLeads((data as Lead[]) || [])
      setPagination((prev) => ({ ...prev, total: count || 0 }))
    } catch (err) {
      console.error('Failed to fetch leads:', err)
      toast.error('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [supabase, filters.search, filters.stage, filters.source, filters.quality, pagination.page, pagination.pageSize])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [filters.search, filters.stage, filters.source, filters.quality])

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
    setSelectedIds(new Set())
  }, [])

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }))
    setSelectedIds(new Set())
  }, [])

  const handleRowClick = useCallback(
    (lead: Lead) => {
      router.push(`/crm/leads/${lead.id}`)
    },
    [router]
  )

  const handleBulkDelete = useCallback(async () => {
    setBulkDeleting(true)
    try {
      const { error } = await supabase
        .from('leads')
        .update({ is_active: false })
        .in('id', Array.from(selectedIds))

      if (error) throw error

      toast.success(`${selectedIds.size} lead(s) archived`)
      setSelectedIds(new Set())
      setDeleteConfirmOpen(false)
      fetchLeads()
    } catch (err) {
      console.error('Bulk delete failed:', err)
      toast.error('Failed to archive leads')
    } finally {
      setBulkDeleting(false)
    }
  }, [supabase, selectedIds, fetchLeads])

  const handleBulkStageChange = useCallback(
    async (stage: string) => {
      try {
        const { error } = await supabase
          .from('leads')
          .update({ stage, updated_at: new Date().toISOString() })
          .in('id', Array.from(selectedIds))

        if (error) throw error

        toast.success(`${selectedIds.size} lead(s) moved to ${formatEnumLabel(stage)}`)
        setSelectedIds(new Set())
        fetchLeads()
      } catch (err) {
        console.error('Bulk stage change failed:', err)
        toast.error('Failed to update leads')
      }
    },
    [supabase, selectedIds, fetchLeads]
  )

  const handleExport = useCallback(() => {
    if (leads.length === 0) return

    const exportData = leads.map((l) => ({
      Name: l.name,
      Phone: l.phone,
      Email: l.email || '',
      Stage: formatEnumLabel(l.stage),
      Quality: formatEnumLabel(l.quality),
      Source: formatEnumLabel(l.source),
      Project: l.project_name || '',
      Score: l.score,
      'Assigned To': l.assigned_user?.full_name || '',
      Created: l.created_at,
    }))

    const headers = Object.keys(exportData[0])
    const csv = [
      headers.join(','),
      ...exportData.map((row) =>
        headers.map((h) => `"${String(row[h as keyof typeof row]).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Leads exported')
  }, [leads])

  const columns: Column<Lead>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        sortable: true,
        width: '220px',
        render: (lead) => (
          <div>
            <p className="font-medium text-white">{lead.name}</p>
            <p className="text-xs text-altina-muted">{formatPhone(lead.phone)}</p>
          </div>
        ),
      },
      {
        key: 'stage',
        header: 'Stage',
        render: (lead) => <Badge label={lead.stage} variant="stage" />,
      },
      {
        key: 'quality',
        header: 'Quality',
        render: (lead) => <Badge label={lead.quality} variant="quality" />,
      },
      {
        key: 'source',
        header: 'Source',
        sortable: true,
        render: (lead) => (
          <span className="text-sm text-altina-muted">{formatEnumLabel(lead.source)}</span>
        ),
      },
      {
        key: 'project_name',
        header: 'Project',
        sortable: true,
        render: (lead) => (
          <span className="text-sm text-altina-muted">{lead.project_name || '-'}</span>
        ),
      },
      {
        key: 'assigned_to',
        header: 'Assigned To',
        render: (lead) =>
          lead.assigned_user ? (
            <div className="flex items-center gap-2">
              <Avatar
                name={lead.assigned_user.full_name}
                src={lead.assigned_user.avatar_url}
                size="sm"
              />
              <span className="text-sm text-white">{lead.assigned_user.full_name}</span>
            </div>
          ) : (
            <span className="text-sm text-altina-muted">Unassigned</span>
          ),
      },
      {
        key: 'last_contacted_at',
        header: 'Last Contact',
        sortable: true,
        render: (lead) => (
          <span className="text-sm text-altina-muted">
            {timeAgo(lead.last_contacted_at)}
          </span>
        ),
      },
      {
        key: 'score',
        header: 'Score',
        sortable: true,
        align: 'center',
        render: (lead) => <LeadScoreBadge score={lead.score} size="sm" />,
      },
      {
        key: 'created_at',
        header: 'Created',
        sortable: true,
        render: (lead) => (
          <span className="text-sm text-altina-muted">{formatDate(lead.created_at)}</span>
        ),
      },
    ],
    []
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="mt-1 text-sm text-altina-muted">
            {pagination.total} total lead{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <Download size={16} />
            Export
          </button>
          <Link
            href="/crm/leads/new"
            className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Add Lead
          </Link>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters filters={filters} onChange={setFilters} />

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-altina-gold/30 bg-altina-gold/5 px-4 py-3">
          <span className="text-sm font-medium text-altina-gold">
            {selectedIds.size} selected
          </span>
          <div className="h-4 w-px bg-white/15" />
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleBulkStageChange(e.target.value)
                e.target.value = ''
              }
            }}
            defaultValue=""
            className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-xs text-white outline-none"
          >
            <option value="" className="bg-[#1A1A1C]">
              Move to stage...
            </option>
            <option value="new" className="bg-[#1A1A1C]">New</option>
            <option value="contacted" className="bg-[#1A1A1C]">Contacted</option>
            <option value="qualified" className="bg-[#1A1A1C]">Qualified</option>
            <option value="site_visit_scheduled" className="bg-[#1A1A1C]">Visit Scheduled</option>
            <option value="site_visit_done" className="bg-[#1A1A1C]">Visit Done</option>
            <option value="negotiation" className="bg-[#1A1A1C]">Negotiation</option>
            <option value="booking" className="bg-[#1A1A1C]">Booking</option>
            <option value="won" className="bg-[#1A1A1C]">Won</option>
            <option value="lost" className="bg-[#1A1A1C]">Lost</option>
            <option value="junk" className="bg-[#1A1A1C]">Junk</option>
          </select>
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <Trash2 size={14} />
            Archive
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs text-altina-muted hover:text-white"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Data Table */}
      <DataTable<Lead>
        columns={columns}
        data={leads}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onRowClick={handleRowClick}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        emptyTitle="No leads found"
        emptyDescription="Try adjusting your filters or add a new lead."
        emptyAction={
          <Link
            href="/crm/leads/new"
            className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2 text-sm font-semibold text-black"
          >
            <Plus size={16} />
            Add Lead
          </Link>
        }
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleBulkDelete}
        title="Archive selected leads?"
        description={`This will archive ${selectedIds.size} lead(s). They can be restored later from settings.`}
        confirmLabel="Archive"
        variant="danger"
        loading={bulkDeleting}
      />
    </div>
  )
}
