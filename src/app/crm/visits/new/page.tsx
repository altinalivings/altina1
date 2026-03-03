'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPhone } from '@/lib/crm/formatters'

type LeadOption = { id: string; name: string; phone: string | null; email: string | null; stage: string }
type PropertyOption = { id: string; name: string; developer: string | null; city: string | null }
type AgentOption = { id: string; full_name: string; role: string }
import Select from '@/components/crm/ui/Select'
import toast from 'react-hot-toast'

export default function NewVisitPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [saving, setSaving] = useState(false)

  // Lead picker state
  const [leadSearch, setLeadSearch] = useState('')
  const [leadResults, setLeadResults] = useState<LeadOption[]>([])
  const [selectedLead, setSelectedLead] = useState<LeadOption | null>(null)
  const [searchingLeads, setSearchingLeads] = useState(false)
  const [showLeadDropdown, setShowLeadDropdown] = useState(false)

  // Properties & Profiles
  const [properties, setProperties] = useState<PropertyOption[]>([])
  const [agents, setAgents] = useState<AgentOption[]>([])

  // Form state
  const [form, setForm] = useState({
    property_id: '',
    scheduled_date: '',
    scheduled_time: '',
    assigned_to: '',
    pickup_required: false,
    pickup_location: '',
    notes: '',
  })

  // Fetch properties and agents
  useEffect(() => {
    const fetchOptions = async () => {
      const [propRes, agentRes] = await Promise.all([
        supabase.from('properties').select('id, name, developer, city').eq('is_active', true).order('name'),
        supabase.from('profiles').select('id, full_name, role').eq('is_active', true).order('full_name'),
      ])
      setProperties(propRes.data || [])
      setAgents(agentRes.data || [])
    }
    fetchOptions()
  }, [supabase])

  // Lead search with debounce
  useEffect(() => {
    if (!leadSearch || leadSearch.length < 2) {
      setLeadResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearchingLeads(true)
      try {
        const { data } = await supabase
          .from('leads')
          .select('id, name, phone, email, stage')
          .or(`name.ilike.%${leadSearch}%,phone.ilike.%${leadSearch}%`)
          .eq('is_active', true)
          .limit(10)
          .order('name')

        setLeadResults(data || [])
        setShowLeadDropdown(true)
      } catch {
        setLeadResults([])
      } finally {
        setSearchingLeads(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [leadSearch, supabase])

  const selectLead = (lead: LeadOption) => {
    setSelectedLead(lead)
    setLeadSearch(lead.name)
    setShowLeadDropdown(false)
  }

  const clearLead = () => {
    setSelectedLead(null)
    setLeadSearch('')
    setLeadResults([])
  }

  const propertyOptions = useMemo(() =>
    properties.map(p => ({
      value: p.id,
      label: `${p.name}${p.developer ? ` - ${p.developer}` : ''}${p.city ? ` (${p.city})` : ''}`,
    })),
    [properties]
  )

  const agentOptions = useMemo(() =>
    agents.map(a => ({
      value: a.id,
      label: a.full_name,
    })),
    [agents]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedLead) {
      toast.error('Please select a lead')
      return
    }

    if (!form.scheduled_date) {
      toast.error('Please select a date')
      return
    }

    setSaving(true)
    try {
      const selectedProp = properties.find(p => p.id === form.property_id)
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('site_visits')
        .insert({
          lead_id: selectedLead.id,
          created_by: user?.id || null,
          property_id: form.property_id || null,
          project_name: selectedProp?.name || null,
          scheduled_date: form.scheduled_date,
          scheduled_time: form.scheduled_time || null,
          status: 'scheduled' as const,
          assigned_to: form.assigned_to || null,
          pickup_required: form.pickup_required,
          pickup_location: form.pickup_required && form.pickup_location ? form.pickup_location.trim() : null,
          feedback: null,
          rating: null,
          notes: form.notes.trim() || null,
        })
        .select('id')
        .single()

      if (error) throw error

      toast.success('Site visit scheduled')
      router.push(`/crm/visits/${data.id}`)
    } catch (err) {
      console.error('Failed to schedule visit:', err)
      toast.error('Failed to schedule visit')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Schedule Site Visit</h1>
          <p className="mt-0.5 text-sm text-altina-muted">
            Schedule a new property site visit for a lead
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lead Picker */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Lead <span className="text-red-400">*</span>
          </h3>
          <div className="relative">
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-transparent px-3 py-2.5">
              <Search size={16} className="shrink-0 text-altina-muted" />
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => {
                  setLeadSearch(e.target.value)
                  if (selectedLead) setSelectedLead(null)
                }}
                onFocus={() => {
                  if (leadResults.length > 0) setShowLeadDropdown(true)
                }}
                placeholder="Search leads by name or phone..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-altina-muted/50"
              />
              {selectedLead && (
                <button
                  type="button"
                  onClick={clearLead}
                  className="shrink-0 text-xs text-altina-muted hover:text-white"
                >
                  Clear
                </button>
              )}
              {searchingLeads && (
                <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-altina-gold/30 border-t-altina-gold" />
              )}
            </div>

            {selectedLead && (
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-altina-gold/20 bg-altina-gold/5 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-white">{selectedLead.name}</p>
                  <p className="text-xs text-altina-muted">
                    {formatPhone(selectedLead.phone)}
                    {selectedLead.email ? ` | ${selectedLead.email}` : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Lead dropdown results */}
            {showLeadDropdown && leadResults.length > 0 && !selectedLead && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-white/15 bg-[#1A1A1C] shadow-2xl">
                {leadResults.map(lead => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => selectLead(lead)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-altina-muted">
                        {formatPhone(lead.phone)}
                        {lead.email ? ` | ${lead.email}` : ''}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showLeadDropdown && leadSearch.length >= 2 && leadResults.length === 0 && !searchingLeads && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-white/15 bg-[#1A1A1C] px-4 py-3 shadow-2xl">
                <p className="text-sm text-altina-muted">No leads found matching &quot;{leadSearch}&quot;</p>
              </div>
            )}
          </div>
        </div>

        {/* Visit Details */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Visit Details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Property"
              value={form.property_id}
              onChange={(v) => setForm(prev => ({ ...prev, property_id: v }))}
              options={propertyOptions}
              placeholder="Select property..."
            />
            <Select
              label="Assigned To"
              value={form.assigned_to}
              onChange={(v) => setForm(prev => ({ ...prev, assigned_to: v }))}
              options={agentOptions}
              placeholder="Select agent..."
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.scheduled_date}
                onChange={(e) => setForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                required
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-altina-muted">Time</label>
              <input
                type="time"
                value={form.scheduled_time}
                onChange={(e) => setForm(prev => ({ ...prev, scheduled_time: e.target.value }))}
                className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Pickup */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Pickup
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.pickup_required}
                onChange={(e) => setForm(prev => ({ ...prev, pickup_required: e.target.checked }))}
                className="h-4 w-4 rounded border-white/30 bg-transparent accent-altina-gold"
              />
              <span className="text-sm text-white">Pickup required</span>
            </label>
            {form.pickup_required && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-altina-muted">Pickup Location</label>
                <input
                  type="text"
                  value={form.pickup_location}
                  onChange={(e) => setForm(prev => ({ ...prev, pickup_location: e.target.value }))}
                  placeholder="e.g. Metro Station Gate 3, Sector 42"
                  className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-altina-muted">
            Notes
          </h3>
          <textarea
            value={form.notes}
            onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            placeholder="Any special instructions or notes for this visit..."
            className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
          <Link
            href="/crm/visits"
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
            {saving ? 'Scheduling...' : 'Schedule Visit'}
          </button>
        </div>
      </form>
    </div>
  )
}
