'use client'

import { STAGE_COLORS, QUALITY_COLORS, BOOKING_STATUS_COLORS, PAYMENT_STATUS_COLORS, VISIT_STATUS_COLORS, PRIORITY_COLORS } from '@/lib/crm/constants'
import { formatEnumLabel } from '@/lib/crm/formatters'

type BadgeVariant = 'stage' | 'quality' | 'booking' | 'payment' | 'visit' | 'priority' | 'default'

const COLOR_MAPS: Record<string, Record<string, { bg: string; text: string; border?: string }>> = {
  stage: STAGE_COLORS,
  quality: QUALITY_COLORS,
  booking: BOOKING_STATUS_COLORS,
  payment: PAYMENT_STATUS_COLORS,
  visit: VISIT_STATUS_COLORS,
  priority: PRIORITY_COLORS,
}

export default function Badge({
  label,
  variant = 'default',
  size = 'sm',
}: {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md'
}) {
  const map = COLOR_MAPS[variant]
  const colors = map?.[label]

  const bg = colors?.bg || 'bg-white/10'
  const text = colors?.text || 'text-altina-muted'
  const border = (colors as { border?: string })?.border || 'border-white/10'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${bg} ${text} ${border} ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
      }`}
    >
      {formatEnumLabel(label)}
    </span>
  )
}
