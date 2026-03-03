'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Select from '@/components/crm/ui/Select'
import { LEAD_SOURCES, LEAD_STAGES } from '@/lib/crm/constants'
import type { Lead, LeadSource, LeadStage, LeadQuality } from '@/types/crm'
import toast from 'react-hot-toast'

type FormData = {
  name: string
  phone: string
  email: string
  alternate_phone: string
  budget_min: string
  budget_max: string
  preferred_location: string
  preferred_config: string
  property_type: string
  source: LeadSource | ''
  source_detail: string
  project_name: string
  notes: string
  stage: LeadStage | ''
  quality: LeadQuality | ''
  score: string
  lost_reason: string
}

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office', label: 'Office Space' },
  { value: 'shop', label: 'Shop/Retail' },
]

const CONFIGURATIONS = [
  { value: '1BHK', label: '1 BHK' },
  { value: '2BHK', label: '2 BHK' },
  { value: '3BHK', label: '3 BHK' },
  { value: '4BHK', label: '4 BHK' },
  { value: '5BHK', label: '5 BHK' },
  { value: '5BHK+', label: '5 BHK+' },
]

const QUALITY_OPTIONS = [
  { value: 'hot', label: 'Hot' },
  { value: 'warm', label: 'Warm' },
  { value: 'cold', label: 'Cold' },
  { value: 'dead', label: 'Dead' },
]

