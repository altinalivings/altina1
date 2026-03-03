'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-altina-muted">{title}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          {change && (
            <div className="mt-2 flex items-center gap-1">
              {trend === 'up' && <TrendingUp size={14} className="text-green-400" />}
              {trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
              <span
                className={`text-xs font-medium ${
                  trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-altina-muted'
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-altina-gold/10 text-altina-gold">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
