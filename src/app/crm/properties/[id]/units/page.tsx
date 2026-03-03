'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Layers, Grid3X3, List, LayoutGrid
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Property, Unit, UnitStatus } from '@/types/crm'
import { UNIT_STATUS_COLORS, UNIT_STATUS_LABELS } from '@/lib/crm/constants'
import { formatINRCompact } from '@/lib/crm/formatters'
import SearchInput from '@/components/crm/ui/SearchInput'
import Select from '@/components/crm/ui/Select'
import EmptyState from '@/components/crm/ui/EmptyState'
import StatsCard from '@/components/crm/ui/StatsCard'

export default function UnitsListPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [property, setProperty] = useState<Property | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [configFilter, setConfigFilter] = useState('')
  const [towerFilter, setTowerFilter] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [propRes, unitsRes] = await Promise.all([
        supabase.from('properties').select('*').eq('id', id).single(),
        supabase.from('units').select('*').eq('property_id', id).order('tower').order('floor').order('unit_number'),
      ])
      if (propRes.error) throw propRes.error
      setProperty(propRes.data)
      setUnits(unitsRes.data || [])
    } catch (err) {
      console.error('Failed to fetch units:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, id])

  useEffect(() => {
    if (id) fetchData()
  }, [id, fetchData])

  // Derive filter options
  const statusOptions = useMemo(() =>
    (Object.entries(UNIT_STATUS_LABELS) as [UnitStatus, string][]).map(([value, label]) => ({ value, label })),
    []
  )

  const configOptions = useMemo(() => {
    const unique = [...new Set(units.map(u => u.configuration).filter(Boolean))] as string[]
    return unique.sort().map(c => ({ value: c, label: c }))
  }, [units])

  const towerOptions = useMemo(() => {
    const unique = [...new Set(units.map(u => u.tower).filter(Boolean))] as string[]
    return unique.sort().map(t => ({ value: t, label: t }))
  }, [units])

  // Filter
  const filtered = useMemo(() => {
    return units.filter(u => {
      if (search) {
        const q = search.toLowerCase()
        const match = u.unit_number.toLowerCase().includes(q) ||
          u.tower?.toLowerCase().includes(q) ||
          u.configuration?.toLowerCase().includes(q)
        if (!match) return false
      }
      if (statusFilter && u.status !== statusFilter) return false
      if (configFilter && u.configuration !== configFilter) return false
      if (towerFilter && u.tower !== towerFilter) return false
      return true
    })
  }, [units, search, statusFilter, configFilter, towerFilter])

  // Unit counts by status
  const unitCounts = useMemo(() => {
    const counts: Record<UnitStatus, number> = {
      available: 0, blocked: 0, booked: 0, sold: 0, not_released: 0,
    }
    units.forEach(u => { counts[u.status]++ })
    return counts
  }, [units])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push(`/crm/properties/${id}`)}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Unit Inventory
            </h1>
            {property && (
              <p className="mt-0.5 text-sm text-altina-muted">
                {property.name} {property.developer ? `by ${property.developer}` : ''}
              </p>
            )}
          </div>
        </div>
        <Link
          href={`/crm/properties/${id}/units/new`}
          className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Add Unit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(Object.entries(unitCounts) as [UnitStatus, number][]).map(([status, count]) => (
          <div
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
              statusFilter === status
                ? 'border-altina-gold/50 bg-altina-gold/5'
                : 'border-white/10 bg-white/[0.03] hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${UNIT_STATUS_COLORS[status]}`} />
              <span className="text-xs text-altina-muted">{UNIT_STATUS_LABELS[status]}</span>
            </div>
            <p className="mt-1 text-xl font-bold text-white">{count}</p>
          </div>
        ))}
      </div>

      {/* Filters + View Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-56">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search units..."
            />
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            placeholder="All Statuses"
            className="w-full sm:w-40"
          />
          <Select
            value={configFilter}
            onChange={setConfigFilter}
            options={configOptions}
            placeholder="All Configs"
            className="w-full sm:w-40"
          />
          {towerOptions.length > 1 && (
            <Select
              value={towerFilter}
              onChange={setTowerFilter}
              options={towerOptions}
              placeholder="All Towers"
              className="w-full sm:w-36"
            />
          )}
        </div>
        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === 'grid' ? 'bg-altina-gold/20 text-altina-gold' : 'text-altina-muted hover:text-white'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-lg p-2 transition-colors ${
              viewMode === 'table' ? 'bg-altina-gold/20 text-altina-gold' : 'text-altina-muted hover:text-white'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No units found"
          description={search || statusFilter || configFilter || towerFilter
            ? 'Try adjusting your filters.'
            : 'Add your first unit to start managing inventory.'}
          icon={<Layers size={48} strokeWidth={1} />}
          action={
            <Link
              href={`/crm/properties/${id}/units/new`}
              className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black"
            >
              <Plus size={16} />
              Add Unit
            </Link>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((unit) => (
            <div
              key={unit.id}
              onClick={() => router.push(`/crm/properties/${id}/units/${unit.id}`)}
              className={`cursor-pointer rounded-2xl border p-4 transition-colors hover:bg-white/[0.05] ${
                unit.status === 'available' ? 'border-green-500/20 bg-green-500/[0.03]' :
                unit.status === 'blocked' ? 'border-amber-500/20 bg-amber-500/[0.03]' :
                unit.status === 'booked' ? 'border-blue-500/20 bg-blue-500/[0.03]' :
                unit.status === 'sold' ? 'border-red-500/20 bg-red-500/[0.03]' :
                'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold text-white">{unit.unit_number}</p>
                  {unit.tower && (
                    <p className="text-xs text-altina-muted">Tower {unit.tower}</p>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  unit.status === 'available' ? 'bg-green-500/15 text-green-400' :
                  unit.status === 'blocked' ? 'bg-amber-500/15 text-amber-400' :
                  unit.status === 'booked' ? 'bg-blue-500/15 text-blue-400' :
                  unit.status === 'sold' ? 'bg-red-500/15 text-red-400' :
                  'bg-neutral-500/15 text-neutral-400'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${UNIT_STATUS_COLORS[unit.status]}`} />
                  {UNIT_STATUS_LABELS[unit.status]}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-altina-muted">
                {unit.configuration && <p>{unit.configuration}</p>}
                {unit.super_area && <p>{unit.super_area} sq ft</p>}
                {unit.floor != null && <p>Floor {unit.floor}</p>}
              </div>
              {unit.total_price && (
                <p className="mt-2 text-sm font-semibold text-white">
                  {formatINRCompact(unit.total_price)}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Tower</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Floor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Config</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Carpet</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Super</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Facing</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-altina-muted">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-altina-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((unit) => (
                  <tr
                    key={unit.id}
                    onClick={() => router.push(`/crm/properties/${id}/units/${unit.id}`)}
                    className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-white">{unit.unit_number}</td>
                    <td className="px-4 py-3 text-sm text-altina-muted">{unit.tower || '-'}</td>
                    <td className="px-4 py-3 text-sm text-altina-muted">{unit.floor ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-altina-muted">{unit.configuration || '-'}</td>
                    <td className="px-4 py-3 text-sm text-altina-muted">{unit.carpet_area ? `${unit.carpet_area}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-altina-muted">{unit.super_area ? `${unit.super_area}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-altina-muted">{unit.facing || '-'}</td>
                    <td className="px-4 py-3 text-right text-sm text-white">{unit.total_price ? formatINRCompact(unit.total_price) : '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        unit.status === 'available' ? 'bg-green-500/15 text-green-400' :
                        unit.status === 'blocked' ? 'bg-amber-500/15 text-amber-400' :
                        unit.status === 'booked' ? 'bg-blue-500/15 text-blue-400' :
                        unit.status === 'sold' ? 'bg-red-500/15 text-red-400' :
                        'bg-neutral-500/15 text-neutral-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${UNIT_STATUS_COLORS[unit.status]}`} />
                        {UNIT_STATUS_LABELS[unit.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
