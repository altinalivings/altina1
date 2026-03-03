'use client'

export default function ProgressBar({
  value,
  max = 100,
  label,
  color = 'bg-altina-gold',
  size = 'sm',
}: {
  value: number
  max?: number
  label?: string
  color?: string
  size?: 'sm' | 'md'
}) {
  const pct = Math.min((value / max) * 100, 100)

  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-altina-muted">{label}</span>
          <span className="font-medium text-white">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-white/10 ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
