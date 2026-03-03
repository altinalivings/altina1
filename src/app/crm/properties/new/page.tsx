'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Select from '@/components/crm/ui/Select'
import toast from 'react-hot-toast'

type PropertyForm = {
  name: string
  developer: string
  city: string
  state: string
  location: string
  sector: string
  property_type: string
  configuration: string
  rera: string
  status: string
  possession: string
  price_display: string
  price_min: string
  price_max: string
  overview: string
  typologies: string
  total_units: string
  towers: string
  floors: string
  land_area: string
  sizes: string
}

const PROPERTY_TYPES = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'SCO', label: 'SCO' },
  { value: 'Plots', label: 'Plots' },
  { value: 'Mixed Use', label: 'Mixed Use' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Studio', label: 'Studio' },
]

const PROPERTY_STATUSES = [
  { value: 'New Launch', label: 'New Launch' },
  { value: 'Under Construction', label: 'Under Construction' },
  { value: 'Ready to Move', label: 'Ready to Move' },
  { value: 'Nearing Possession', label: 'Nearing Possession' },
  { value: 'Upcoming', label: 'Upcoming' },
]

const initialForm: PropertyForm = {
  name: '',
  developer: '',
  city: '',
  state: 'Haryana',
  location: '',
  sector: '',
  property_type: '',
  configuration: '',
  rera: '',
  status: '',
  possession: '',
  price_display: '',
  price_min: '',
  price_max: '',
  overview: '',
  typologies: '',
  total_units: '',
  towers: '',
  floors: '',
  land_area: '',
  sizes: '',
}

export default function NewPropertyPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [form, setForm] = useState<PropertyForm>(initialForm)
  const [saving, setSaving] = useState(false)

  const updateField = (field: keyof PropertyForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Property name is required')
      return
    }

    setSaving(true)
    try {
      const typologiesArray = form.typologies
        ? form.typologies.split(',').map(t => t.trim()).filter(Boolean)
        : null

      const { data, error } = await supabase
        .from('properties')
        .insert({
          name: form.name.trim(),
          developer: form.developer.trim() || null,
          city: form.city.trim() || null,
          state: form.state.trim() || null,
          location: form.location.trim() || null,
          sector: form.sector.trim() || null,
          property_type: form.property_type || null,
          configuration: form.configuration.trim() || null,
          rera: form.rera.trim() || null,
          status: form.status || null,
          possession: form.possession.trim() || null,
          price_display: form.price_display.trim() || null,
          price_min: form.price_min ? Number(form.price_min) : null,
          price_max: form.price_max ? Number(form.price_max) : null,
          overview: form.overview.trim() || null,
          typologies: typologiesArray,
          total_units: form.total_units.trim() || null,
          towers: form.towers ? Number(form.towers) : null,
          floors: form.floors.trim() || null,
          land_area: form.land_area.trim() || null,
          sizes: form.sizes.trim() || null,
          is_active: true,
          is_featured: false,
          synced_from_ts: false,
        })
        .select('id')
        .single()

      if (error) throw error

      toast.success('Property created successfully')
      router.push(`/crm/properties/${data.id}`)
    } catch (err) {
      console.error('Failed to create property:', err)
      toast.error('Failed to create property')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Add Property</h1>
          <p className="mt-0.5 text-sm text-altina-muted">Add a new property to your inventory</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Basic Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Property Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                placeholder="e.g. DLF The Arbour"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Developer</label>
              <input
                type="text"
                value={form.developer}
                onChange={(e) => updateField('developer', e.target.value)}
                placeholder="e.g. DLF"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <Select
              label="Property Type"
              value={form.property_type}
              onChange={(v) => updateField('property_type', v)}
              options={PROPERTY_TYPES}
              placeholder="Select type..."
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(v) => updateField('status', v)}
              options={PROPERTY_STATUSES}
              placeholder="Select status..."
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Configuration</label>
              <input
                type="text"
                value={form.configuration}
                onChange={(e) => updateField('configuration', e.target.value)}
                placeholder="e.g. 3 & 4 BHK"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Location
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="e.g. Gurugram"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="e.g. Haryana"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Location / Area</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="e.g. Golf Course Extension"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Sector</label>
              <input
                type="text"
                value={form.sector}
                onChange={(e) => updateField('sector', e.target.value)}
                placeholder="e.g. Sector 63"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
          </div>
        </div>

        {/* RERA & Possession */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Compliance & Timeline
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">RERA Number</label>
              <input
                type="text"
                value={form.rera}
                onChange={(e) => updateField('rera', e.target.value)}
                placeholder="e.g. RC/REP/HARERA/GGM/2024/..."
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Possession</label>
              <input
                type="text"
                value={form.possession}
                onChange={(e) => updateField('possession', e.target.value)}
                placeholder="e.g. Dec 2027"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Pricing
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Display Price</label>
              <input
                type="text"
                value={form.price_display}
                onChange={(e) => updateField('price_display', e.target.value)}
                placeholder="e.g. 5.5 Cr* Onwards"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Min Price (INR)</label>
              <input
                type="number"
                value={form.price_min}
                onChange={(e) => updateField('price_min', e.target.value)}
                placeholder="e.g. 55000000"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Max Price (INR)</label>
              <input
                type="number"
                value={form.price_max}
                onChange={(e) => updateField('price_max', e.target.value)}
                placeholder="e.g. 90000000"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Project Details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Total Units</label>
              <input
                type="text"
                value={form.total_units}
                onChange={(e) => updateField('total_units', e.target.value)}
                placeholder="e.g. 1400"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Towers</label>
              <input
                type="number"
                value={form.towers}
                onChange={(e) => updateField('towers', e.target.value)}
                placeholder="e.g. 4"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Floors</label>
              <input
                type="text"
                value={form.floors}
                onChange={(e) => updateField('floors', e.target.value)}
                placeholder="e.g. G+32"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Land Area</label>
              <input
                type="text"
                value={form.land_area}
                onChange={(e) => updateField('land_area', e.target.value)}
                placeholder="e.g. 25 Acres"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Sizes</label>
              <input
                type="text"
                value={form.sizes}
                onChange={(e) => updateField('sizes', e.target.value)}
                placeholder="e.g. 2200 - 4500 sq ft"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Typologies <span className="text-altina-muted/50">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={form.typologies}
                onChange={(e) => updateField('typologies', e.target.value)}
                placeholder="e.g. 3 BHK, 4 BHK, 4 BHK + S"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Overview
          </h3>
          <textarea
            value={form.overview}
            onChange={(e) => updateField('overview', e.target.value)}
            rows={5}
            placeholder="Write a brief overview of the property..."
            className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
          <Link
            href="/crm/properties"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-altina-gold px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  )
}
