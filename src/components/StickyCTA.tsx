'use client'

import Link from 'next/link'

export default function StickyCTA() {
  return (
    <div className="fixed top-1/2 right-0 z-40 flex flex-col gap-3 pr-2 transform -translate-y-1/2">
      <a
        href="#call"
        className="bg-gold text-black rounded-l-full px-4 py-2 text-sm font-semibold hover:scale-105 transition-transform"
      >
        Request a Call
      </a>

      <a
        href="#visit"
        className="bg-gold text-black rounded-l-full px-4 py-2 text-sm font-semibold hover:scale-105 transition-transform"
      >
        Organize Visit
      </a>

      <button type="button"
        onClick={() => {
          const el = document.getElementById('brochure-popup')
          if (el) el.classList.remove('hidden')
        }}
        className="bg-gold text-black rounded-l-full px-4 py-2 text-sm font-semibold hover:scale-105 transition-transform"
      >
        Get Brochure
      </button>
    </div>
  )
}
