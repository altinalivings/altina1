// src/components/BrochureDialog.tsx
"use client"

import { useRef, useState } from 'react'

interface BrochureDialogProps {
  brochureUrl: string
  scriptUrl: string
  projectName: string
  triggerLabel?: string
}

export default function BrochureDialog({
  brochureUrl,
  scriptUrl,
  projectName,
  triggerLabel = 'Download brochure',
}: BrochureDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return
    if (!consent) return
    const fd = new FormData(formRef.current)
    fd.set('project', projectName)
    setLoading(true)
    try {
      await fetch(scriptUrl, { method: 'POST', body: fd as any, mode: 'no-cors' })

      // Trigger brochure download
      const a = document.createElement('a')
      a.href = brochureUrl
      a.download = ''
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setOpen(false)
      formRef.current.reset()
      setConsent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn border border-white/20 hover:border-white/50 text-xs"
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>

      <div
        className={`fixed inset-0 z-[80] transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-4 top-4 left-4 md:left-auto md:right-8 md:top-10 w-auto md:w-[420px] rounded-2xl p-5 bg-[#0B0B0C] text-[#F7F7F5] border transition-transform duration-200 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          style={{ borderColor: 'rgba(192,192,192,0.18)' }}
        >
          <div className="text-base font-semibold">Get the brochure</div>
          <p className="text-white/70 text-sm mt-1">Enter your details to download.</p>

          <form ref={formRef} onSubmit={onSubmit} className="mt-4 grid gap-3">
            <input name="name" required placeholder="Full name" className="rounded-xl bg-transparent border p-3" style={{ borderColor: 'rgba(192,192,192,0.25)' }} />
            <input name="phone" required placeholder="Phone" className="rounded-xl bg-transparent border p-3" style={{ borderColor: 'rgba(192,192,192,0.25)' }} />
            <input name="email" type="email" required placeholder="Email" className="rounded-xl bg-transparent border p-3" style={{ borderColor: 'rgba(192,192,192,0.25)' }} />

            {/* Consent (always) */}
            <label className="mt-1 flex items-start gap-2 text-xs text-neutral-300">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent" />
              <span>I authorize company representatives to Call, SMS, Email or WhatsApp me about its products and offers. This consent overrides any registration for DNC/NDNC.</span>
            </label>

            <div className="flex gap-3 pt-1">
              <button type="submit" className="btn btn-emerald" disabled={loading}>
                {loading ? 'Sending…' : 'Submit & download'}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn btn-gold">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}