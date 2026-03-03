'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Building2, Plus, RefreshCw, MapPin, Layers, IndianRupee } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Property } from '@/types/crm'
import { UNIT_STATUS_COLORS, UNIT_STATUS_LABELS } from '@/lib/crm/constants'
import { formatINRCompact } from '@/lib/crm/formatters'
import SearchInput from '@/components/crm/ui/SearchInput'
import Select from '@/components/crm/ui/Select'
import EmptyState from '@/components/crm/ui/EmptyState'
import type { UnitStatus } from '@/types/crm'

type PropertyWithCounts = Property & {
  unit_counts?: Record<UnitStatus, number>
}

export default function PropertiesPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [properties, setProperties] = useState<PropertyWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [developerFilter, setDeveloperFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })

      if (error) throw error

      // Fetch unit counts for each property
      const propertyIds = (data || []).map(p => p.id)
      let unitCounts: Record<string, Record<UnitStatus, number>> = {}

      if (propertyIds.length > 0) {
        const { data: units } = await supabase
          .from('units')
          .select('property_id, status')
          .in('property_id', propertyIds)

        if (units) {
          unitCounts = units.reduce((acc, u) => {
            if (!acc[u.property_id]) {
              acc[u.property_id] = { available: 0, blocked: 0, booked: 0, sold: 0, not_released: 0 }
            }
            acc[u.property_id][u.status as UnitStatus] = (acc[u.property_id][u.status as UnitStatus] || 0) + 1
            return acc
          }, {} as Record<string, Record<UnitStatus, number>>)
        }
      }

      const propertiesWithCounts = (data || []).map(p => ({
        ...p,
        unit_counts: unitCounts[p.id] || { available: 0, blocked: 0, booked: 0, sold: 0, not_released: 0 },
      }))

      setProperties(propertiesWithCounts)
    } catch (err) {
      console.error('Failed to fetch properties:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/crm/api/properties/sync', { method: 'POST' })
      if (!res.ok) throw new Error('Sync failed')
      await fetchProperties()
    } catch (err) {
      console.error('Sync error:', err)
    } finally {
      setSyncing(false)
    }
  }

  // Derive filter options from data
  const cities = useMemo(() => {
    const unique = [...new Set(properties.map(p => p.city).filter(Boolean))] as string[]
    return unique.sort().map(c => ({ value: c, label: c }))
  }, [properties])

  const developers = useMemo(() => {
    const unique = [...new Set(properties.map(p => p.developer).filter(Boolean))] as string[]
    return unique.sort().map(d => ({ value: d, label: d }))
  }, [properties])

  const propertyTypes = useMemo(() => {
    const unique = [...new Set(properties.map(p => p.property_type).filter(Boolean))] as string[]
    return unique.sort().map(t => ({ value: t, label: t }))
  }, [properties])

  // Filter properties
  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (search) {
        const q = search.toLowerCase()
        const match = p.name.toLowerCase().includes(q) ||
          p.developer?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
        if (!match) return false
      }
      if (cityFilter && p.city !== cityFilter) return false
      if (developerFilter && p.developer !== developerFilter) return false
      if (typeFilter && p.property_type !== typeFilter) return false
      return true
    })
  }, [properties, search, cityFilter, developerFilter, typeFilter])

  const getTotalUnits = (counts: Record<UnitStatus, number> | undefined) => {
    if (!counts) return 0
    return Object.values(counts).reduce((a, b) => a + b, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Properties</h1>
          <p className="mt-1 text-sm text-altina-muted">
            Manage your property inventory and units
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync from Website'}
          </button>
          <Link
            href="/crm/properties/new"
            className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Add Property
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search properties..."
          />
        </div>
        <Select
          value={cityFilter}
          onChange={setCityFilter}
          options={cities}
          placeholder="All Cities"
          className="w-full sm:w-44"
        />
        <Select
          value={developerFilter}
          onChange={setDeveloperFilter}
          options={developers}
          placeholder="All Developers"
          className="w-full sm:w-44"
        />
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          options={propertyTypes}
          placeholder="All Types"
          className="w-full sm:w-44"
        />
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="h-44 animate-pulse bg-white/5" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No properties found"
          description={search || cityFilter || developerFilter || typeFilter
            ? 'Try adjusting your filters.'
            : 'Add your first property or sync from the website.'}
          icon={<Building2 size={48} strokeWidth={1} />}
          action={
            <Link
              href="/crm/properties/new"
              className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              <Plus size={16} />
              Add Property
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => {
            const totalUnits = getTotalUnits(property.unit_counts)
            return (
              <div
                key={property.id}
                onClick={() => router.push(`/crm/properties/${property.id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-altina-gold/30 hover:bg-white/[0.05]"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-white/5">
                  {property.hero_image ? (
                    <Image
                      src={property.hero_image}
                      alt={property.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 size={40} className="text-white/20" />
                    </div>
                  )}
                  {property.status && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                      {property.status}
                    </span>
                  )}
                  {property.is_featured && (
                    <span className="absolute right-3 top-3 rounded-full bg-altina-gold/90 px-2.5 py-1 text-[11px] font-semibold text-black">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white group-hover:text-altina-gold transition-colors">
                    {property.name}
                  </h3>
                  {property.developer && (
                    <p className="mt-0.5 text-sm text-altina-muted">
                      by {property.developer}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-altina-muted">
                    {property.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {property.city}
                        {property.sector ? `, ${property.sector}` : ''}
                      </span>
                    )}
                    {property.configuration && (
                      <span className="flex items-center gap-1">
                        <Layers size={12} />
                        {property.configuration}
                      </span>
                    )}
                    {(property.price_min || property.price_display) && (
                      <span className="flex items-center gap-1">
                        <IndianRupee size={12} />
                        {property.price_display || formatINRCompact(property.price_min)}
                      </span>
                    )}
                  </div>

                  {/* Unit Stats */}
                  {totalUnits > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      {(Object.entries(property.unit_counts || {}) as [UnitStatus, number][])
                        .filter(([, count]) => count > 0)
                        .map(([status, count]) => (
                          <span
                            key={status}
                            className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-altina-muted"
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${UNIT_STATUS_COLORS[status]}`} />
                            {count} {UNIT_STATUS_LABELS[status]}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
