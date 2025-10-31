'use client'

import { useEffect, useState } from 'react'
import { getAttribution } from '@/lib/attribution'
import { submitLead } from '@/lib/leadSubmit'

export default function BrochureModal({ project }: { project: any }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const brochureUrl = project?.brochure

  useEffect(() => {
    const h = () => setOpen(true)
    window.addEventListener('open-brochure', h as any)
    return () => window.removeEventListener('open-brochure', h as any)
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
  const isValidPhone = (s: string) => /^\d{10}$/.test(s)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !isValidPhone(form.phone) || !isValidEmail(form.email)) return

    try {
      setBusy(true)
      const attrib = getAttribution({ project: project?.name, mode: 'brochure' })

      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: 'Brochure request',
        project: project?.name,
        mode: 'brochure',
        // attribution / headers (kept consistent with your sheet):
        source: attrib.source,
        page: attrib.page,
        utm_source: attrib.utm_source,
        utm_medium: attrib.utm_medium,
        utm_campaign: attrib.utm_campaign,
        utm_term: attrib.utm_term,
        utm_content: attrib.utm_content,
        gclid: attrib.gclid,
        fbclid: attrib.fbclid,
        msclkid: attrib.msclkid,
        last_touch_ts: attrib.last_touch_ts,
        last_touch_page: attrib.last_touch_page,
        first_touch_source: attrib.first_touch_source,
        first_touch_medium: attrib.first_touch_medium,
        first_touch_campaign: attrib.first_touch_campaign,
        first_touch_term: attrib.first_touch_term,
        first_touch_content: attrib.first_touch_content,
        first_touch_gclid: attrib.first_touch_gclid,
        first_touch_fbclid: attrib.first_touch_fbclid,
        first_touch_msclkid: attrib.first_touch_msclkid,
        first_landing_page: attrib.first_landing_page,
        first_landing_ts: attrib.first_landing_ts,
        session_id: attrib.session_id,
        ga_cid: attrib.ga_cid,
        referrer: attrib.referrer,
        language: attrib.language,
        timezone: attrib.timezone,
        viewport: attrib.viewport,
        screen: attrib.screen,
        device_type: attrib.device_type,
        userAgent: attrib.userAgent,
        time: attrib.time,
        __raw_payload: attrib.__raw_payload,
        first_touch_page: attrib.first_landing_page, // alias
        first_touch_ts: attrib.first_landing_ts,     // alias
        ts: attrib.ts,
      }

      await submitLead(payload)

      // Auto-download brochure
      if (brochureUrl) {
        const a = document.createElement('a')
        a.href = brochureUrl
        a.download = ''
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }

      setDone(true)
      setTimeout(() => setOpen(false), 5000)
    } catch (e) {
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0C] p-6 text-[#F7F7F5] shadow-xl max-h-[85vh] overflow-auto">
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-white/70 hover:text-white"
        >✕</button>

        {!done ? (
          <>
            <h3 className="text-xl font-semibold mb-1">Get the brochure</h3>
            <p className="text-sm text-white/70 mb-4">Enter your details to download.</p>

            <form onSubmit={onSubmit} className="space-y-3 text-sm">
              <input
                name="name" value={form.name} onChange={onChange} placeholder="Full name" required
                className="w-full rounded-md bg-black/20 border border-white/20 px-4 py-2 outline-none focus:border-white/50"
              />
              <input
                name="phone" value={form.phone} onChange={onChange} placeholder="Phone" required
                className="w-full rounded-md bg-black/20 border border-white/20 px-4 py-2 outline-none focus:border-white/50"
              />
              <input
                type="email" name="email" value={form.email} onChange={onChange} placeholder="Email" required
                className="w-full rounded-md bg-black/20 border border-white/20 px-4 py-2 outline-none focus:border-white/50"
              />
              <button
                type="submit" disabled={busy}
                className="w-full rounded-full px-5 py-2 font-medium shadow-[0_8px_30px_rgba(0,0,0,.35)] transition-transform hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#D9B64C,#C9A227,#9C7C1F)', color: '#111' }}
              >
                {busy ? 'Submitting…' : 'Submit & download'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
            <p className="text-sm text-white/80">Your brochure download has started. This will close automatically.</p>
          </>
        )}
      </div>
    </div>
  )
}