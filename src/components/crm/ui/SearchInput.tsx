'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), debounceMs)
    return () => clearTimeout(timer)
  }, [local, debounceMs, onChange])

  useEffect(() => {
    setLocal(value)
  }, [value])

  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-transparent px-3 py-2">
      <Search size={16} className="shrink-0 text-altina-muted" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-altina-muted/50"
      />
      {local && (
        <button onClick={() => { setLocal(''); onChange('') }}>
          <X size={14} className="text-altina-muted hover:text-white" />
        </button>
      )}
    </div>
  )
}
