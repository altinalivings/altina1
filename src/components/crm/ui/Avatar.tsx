'use client'

import { getInitials } from '@/lib/crm/formatters'

export default function Avatar({
  name,
  src,
  size = 'md',
}: {
  name: string | null | undefined
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-sm',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        className={`rounded-full object-cover ${sizeClasses[size]}`}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-altina-gold/20 font-semibold text-altina-gold ${sizeClasses[size]}`}
    >
      {getInitials(name)}
    </div>
  )
}
