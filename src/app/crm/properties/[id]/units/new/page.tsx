'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Property } from '@/types/crm'
import Select from '@/components/crm/ui/Select'
import toast from 'react-hot-toast'

type UnitForm = {
  unit_number: string
  tower: string
  floor: string
  configuration: string
  carpet_area: string
  super_area: string
  balcony_area: string
  facing: string
  base_price: string
  total_price: string
  plc: string
  floor_rise: string
  other_charges: string
  parking_charges: string
  stamp_duty_pct: string
  gst_pct: string
  commission_pct: string
  notes: string
}

const FACING_OPTIONS = [
  { value: 'North', label: 'North' },
  { value: 'South', label: 'South' },
  { value: 'East', label: 'East' },
  { value: 'West', label: 'West' },
  { value: 'North-East', label: 'North-East' },
  { value: 'North-West', label: 'North-West' },
  { value: 'South-East', label: 'South-East' },
  { value: 'South-West', label: 'South-West' },
]

const initialForm: UnitForm = {
  unit_number: '',
  tower: '',
  floor: '',
  configuration: '',
  carpet_area: '',
  super_area: '',
  balcony_area: '',
  facing: '',
  base_price: '',
  total_price: '',
  plc: '',
  floor_rise: '',
  other_charges: '',
  parking_charges: '',
  stamp_duty_pct: '',
  gst_pct: '',
  commission_pct: '',
  notes: '',
}

export default function NewUnitPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [property, setProperty] = useState<Property | null>(null)
  const [form, setForm] = useState<UnitForm>(initialForm)
  const [saving, setSaving] = useState(false)

  const fetchProperty = useCallback(async () => {
    const { data } = await supabase
      .from('properties')
      .select('id, name, developer, typologies')
      .eq('id', id)
      .single()
    setProperty(data as unknown as Property)
  }, [supabase, id])

  useEffect(() => {
    if (id) fetchProperty()
  }, [id, fetchProperty])

  const updateField = (field: keyof UnitForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Derive config options from property typologies
  const configOptions = useMemo(() => {
    if (!property?.typologies?.length) return []
    return property.typologies.map(t => ({ value: t, label: t }))
  }, [property])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.unit_number.trim()) {
      toast.error('Unit number is required')
      return
    }

    setSaving(true)
    try {
      const toNum = (v: string) => v ? Number(v) : null

      const { error } = await supabase.from('units').insert({
        property_id: id,
        unit_number: form.unit_number.trim(),
        tower: form.tower.trim() || null,
        floor: form.floor ? Number(form.floor) : null,
        configuration: form.configuration || null,
        carpet_area: toNum(form.carpet_area),
        super_area: toNum(form.super_area),
        balcony_area: toNum(form.balcony_area),
        facing: form.facing || null,
        status: 'available' as const,
        base_price: toNum(form.base_price),
        total_price: toNum(form.total_price),
        plc: toNum(form.plc),
        floor_rise: toNum(form.floor_rise),
        other_charges: toNum(form.other_charges),
        parking_charges: toNum(form.parking_charges),
        stamp_duty_pct: toNum(form.stamp_duty_pct),
        gst_pct: toNum(form.gst_pct),
        commission_pct: toNum(form.commission_pct),
        notes: form.notes.trim() || null,
      })

      if (error) throw error

      toast.success('Unit added successfully')
      router.push(`/crm/properties/${id}/units`)
    } catch (err) {
      console.error('Failed to add unit:', err)
      toast.error('Failed to add unit')
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
          <h1 className="text-2xl font-bold text-white">Add Unit</h1>
          {property && (
            <p className="mt-0.5 text-sm text-altina-muted">
              {property.name} {property.developer ? `by ${property.developer}` : ''}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Unit Identity
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Unit Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.unit_number}
                onChange={(e) => updateField('unit_number', e.target.value)}
                required
                placeholder="e.g. A-1201"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Tower</label>
              <input
                type="text"
                value={form.tower}
                onChange={(e) => updateField('tower', e.target.value)}
                placeholder="e.g. A"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Floor</label>
              <input
                type="number"
                value={form.floor}
                onChange={(e) => updateField('floor', e.target.value)}
                placeholder="e.g. 12"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            {configOptions.length > 0 ? (
              <Select
                label="Configuration"
                value={form.configuration}
                onChange={(v) => updateField('configuration', v)}
                options={configOptions}
                placeholder="Select config..."
              />
            ) : (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-altina-muted">Configuration</label>
                <input
                  type="text"
                  value={form.configuration}
                  onChange={(e) => updateField('configuration', e.target.value)}
                  placeholder="e.g. 3 BHK"
                  className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Area & Facing */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Area & Facing
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Carpet Area (sq ft)</label>
              <input
                type="number"
                step="0.01"
                value={form.carpet_area}
                onChange={(e) => updateField('carpet_area', e.target.value)}
                placeholder="e.g. 1850"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Super Area (sq ft)</label>
              <input
                type="number"
                step="0.01"
                value={form.super_area}
                onChange={(e) => updateField('super_area', e.target.value)}
                placeholder="e.g. 2450"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Balcony Area (sq ft)</label>
              <input
                type="number"
                step="0.01"
                value={form.balcony_area}
                onChange={(e) => updateField('balcony_area', e.target.value)}
                placeholder="e.g. 200"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <Select
              label="Facing"
              value={form.facing}
              onChange={(v) => updateField('facing', v)}
              options={FACING_OPTIONS}
              placeholder="Select facing..."
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Pricing
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Base Price (INR)</label>
              <input
                type="number"
                value={form.base_price}
                onChange={(e) => updateField('base_price', e.target.value)}
                placeholder="e.g. 22000000"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Total Price (INR)</label>
              <input
                type="number"
                value={form.total_price}
                onChange={(e) => updateField('total_price', e.target.value)}
                placeholder="e.g. 25000000"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">PLC (INR)</label>
              <input
                type="number"
                value={form.plc}
                onChange={(e) => updateField('plc', e.target.value)}
                placeholder="Preferential Location Charge"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Floor Rise (INR)</label>
              <input
                type="number"
                value={form.floor_rise}
                onChange={(e) => updateField('floor_rise', e.target.value)}
                placeholder="Floor rise premium"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Other Charges (INR)</label>
              <input
                type="number"
                value={form.other_charges}
                onChange={(e) => updateField('other_charges', e.target.value)}
                placeholder="IFMS, Club, etc."
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Parking Charges (INR)</label>
              <input
                type="number"
                value={form.parking_charges}
                onChange={(e) => updateField('parking_charges', e.target.value)}
                placeholder="Car parking charges"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Stamp Duty (%)</label>
              <input
                type="number"
                step="0.01"
                value={form.stamp_duty_pct}
                onChange={(e) => updateField('stamp_duty_pct', e.target.value)}
                placeholder="e.g. 6"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">GST (%)</label>
              <input
                type="number"
                step="0.01"
                value={form.gst_pct}
                onChange={(e) => updateField('gst_pct', e.target.value)}
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Brokerage / Commission (%)</label>
              <input
                type="number"
                step="0.01"
                value={form.commission_pct}
                onChange={(e) => updateField('commission_pct', e.target.value)}
                placeholder="e.g. 2"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Notes
          </h3>
          <textarea
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={3}
            placeholder="Any additional notes about this unit..."
            className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
          <Link
            href={`/crm/properties/${id}/units`}
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
            {saving ? 'Saving...' : 'Save Unit'}
          </button>
        </div>
      </form>
    </div>
  )
}
