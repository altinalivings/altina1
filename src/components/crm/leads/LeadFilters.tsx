'use client'

import { useCallback } from 'react'
import SearchInput from '@/components/crm/ui/SearchInput'
import Select from '@/components/crm/ui/Select'
import { LEAD_STAGES, LEAD_SOURCES } from '@/lib/crm/constants'
import type { LeadStage, LeadSource, LeadQuality } from '@/types/crm'

export type LeadFilterState = {
  search: string
  stage: LeadStage | ''
  source: LeadSource | ''
  quality: LeadQuality | ''
}

const QUALITY_OPTIONS: { value: string; label: string }[] = [
  { value: 'hot', label: 'Hot' },
  { value: 'warm', label: 'Warm' },
  { value: 'cold', label: 'Cold' },
  { value: 'dead', label: 'Dead' },
]

export default function LeadFilters({
  filters,
  onChange,
}: {
  filters: LeadFilterState
  onChange: (filters: LeadFilterState) => void
}) {
  const update = useCallback(
    (patch: Partial<LeadFilterState>) => {
      onChange({ ...filters, ...patch })
    },
    [filters, onChange]
  )

  const hasActiveFilters = filters.stage || filters.source || filters.quality

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput
            value={filters.search}
            onChange={(v) => update({ search: v })}
            placeholder="Search by name, phone, or email..."
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.stage}
          onChange={(v) => update({ stage: v as LeadStage | '' })}
          options={LEAD_STAGES}
          placeholder="All Stages"
          className="w-40"
        />
        <Select
          value={filters.source}
          onChange={(v) => update({ source: v as LeadSource | '' })}
          options={LEAD_SOURCES}
          placeholder="All Sources"
          className="w-40"
        />
        <Select
          value={filters.quality}
          onChange={(v) => update({ quality: v as LeadQuality | '' })}
          options={QUALITY_OPTIONS}
          placeholder="All Quality"
          className="w-36"
        />

        {hasActiveFilters && (
          <button
            onClick={() =>
              onChange({ search: filters.search, stage: '', source: '', quality: '' })
            }
            className="rounded-xl px-3 py-2 text-xs font-medium text-altina-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