export default function EditLeadPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const leadId = params.id as string

  const [lead, setLead] = useState<Lead | null>(null)
  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const fetchLead = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

      if (error) throw error

      const l = data as Lead
      setLead(l)
      setForm({
        name: l.name,
        phone: l.phone,
        email: l.email || '',
        alternate_phone: l.alternate_phone || '',
        budget_min: l.budget_min != null ? String(l.budget_min) : '',
        budget_max: l.budget_max != null ? String(l.budget_max) : '',
        preferred_location: l.preferred_location || '',
        preferred_config: l.preferred_config || '',
        property_type: l.property_type || '',
        source: l.source,
        source_detail: l.source_detail || '',
        project_name: l.project_name || '',
        notes: l.notes || '',
        stage: l.stage,
        quality: l.quality,
        score: String(l.score),
        lost_reason: l.lost_reason || '',
      })
    } catch (err) {
      console.error('Failed to fetch lead:', err)
      toast.error('Failed to load lead')
      router.push('/crm/leads')
    } finally {
      setLoading(false)
    }
  }, [supabase, leadId, router])

  useEffect(() => {
    fetchLead()
  }, [fetchLead])

  if (loading || !form) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-altina-gold" />
      </div>
    )
  }

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : null))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {}

    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.phone.trim()) {
      errs.phone = 'Phone is required'
    } else {
      const digits = form.phone.replace(/\D/g, '')
      if (digits.length < 10) errs.phone = 'Enter a valid phone number'
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address'
    }
    if (form.budget_min && form.budget_max) {
      if (Number(form.budget_min) > Number(form.budget_max)) {
        errs.budget_max = 'Max budget must be greater than min'
      }
    }
    if (form.score) {
      const s = Number(form.score)
      if (isNaN(s) || s < 0 || s > 100) errs.score = 'Score must be 0-100'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        alternate_phone: form.alternate_phone.trim() || null,
        budget_min: form.budget_min ? Number(form.budget_min) : null,
        budget_max: form.budget_max ? Number(form.budget_max) : null,
        preferred_location: form.preferred_location.trim() || null,
        preferred_config: form.preferred_config || null,
        property_type: form.property_type || null,
        source: form.source || lead!.source,
        source_detail: form.source_detail.trim() || null,
        project_name: form.project_name.trim() || null,
        notes: form.notes.trim() || null,
        stage: form.stage || lead!.stage,
        quality: form.quality || lead!.quality,
        score: form.score ? Number(form.score) : lead!.score,
        lost_reason: form.lost_reason.trim() || null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('leads')
        .update(payload)
        .eq('id', leadId)

      if (error) throw error

      toast.success('Lead updated successfully')
      router.push(`/crm/leads/${leadId}`)
    } catch (err) {
      console.error('Failed to update lead:', err)
      toast.error('Failed to update lead. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/crm/leads/${leadId}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Lead</h1>
          <p className="mt-0.5 text-sm text-altina-muted">{lead?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Contact Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:ring-2 focus:ring-altina-gold/20 ${
                  errors.name ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/15 focus:border-altina-gold/50'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:ring-2 focus:ring-altina-gold/20 ${
                  errors.phone ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/15 focus:border-altina-gold/50'
                }`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:ring-2 focus:ring-altina-gold/20 ${
                  errors.email ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/15 focus:border-altina-gold/50'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Alternate Phone
              </label>
              <input
                type="tel"
                value={form.alternate_phone}
                onChange={(e) => update('alternate_phone', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
          </div>
        </div>

        {/* Stage & Quality */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Stage &amp; Quality</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Stage"
              value={form.stage}
              onChange={(v) => update('stage', v)}
              options={LEAD_STAGES}
              placeholder="Select stage"
            />
            <Select
              label="Quality"
              value={form.quality}
              onChange={(v) => update('quality', v)}
              options={QUALITY_OPTIONS}
              placeholder="Select quality"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Score (0-100)
              </label>
              <input
                type="number"
                value={form.score}
                onChange={(e) => update('score', e.target.value)}
                min="0"
                max="100"
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:ring-2 focus:ring-altina-gold/20 ${
                  errors.score ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/15 focus:border-altina-gold/50'
                }`}
              />
              {errors.score && <p className="mt-1 text-xs text-red-400">{errors.score}</p>}
            </div>
          </div>
          {(form.stage === 'lost' || form.stage === 'junk') && (
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Lost / Junk Reason
              </label>
              <input
                type="text"
                value={form.lost_reason}
                onChange={(e) => update('lost_reason', e.target.value)}
                placeholder="Enter reason for marking as lost/junk"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
          )}
        </div>

        {/* Interest & Budget */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Interest &amp; Budget</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Budget Min (INR)
              </label>
              <input
                type="number"
                value={form.budget_min}
                onChange={(e) => update('budget_min', e.target.value)}
                placeholder="e.g. 5000000"
                min="0"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Budget Max (INR)
              </label>
              <input
                type="number"
                value={form.budget_max}
                onChange={(e) => update('budget_max', e.target.value)}
                placeholder="e.g. 15000000"
                min="0"
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:ring-2 focus:ring-altina-gold/20 ${
                  errors.budget_max ? 'border-red-500/50 focus:border-red-500/50' : 'border-white/15 focus:border-altina-gold/50'
                }`}
              />
              {errors.budget_max && (
                <p className="mt-1 text-xs text-red-400">{errors.budget_max}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Preferred Location
              </label>
              <input
                type="text"
                value={form.preferred_location}
                onChange={(e) => update('preferred_location', e.target.value)}
                placeholder="e.g. Sector 80, Gurugram"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>

            <Select
              label="Configuration"
              value={form.preferred_config}
              onChange={(v) => update('preferred_config', v)}
              options={CONFIGURATIONS}
              placeholder="Select config"
            />

            <Select
              label="Property Type"
              value={form.property_type}
              onChange={(v) => update('property_type', v)}
              options={PROPERTY_TYPES}
              placeholder="Select type"
              className="sm:col-span-2"
            />
          </div>
        </div>

        {/* Source */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Source</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Lead Source"
              value={form.source}
              onChange={(v) => update('source', v)}
              options={LEAD_SOURCES}
              placeholder="Select source"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Source Detail
              </label>
              <input
                type="text"
                value={form.source_detail}
                onChange={(e) => update('source_detail', e.target.value)}
                placeholder="e.g. Campaign name, referrer name"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Interested Project
              </label>
              <input
                type="text"
                value={form.project_name}
                onChange={(e) => update('project_name', e.target.value)}
                placeholder="e.g. DLF The Arbour"
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Notes</h2>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Any additional notes about this lead..."
            rows={4}
            className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-altina-muted/50 focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <Link
            href={`/crm/leads/${leadId}`}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-altina-gold px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
