'use client'

export default function LeadScoreBadge({
  score,
  size = 'md',
}: {
  score: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const clamped = Math.max(0, Math.min(100, score))

  const color =
    clamped <= 30
      ? { ring: 'ring-red-500/40', text: 'text-red-400', bg: 'bg-red-500/15', stroke: '#ef4444' }
      : clamped <= 60
        ? { ring: 'ring-amber-500/40', text: 'text-amber-400', bg: 'bg-amber-500/15', stroke: '#f59e0b' }
        : { ring: 'ring-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500/15', stroke: '#10b981' }

  const sizeConfig = {
    sm: { outer: 'h-8 w-8', text: 'text-[10px]', svgSize: 32, radius: 12, strokeWidth: 2.5 },
    md: { outer: 'h-10 w-10', text: 'text-xs', svgSize: 40, radius: 16, strokeWidth: 3 },
    lg: { outer: 'h-14 w-14', text: 'text-sm', svgSize: 56, radius: 22, strokeWidth: 3.5 },
  }

  const cfg = sizeConfig[size]
  const circumference = 2 * Math.PI * cfg.radius
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${cfg.outer}`}>
      <svg
        width={cfg.svgSize}
        height={cfg.svgSize}
        className="-rotate-90"
      >
        <circle
          cx={cfg.svgSize / 2}
          cy={cfg.svgSize / 2}
          r={cfg.radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={cfg.strokeWidth}
        />
        <circle
          cx={cfg.svgSize / 2}
          cy={cfg.svgSize / 2}
          r={cfg.radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={cfg.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span className={`absolute font-bold ${cfg.text} ${color.text}`}>
        {clamped}
      </span>
    </div>
  )
}
