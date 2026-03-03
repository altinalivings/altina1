'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Property, Unit, UnitStatus } from '@/types/crm'
import { UNIT_STATUS_COLORS, UNIT_STATUS_LABELS } from '@/lib/crm/constants'
import { formatINR, formatINRCompact } from '@/lib/crm/formatters'
import Select from '@/components/crm/ui/Select'
import ConfirmDialog from '@/components/crm/ui/ConfirmDialog'
import EmptyState from '@/components/crm/ui/EmptyState'
import toast from 'react-hot-toast'

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

const STATUS_OPTIONS: { value: UnitStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'booked', label: 'Booked' },
  { value: 'sold', label: 'Sold' },
  { value: 'not_released', label: 'Not Released' },
]

export default function UnitDetailPage() {
  const { id, unitId } = useParams<{ id: string; unitId: string }>()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [property, setProperty] = useState<Property | null>(null)
  const [unit, setUnit] = useState<Unit | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Form state
  const [form, setForm] = useState({
    unit_number: '',
    tower: '',
    floor: '',
    configuration: '',
    carpet_area: '',
    super_area: '',
    balcony_area: '',
    facing: '',
    status: '' as UnitStatus | '',
    base_price: '',
    total_price: '',
    plc: '',
    floor_rise: '',
    other_charges: '',
    parking_charges: '',
    stamp_duty_pct: '',
    gst_pct: '',
    notes: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [propRes, unitRes] = await Promise.all([
        supabase.from('properties').select('id, name, developer, typologies').eq('id', id).single(),
        supabase.from('units').select('*').eq('id', unitId).single(),
      ])

      if (propRes.error) throw propRes.error
      if (unitRes.error) throw unitRes.error

      setProperty(propRes.data as unknown as Property)
      setUnit(unitRes.data)

      const u = unitRes.data
      setForm({
        unit_number: u.unit_number || '',
        tower: u.tower || '',
        floor: u.floor != null ? String(u.floor) : '',
        configuration: u.configuration || '',
        carpet_area: u.carpet_area != null ? String(u.carpet_area) : '',
        super_area: u.super_area != null ? String(u.super_area) : '',
        balcony_area: u.balcony_area != null ? String(u.balcony_area) : '',
        facing: u.facing || '',
        status: u.status,
        base_price: u.base_price != null ? String(u.base_price) : '',
        total_price: u.total_price != null ? String(u.total_price) : '',
        plc: u.plc != null ? String(u.plc) : '',
        floor_rise: u.floor_rise != null ? String(u.floor_rise) : '',
        other_charges: u.other_charges != null ? String(u.other_charges) : '',
        parking_charges: u.parking_charges != null ? String(u.parking_charges) : '',
        stamp_duty_pct: u.stamp_duty_pct != null ? String(u.stamp_duty_pct) : '',
        gst_pct: u.gst_pct != null ? String(u.gst_pct) : '',
        notes: u.notes || '',
      })
    } catch (err) {
      console.error('Failed to fetch unit:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, id, unitId])

  useEffect(() => {
    if (id && unitId) fetchData()
  }, [id, unitId, fetchData])

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

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

      const { error } = await supabase
        .from('units')
        .update({
          unit_number: form.unit_number.trim(),
          tower: form.tower.trim() || null,
          floor: form.floor ? Number(form.floor) : null,
          configuration: form.configuration || null,
          carpet_area: toNum(form.carpet_area),
          super_area: toNum(form.super_area),
          balcony_area: toNum(form.balcony_area),
          facing: form.facing || null,
          status: (form.status || 'available') as UnitStatus,
          base_price: toNum(form.base_price),
          total_price: toNum(form.total_price),
          plc: toNum(form.plc),
          floor_rise: toNum(form.floor_rise),
          other_charges: toNum(form.other_charges),
          parking_charges: toNum(form.parking_charges),
          stamp_duty_pct: toNum(form.stamp_duty_pct),
          gst_pct: toNum(form.gst_pct),
          notes: form.notes.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', unitId)

      if (error) throw error

      toast.success('Unit updated successfully')
      router.push(`/crm/properties/${id}/units`)
    } catch (err) {
      console.error('Failed to update unit:', err)
      toast.error('Failed to update unit')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const { error } = await supabase.from('units').delete().eq('id', unitId)
      if (error) throw error

      toast.success('Unit deleted')
      router.push(`/crm/properties/${id}/units`)
    } catch (err) {
      console.error('Failed to delete unit:', err)
      toast.error('Failed to delete unit')
    } finally {
      setDeleting(false)
      setShowDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    )
  }

  if (!unit) {
    return (
      <EmptyState
        title="Unit not found"
        description="The unit you're looking for doesn't exist or has been removed."
        action={
          <Link
            href={`/crm/properties/${id}/units`}
            className="inline-flex items-center gap-2 rounded-xl bg-altina-gold px-4 py-2.5 text-sm font-semibold text-black"
          >
            <ArrowLeft size={16} />
            Back to Units
          </Link>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/crm/properties/${id}/units`)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">
                Unit {unit.unit_number}
              </h1>
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
            </div>
            {property && (
              <p className="mt-0.5 text-sm text-altina-muted">
                {property.name} {property.developer ? `by ${property.developer}` : ''}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-2 rounded-xl border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>

      {/* Price Summary */}
      {unit.total_price && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-altina-muted">Total Price</p>
              <p className="text-xl font-bold text-white">{formatINR(unit.total_price)}</p>
            </div>
            {unit.base_price && (
              <div>
                <p className="text-xs text-altina-muted">Base Price</p>
                <p className="text-sm font-medium text-white">{formatINR(unit.base_price)}</p>
              </div>
            )}
            {unit.plc && (
              <div>
                <p className="text-xs text-altina-muted">PLC</p>
                <p className="text-sm font-medium text-white">{formatINR(unit.plc)}</p>
              </div>
            )}
            {unit.floor_rise && (
              <div>
                <p className="text-xs text-altina-muted">Floor Rise</p>
                <p className="text-sm font-medium text-white">{formatINR(unit.floor_rise)}</p>
              </div>
            )}
            {unit.other_charges && (
              <div>
                <p className="text-xs text-altina-muted">Other Charges</p>
                <p className="text-sm font-medium text-white">{formatINR(unit.other_charges)}</p>
              </div>
            )}
            {unit.parking_charges && (
              <div>
                <p className="text-xs text-altina-muted">Parking</p>
                <p className="text-sm font-medium text-white">{formatINR(unit.parking_charges)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Form */}
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
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Tower</label>
              <input
                type="text"
                value={form.tower}
                onChange={(e) => updateField('tower', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Floor</label>
              <input
                type="number"
                value={form.floor}
                onChange={(e) => updateField('floor', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
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
                  className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
                />
              </div>
            )}
            <Select
              label="Status"
              value={form.status}
              onChange={(v) => updateField('status', v)}
              options={STATUS_OPTIONS}
              placeholder="Select status..."
            />
            <Select
              label="Facing"
              value={form.facing}
              onChange={(v) => updateField('facing', v)}
              options={FACING_OPTIONS}
              placeholder="Select facing..."
            />
          </div>
        </div>

        {/* Area */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Area
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Carpet Area (sq ft)</label>
              <input
                type="number"
                step="0.01"
                value={form.carpet_area}
                onChange={(e) => updateField('carpet_area', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Super Area (sq ft)</label>
              <input
                type="number"
                step="0.01"
                value={form.super_area}
                onChange={(e) => updateField('super_area', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Balcony Area (sq ft)</label>
              <input
                type="number"
                step="0.01"
                value={form.balcony_area}
                onChange={(e) => updateField('balcony_area', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
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
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Total Price (INR)</label>
              <input
                type="number"
                value={form.total_price}
                onChange={(e) => updateField('total_price', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">PLC (INR)</label>
              <input
                type="number"
                value={form.plc}
                onChange={(e) => updateField('plc', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Floor Rise (INR)</label>
              <input
                type="number"
                value={form.floor_rise}
                onChange={(e) => updateField('floor_rise', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Other Charges (INR)</label>
              <input
                type="number"
                value={form.other_charges}
                onChange={(e) => updateField('other_charges', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Parking Charges (INR)</label>
              <input
                type="number"
                value={form.parking_charges}
                onChange={(e) => updateField('parking_charges', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Stamp Duty (%)</label>
              <input
                type="number"
                step="0.01"
                value={form.stamp_duty_pct}
                onChange={(e) => updateField('stamp_duty_pct', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">GST (%)</label>
              <input
                type="number"
                step="0.01"
                value={form.gst_pct}
                onChange={(e) => updateField('gst_pct', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Unit"
        description={`Are you sure you want to delete unit ${unit.unit_number}? This action cannot be undone.`}
        confirmLabel="Delete Unit"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}
