// src/components/PopupOnIdle.tsx
'use client'

import { useEffect, useState } from 'react'
import EnquiryForm from '@/components/EnquiryForm'

export default function PopupOnIdle() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // only show once per session
    if (sessionStorage.getItem('enquiryShown') === '1') return
    const t = setTimeout(() => {
      setShow(true)
      sessionStorage.setItem('enquiryShown', '1')
    }, 10000) // 10s
    return () => clearTimeout(t)
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 grid place-items-center p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0C] p-6 text-[#F7F7F5]">
        <button
          type="button"
          aria-label="Close"
          onClick={() => setShow(false)}
          className="absolute right-3 top-3 text-white/70 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-xl font-semibold mb-3">Get in touch</h3>
        <EnquiryForm />
      </div>
    </div>
  )
}
