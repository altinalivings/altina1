'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, FileText, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Lead, Property, Unit } from '@/types/crm'
import { formatINR } from '@/lib/crm/formatters'
import toast from 'react-hot-toast'

type Step = 1 | 2 | 3 | 4

type DocEntry = { name: string; url: string }

const DOC_TYPES = [
  { key: 'pan_buyer',      label: 'PAN Card (Buyer)' },
  { key: 'aadhaar_buyer',  label: 'Aadhaar (Buyer)' },
  { key: 'photo_buyer',    label: 'Passport Photo (Buyer)' },
  { key: 'address_proof',  label: 'Address Proof' },
  { key: 'pan_co',         label: 'PAN Card (Co-applicant)' },
  { key: 'aadhaar_co',     label: 'Aadhaar (Co-applicant)' },
]

export default function NewBookingPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Select lead, property, unit, channel partner
  const [leads, setLeads] = useState<Lead[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [channelPartners, setChannelPartners] = useState<{ id: string; full_name: string }[]>([])
  const [selectedLead, setSelectedLead] = useState('')
  const [selectedProperty, setSelectedProperty] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [selectedChannelPartner, setSelectedChannelPartner] = useState('')
  const [leadSearch, setLeadSearch] = useState('')

  // Step 2: Buyer details
  const [buyerName, setBuyerName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPan, setBuyerPan] = useState('')
  const [buyerAadhaar, setBuyerAadhaar] = useState('')
  const [buyerAddress, setBuyerAddress] = useState('')
  const [coApplicantName, setCoApplicantName] = useState('')
  const [coApplicantPan, setCoApplicantPan] = useState('')

  // Step 2: Documents
  const [docs, setDocs] = useState<Record<string, DocEntry>>({})
  const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const uploadDoc = async (docKey: string, file: File) => {
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!ALLOWED.includes(file.type)) { toast.error('Only JPEG, PNG, WebP or PDF allowed'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max file size is 5MB'); return }
    setUploadingDocs(prev => ({ ...prev, [docKey]: true }))
    try {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${docKey}.${ext}`
      const { data, error } = await supabase.storage
        .from('booking-documents')
        .upload(path, file, { contentType: file.type, upsert: false })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('booking-documents').getPublicUrl(data.path)
      setDocs(prev => ({ ...prev, [docKey]: { name: file.name, url: publicUrl } }))
    } catch {
      toast.error('Failed to upload document')
    } finally {
      setUploadingDocs(prev => ({ ...prev, [docKey]: false }))
    }
  }

  const removeDoc = (docKey: string) => {
    setDocs(prev => { const n = { ...prev }; delete n[docKey]; return n })
    const ref = fileInputRefs.current[docKey]
    if (ref) ref.value = ''
  }

  // Step 3: Pricing
  const [agreementValue, setAgreementValue] = useState('')
  const [discount, setDiscount] = useState('0')
  const [stampDuty, setStampDuty] = useState('')
  const [registrationFee, setRegistrationFee] = useState('')
  const [gstAmount, setGstAmount] = useState('')
  const [notes, setNotes] = useState('')

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      let query = supabase.from('leads').select('id, name, phone, email').eq('is_active', true).order('created_at', { ascending: false }).limit(50)
      if (leadSearch) query = query.or(`name.ilike.%${leadSearch}%,phone.ilike.%${leadSearch}%`)
      const { data } = await query
      setLeads((data || []) as Lead[])
    }
    fetchLeads()
  }, [leadSearch])

  // Fetch properties + channel partners
  useEffect(() => {
    supabase.from('properties').select('id, name, city, developer').eq('is_active', true).order('name').then(({ data }) => {
      setProperties((data || []) as Property[])
    })
    supabase.from('profiles').select('id, full_name').eq('is_active', true).eq('role', 'channel_partner').order('full_name').then(({ data }) => {
      setChannelPartners((data || []) as { id: string; full_name: string }[])
    })
  }, [supabase])

  // Fetch units when property selected
  useEffect(() => {
    if (!selectedProperty) { setUnits([]); setSelectedUnit(''); return }
    supabase
      .from('units')
      .select('*')
      .eq('property_id', selectedProperty)
      .not('status', 'in', '("sold","not_released")')
      .order('unit_number')
      .then(({ data, error }) => {
        if (error) console.error('Failed to fetch units:', error)
        setUnits((data || []) as Unit[])
        setSelectedUnit('')
      })
  }, [selectedProperty, supabase])

  // Pre-fill buyer from lead
  useEffect(() => {
    if (!selectedLead) return
    const lead = leads.find(l => l.id === selectedLead)
    if (lead) {
      setBuyerName(lead.name)
      setBuyerPhone(lead.phone)
      setBuyerEmail(lead.email || '')
    }
  }, [selectedLead, leads])

  // Pre-fill pricing from unit
  useEffect(() => {
    if (!selectedUnit) return
    const unit = units.find(u => u.id === selectedUnit)
    if (unit?.total_price) {
      setAgreementValue(String(unit.total_price))
    }
  }, [selectedUnit, units])

  const netAmount = Number(agreementValue || 0) - Number(discount || 0)
  const totalPayable = netAmount + Number(stampDuty || 0) + Number(registrationFee || 0) + Number(gstAmount || 0)

  const handleSubmit = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('bookings').insert({
      lead_id: selectedLead,
      property_id: selectedProperty,
      unit_id: selectedUnit,
      channel_partner_id: selectedChannelPartner || null,
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      buyer_email: buyerEmail || null,
      buyer_pan: buyerPan || null,
      buyer_aadhaar: buyerAadhaar || null,
      buyer_address: buyerAddress || null,
      co_applicant_name: coApplicantName || null,
      co_applicant_pan: coApplicantPan || null,
      agreement_value: Number(agreementValue),
      discount: Number(discount || 0),
      net_amount: netAmount,
      stamp_duty: Number(stampDuty) || null,
      registration_fee: Number(registrationFee) || null,
      gst_amount: Number(gstAmount) || null,
      total_payable: totalPayable,
      status: 'draft',
      notes: notes || null,
      ...(Object.keys(docs).length > 0 && {
        documents: Object.entries(docs).map(([type, d]) => ({ type, name: d.name, url: d.url })),
      }),
    }).select('id').single()

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Update unit status
    await supabase.from('units').update({ status: 'booked', booked_by_lead: selectedLead }).eq('id', selectedUnit)
    // Update lead stage
    await supabase.from('leads').update({ stage: 'booking' }).eq('id', selectedLead)

    toast.success('Booking created successfully')
    router.push(`/crm/bookings/${data.id}`)
  }

  const inputClass = 'w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20 placeholder:text-altina-muted/50'
  const labelClass = 'mb-1.5 block text-sm font-medium text-altina-muted'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Booking</h1>
        <p className="text-sm text-altina-muted">Create a new property booking</p>
      </div>

      {/* Progress steps */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              s <= step ? 'bg-altina-gold text-black' : 'bg-white/10 text-altina-muted'
            }`}>{s}</div>
            <span className={`text-xs ${s <= step ? 'text-white' : 'text-altina-muted'}`}>
              {s === 1 ? 'Select' : s === 2 ? 'Buyer' : s === 3 ? 'Pricing' : 'Review'}
            </span>
            {s < 4 && <div className={`h-px flex-1 ${s < step ? 'bg-altina-gold' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        {/* Step 1: Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Select Lead, Property & Unit</h2>
            <div>
              <label className={labelClass}>Search Lead *</label>
              <input type="text" value={leadSearch} onChange={e => setLeadSearch(e.target.value)} placeholder="Search by name or phone..." className={inputClass} />
              {leads.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-[#1A1A1C]">
                  {leads.map(l => (
                    <button key={l.id} onClick={() => setSelectedLead(l.id)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 ${selectedLead === l.id ? 'bg-altina-gold/10 text-altina-gold' : 'text-white'}`}>
                      <span>{l.name}</span>
                      <span className="text-xs text-altina-muted">{l.phone}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Property *</label>
              <select value={selectedProperty} onChange={e => setSelectedProperty(e.target.value)} className={inputClass}>
                <option value="" className="bg-[#1A1A1C]">Select property...</option>
                {properties.map(p => <option key={p.id} value={p.id} className="bg-[#1A1A1C]">{p.name} - {p.city}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Unit *</label>
              <select value={selectedUnit} onChange={e => setSelectedUnit(e.target.value)} className={inputClass} disabled={!selectedProperty}>
                <option value="" className="bg-[#1A1A1C]">{selectedProperty ? (units.length === 0 ? 'No units found for this property' : 'Select unit...') : 'Select property first'}</option>
                {units.map(u => (
                  <option key={u.id} value={u.id} className="bg-[#1A1A1C]">
                    {u.unit_number} - {u.configuration} ({u.super_area ? `${u.super_area} sq.ft.` : ''}) {u.total_price ? formatINR(u.total_price) : ''} [{u.status}]
                  </option>
                ))}
              </select>
              {selectedProperty && units.length === 0 && (
                <p className="mt-1.5 text-xs text-amber-400">
                  No units found. Add units to this property first via{' '}
                  <a href={`/crm/properties/${selectedProperty}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-300">
                    Property Settings
                  </a>.
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Channel Partner / Sub-channel (if any)</label>
              <select value={selectedChannelPartner} onChange={e => setSelectedChannelPartner(e.target.value)} className={inputClass}>
                <option value="" className="bg-[#1A1A1C]">Direct (No channel partner)</option>
                {channelPartners.map(cp => <option key={cp.id} value={cp.id} className="bg-[#1A1A1C]">{cp.full_name}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Buyer Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Buyer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Full Name *</label><input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} className={inputClass} required /></div>
              <div><label className={labelClass}>Phone *</label><input type="tel" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} className={inputClass} required /></div>
              <div><label className={labelClass}>Email</label><input type="email" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>PAN</label><input type="text" value={buyerPan} onChange={e => setBuyerPan(e.target.value.toUpperCase())} className={inputClass} maxLength={10} /></div>
              <div><label className={labelClass}>Aadhaar</label><input type="text" value={buyerAadhaar} onChange={e => setBuyerAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))} className={inputClass} /></div>
              <div className="col-span-2"><label className={labelClass}>Address</label><textarea value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} className={inputClass} rows={2} /></div>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-altina-muted">Co-Applicant (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Name</label><input type="text" value={coApplicantName} onChange={e => setCoApplicantName(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>PAN</label><input type="text" value={coApplicantPan} onChange={e => setCoApplicantPan(e.target.value.toUpperCase())} className={inputClass} maxLength={10} /></div>
            </div>

            {/* Documents */}
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-altina-muted">KYC Documents</h3>
              <p className="mb-3 mt-0.5 text-xs text-altina-muted/60">JPEG, PNG, WebP or PDF · Max 5MB each</p>
              <div className="grid grid-cols-2 gap-3">
                {DOC_TYPES.map(({ key, label }) => {
                  const uploaded = docs[key]
                  const uploading = uploadingDocs[key]
                  return (
                    <div key={key}>
                      <label className={labelClass}>{label}</label>
                      {uploaded ? (
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                          <FileText size={14} className="shrink-0 text-altina-gold" />
                          <span className="min-w-0 flex-1 truncate text-xs text-white">{uploaded.name}</span>
                          <button type="button" onClick={() => removeDoc(key)} className="shrink-0 text-altina-muted transition-colors hover:text-white">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[key]?.click()}
                          disabled={uploading}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.01] px-3 py-2.5 text-xs text-altina-muted transition-colors hover:border-altina-gold/30 hover:text-white disabled:opacity-50"
                        >
                          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                      )}
                      <input
                        ref={el => { fileInputRefs.current[key] = el }}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadDoc(key, f) }}
                        className="hidden"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Cost Sheet</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Agreement Value *</label><input type="number" value={agreementValue} onChange={e => setAgreementValue(e.target.value)} className={inputClass} required /></div>
              <div><label className={labelClass}>Discount</label><input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Stamp Duty</label><input type="number" value={stampDuty} onChange={e => setStampDuty(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Registration Fee</label><input type="number" value={registrationFee} onChange={e => setRegistrationFee(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>GST</label><input type="number" value={gstAmount} onChange={e => setGstAmount(e.target.value)} className={inputClass} /></div>
            </div>
            {/* Summary */}
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-altina-muted">Agreement Value</span><span className="text-white">{formatINR(Number(agreementValue))}</span></div>
              <div className="flex justify-between text-sm"><span className="text-altina-muted">Discount</span><span className="text-red-400">-{formatINR(Number(discount))}</span></div>
              <div className="flex justify-between text-sm font-medium border-t border-white/10 pt-2"><span className="text-altina-muted">Net Amount</span><span className="text-white">{formatINR(netAmount)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-altina-muted">Stamp Duty + Reg + GST</span><span className="text-white">{formatINR(Number(stampDuty || 0) + Number(registrationFee || 0) + Number(gstAmount || 0))}</span></div>
              <div className="flex justify-between text-base font-bold border-t border-altina-gold/30 pt-2"><span className="text-altina-gold">Total Payable</span><span className="text-altina-gold">{formatINR(totalPayable)}</span></div>
            </div>
            <div><label className={labelClass}>Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} rows={3} /></div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Review & Confirm</h2>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-white/10 p-4 space-y-2">
                <p className="font-medium text-altina-gold">Buyer</p>
                <p className="text-white">{buyerName} | {buyerPhone} | {buyerEmail || 'No email'}</p>
                {buyerPan && <p className="text-altina-muted">PAN: {buyerPan}</p>}
                {selectedChannelPartner && (
                  <p className="text-altina-muted">Channel Partner: <span className="text-white">{channelPartners.find(cp => cp.id === selectedChannelPartner)?.full_name}</span></p>
                )}
              </div>
              <div className="rounded-xl border border-white/10 p-4 space-y-2">
                <p className="font-medium text-altina-gold">Property & Unit</p>
                <p className="text-white">{properties.find(p => p.id === selectedProperty)?.name}</p>
                <p className="text-altina-muted">Unit: {units.find(u => u.id === selectedUnit)?.unit_number} - {units.find(u => u.id === selectedUnit)?.configuration}</p>
              </div>
              <div className="rounded-xl border border-white/10 p-4 space-y-2">
                <p className="font-medium text-altina-gold">Total Payable</p>
                <p className="text-2xl font-bold text-white">{formatINR(totalPayable)}</p>
              </div>
              {Object.keys(docs).length > 0 && (
                <div className="rounded-xl border border-white/10 p-4 space-y-1">
                  <p className="font-medium text-altina-gold">Documents</p>
                  {Object.entries(docs).map(([key, d]) => {
                    const label = DOC_TYPES.find(t => t.key === key)?.label || key
                    return (
                      <p key={key} className="text-xs text-altina-muted">
                        ✓ {label} — <span className="text-white">{d.name}</span>
                      </p>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => step > 1 ? setStep((step - 1) as Step) : router.push('/crm/bookings')}
            className="rounded-xl border border-white/15 px-6 py-2.5 text-sm font-medium text-altina-muted hover:bg-white/5 hover:text-white"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((step + 1) as Step)}
              disabled={step === 1 && (!selectedLead || !selectedProperty || !selectedUnit)}
              className="rounded-xl bg-altina-gold px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-altina-gold px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
