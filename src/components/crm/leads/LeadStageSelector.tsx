'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { LEAD_STAGES, STAGE_COLORS } from '@/lib/crm/constants'
import type { LeadStage } from '@/types/crm'

export default function LeadStageSelector({
  value,
  onChange,
  disabled,
}: {
  value: LeadStage
  onChange: (stage: LeadStage) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentStage = LEAD_STAGES.find((s) => s.value === value)
  const colors = STAGE_COLORS[value]

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
          disabled
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer hover:bg-white/5'
        } ${colors.border} border-white/15 bg-transparent`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${colors.bg} ${colors.border} border`}
          style={{ boxShadow: `0 0 6px ${colors.text.replace('text-', '').includes('altina') ? '#C9A227' : ''}` }}
        >
          <span className={`block h-full w-full rounded-full ${colors.text.replace('text-', 'bg-')}`} />
        </span>
        <span className={colors.text}>{currentStage?.label || value}</span>
        <ChevronDown size={14} className={`text-altina-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-52 rounded-xl border border-white/10 bg-[#1A1A1C] py-1 shadow-2xl">
          {LEAD_STAGES.map((stage) => {
            const sc = STAGE_COLORS[stage.value]
            const isActive = stage.value === value
            return (
              <button
                key={stage.value}
                type="button"
                onClick={() => {
                  onChange(stage.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-white/5' : 'hover:bg-white/[0.03]'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${sc.text.replace('text-', 'bg-')}`} />
                <span className={`flex-1 text-left ${isActive ? 'text-white font-medium' : 'text-altina-muted'}`}>
                  {stage.label}
                </span>
                {isActive && <Check size={14} className="text-altina-gold" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
