'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, Building2, MapPin, Calendar, Layers, Shield,
  Plus, Edit, ExternalLink, ChevronLeft, ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Property, Unit, UnitStatus } from '@/types/crm'
import { UNIT_STATUS_COLORS, UNIT_STATUS_LABELS } from '@/lib/crm/constants'
import { formatINR, formatINRCompact, formatEnumLabel } from '@/lib/crm/formatters'
import StatsCard from '@/components/crm/ui/StatsCard'
import Tabs from '@/components/crm/ui/Tabs'
import Badge from '@/components/crm/ui/Badge'
import EmptyState from '@/components/crm/ui/EmptyState'

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [property, setProperty] = useState<Property | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [galleryIndex, setGalleryIndex] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [propertyRes, unitsRes] = await Promise.all([
        supabase.from('properties').select('*').eq('id', id).single(),
        supabase.from('units').select('*').eq('property_id', id).order('tower').order('floor').order('unit_number'),
      ])

      if (propertyRes.error) throw propertyRes.error
      setProperty(propertyRes.data)
      setUnits(unitsRes.data || [])
    } catch (err) {
      console.error('Failed to fetch property:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, id])

  useEffect(() => {
    if (id) fetchData()
  }, [id, fetchData])

  const unitCounts = useMemo(() => {
    const counts: Record<UnitStatus, number> = {
      available: 0, blocked: 0, booked: 0, sold: 0, not_released: 0,
    }
    units.forEach(u => { counts[u.status]++ })
    return counts
  }, [units])

  const totalUnits = units.length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <EmptyState
        title="Property not found"
        description="The property you're looking for doesn't exist or has been removed."
        action={
          <Link
            href="/crm/properties"
            className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black"
          >
            <ArrowLeft size={16} />
            Back to Properties
          </Link>
        }
      />
    )
  }

  const gallery = property.gallery || []

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push('/crm/properties')}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{property.name}</h1>
              {property.status && (
                <span className="rounded-full bg-altina-gold/15 px-2.5 py-0.5 text-[11px] font-semibold text-altina-gold">
                  {property.status}
                </span>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-altina-muted">
              {property.developer && (
                <span>by {property.developer}</span>
              )}
              {property.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {[property.location, property.sector, property.city].filter(Boolean).join(', ')}
                </span>
              )}
              {property.rera && (
                <span className="flex items-center gap-1">
                  <Shield size={14} />
                  RERA: {property.rera}
                </span>
              )}
              {property.configuration && (
                <span className="flex items-center gap-1">
                  <Layers size={14} />
                  {property.configuration}
                </span>
              )}
              {property.possession && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Possession: {property.possession}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/crm/properties/${id}/units`}
            className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <Layers size={16} />
            Manage Units
          </Link>
          <Link
            href={`/crm/properties/${id}/units/new`}
            className="flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Plus size={16} />
            Add Unit
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard
          title="Total Units"
          value={totalUnits}
          icon={<Building2 size={20} />}
        />
        <StatsCard
          title="Available"
          value={unitCounts.available}
          icon={<span className="h-3 w-3 rounded-full bg-green-500" />}
        />
        <StatsCard
          title="Booked"
          value={unitCounts.booked}
          icon={<span className="h-3 w-3 rounded-full bg-blue-500" />}
        />
        <StatsCard
          title="Sold"
          value={unitCounts.sold}
          icon={<span className="h-3 w-3 rounded-full bg-red-500" />}
        />
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'units', label: 'Units', count: totalUnits },
          { key: 'gallery', label: 'Gallery', count: gallery.length },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overview Text */}
          {property.overview && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-altina-muted">
                Overview
              </h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/80">
                {property.overview}
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Highlights */}
            {property.highlights && property.highlights.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-altina-muted">
                  Highlights
                </h3>
                <ul className="space-y-2">
                  {property.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-altina-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-altina-muted">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
              Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[
                { label: 'Property Type', value: property.property_type },
                { label: 'Configuration', value: property.configuration },
                { label: 'Typologies', value: property.typologies?.join(', ') },
                { label: 'Sizes', value: property.sizes },
                { label: 'Land Area', value: property.land_area },
                { label: 'Towers', value: property.towers },
                { label: 'Floors', value: property.floors },
                { label: 'Total Units', value: property.total_units },
                { label: 'Possession', value: property.possession },
                { label: 'Launch Date', value: property.launch_date },
                { label: 'RERA', value: property.rera },
                { label: 'Price Range', value: property.price_display || (property.price_min && property.price_max ? `${formatINRCompact(property.price_min)} - ${formatINRCompact(property.price_max)}` : null) },
              ].filter(s => s.value).map((spec, i) => (
                <div key={i}>
                  <dt className="text-xs text-altina-muted">{spec.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-white">{spec.value}</dd>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {property.brochure_url && (
              <a
                href={property.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
              >
                <ExternalLink size={14} />
                Brochure
              </a>
            )}
            {property.video_url && (
              <a
                href={property.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
              >
                <ExternalLink size={14} />
                Video
              </a>
            )}
          </div>
        </div>
      )}

      {activeTab === 'units' && (
        <div>
          {units.length === 0 ? (
            <EmptyState
              title="No units added"
              description="Add units to track inventory for this property."
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
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Area (sq ft)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-altina-muted">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-altina-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((unit) => (
                      <tr
                        key={unit.id}
                        className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                        onClick={() => router.push(`/crm/properties/${id}/units/${unit.id}`)}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-white">
                          {unit.unit_number}
                        </td>
                        <td className="px-4 py-3 text-sm text-altina-muted">
                          {unit.tower || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-altina-muted">
                          {unit.floor ?? '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-altina-muted">
                          {unit.configuration || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-altina-muted">
                          {unit.super_area ? `${unit.super_area}` : unit.carpet_area ? `${unit.carpet_area}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {unit.total_price ? formatINRCompact(unit.total_price) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
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
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/crm/properties/${id}/units/${unit.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-altina-gold hover:underline"
                          >
                            <Edit size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'gallery' && (
        <div>
          {gallery.length === 0 ? (
            <EmptyState
              title="No gallery images"
              description="Gallery images are synced from the website or can be added manually."
            />
          ) : (
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image
                  src={gallery[galleryIndex]}
                  alt={`${property.name} gallery ${galleryIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setGalleryIndex((galleryIndex - 1 + gallery.length) % gallery.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
                      {galleryIndex + 1} / {gallery.length}
                    </span>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                        i === galleryIndex ? 'border-altina-gold' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
