/*
 * MobileCTA component
 *
 * Shows a sticky bottom bar on mobile screens with three actions: Call,
 * WhatsApp and Enquire. It appears after scrolling past a threshold and
 * disappears when near the top. You can customise phone number and
 * WhatsApp link. Events are tracked separately via GA/FB tags already wired.
 */
'use client'
import { useEffect, useState } from 'react'

export default function MobileCTA() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      className={`fixed bottom-3 left-0 right-0 z-50 md:hidden transition-all ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="mx-auto max-w-md">
        <div className="grid grid-cols-3 gap-2 px-3">
          <a
            href="tel:+91XXXXXXXXXX"
            className="btn bg-white/10 border border-white/20 text-white text-xs"
          >
            Call
          </a>
          <a
            href="https://wa.me/91XXXXXXXXXX?text=Hi%20Altina%20Team"
            className="btn btn-emerald text-xs"
          >
            WhatsApp
          </a>
          <a
            href="#lead"
            className="btn bg-white/10 border border-white/20 text-white text-xs"
          >
            Enquire
          </a>
        </div>
      </div>
    </div>
  )
}
