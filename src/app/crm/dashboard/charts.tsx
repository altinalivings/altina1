'use client'

import {
  Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'

// ── Pipeline Horizontal Bar Chart ──

type PipelineItem = {
  stage: string
  label: string
  count: number
  fill: string
}

export function PipelineChart({ data }: { data: PipelineItem[] }) {
  if (!data.length) {
    return <p className="py-12 text-center text-sm text-altina-muted">No pipeline data</p>
  }

  const hasData = data.some((d) => d.count > 0)

  // Custom styled pipeline — render all stages with proportional bars
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="space-y-2.5 py-2">
      {data.map((item) => {
        const pct = hasData ? (item.count / maxCount) * 100 : 0
        // Minimum visible width for non-zero counts, or a tiny sliver for zero
        const barWidth = item.count > 0 ? Math.max(pct, 5) : 2
        return (
          <div key={item.stage} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-right text-xs font-medium text-gray-400">
              {item.label}
            </span>
            <div className="relative flex-1 h-7 rounded-md overflow-hidden bg-white/[0.04]">
              <div
                className="absolute inset-y-0 left-0 rounded-md transition-all duration-500"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: item.fill,
                  opacity: item.count > 0 ? 0.85 : 0.25,
                }}
              />
              {item.count > 0 && (
                <span className="absolute inset-y-0 flex items-center text-[11px] font-semibold text-white/90"
                  style={{ left: `calc(${barWidth}% + 8px)` }}
                >
                  {item.count}
                </span>
              )}
            </div>
            <span className="w-8 text-right text-xs font-semibold text-gray-500">
              {item.count}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Source Pie Chart ──

type SourceItem = {
  source: string
  label: string
  count: number
  fill: string
}

export function SourcePieChart({ data }: { data: SourceItem[] }) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-altina-muted">
        <div className="mb-3 h-24 w-24 rounded-full border-2 border-dashed border-white/10" />
        <p className="text-sm">No source data yet</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="45%"
          outerRadius={100}
          innerRadius={55}
          stroke="rgba(11,11,12,0.6)"
          strokeWidth={2}
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A1A1C',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            color: '#F7F7F5',
            fontSize: 13,
          }}
          formatter={(value: number, name: string) => [value, name]}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span className="text-xs text-gray-400">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
