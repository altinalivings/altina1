'use client'

import { useEffect, useState } from 'react'
import EnquiryForm from '@/components/EnquiryForm'

export default function CallbackModal({ projectName }: { projectName?: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-callback', handler as any)
    return () => window.removeEventListener('open-callback', handler as any)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 grid place-items-center p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0C] p-6 text-[#F7F7F5]">
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-white/70 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-xl font-semibold mb-3">Request a callback</h3>
        <EnquiryForm mode="callback" projectName={projectName} onSubmitted={() => setOpen(false)} />
      </div>
    </div>
  )
}
