'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
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

  // Custom styled pipeline — works great with 0 data too
  if (!hasData) {
    return (
      <div className="space-y-2.5 py-2">
        {data.map((item) => (
          <div key={item.stage} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-right text-xs font-medium text-gray-400">
              {item.label}
            </span>
            <div className="relative flex-1 h-7 rounded-md overflow-hidden bg-white/[0.04]">
              <div
                className="absolute inset-y-0 left-0 rounded-md"
                style={{ width: '2%', backgroundColor: item.fill, opacity: 0.4 }}
              />
            </div>
            <span className="w-8 text-right text-xs font-semibold text-gray-500">0</span>
          </div>
        ))}
      </div>
    )
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 40, top: 4, bottom: 4 }}
      >
        <XAxis
          type="number"
          tick={{ fill: '#6B7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          domain={[0, Math.ceil(maxCount * 1.2)]}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={100}
          tick={{ fill: '#D1D5DB', fontSize: 12, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            backgroundColor: '#1A1A1C',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            color: '#F7F7F5',
            fontSize: 13,
          }}
          labelStyle={{ color: '#9CA3AF' }}
          formatter={(value: number) => [value, 'Leads']}
        />
        <Bar
          dataKey="count"
          radius={[0, 6, 6, 0]}
          maxBarSize={26}
          minPointSize={4}
          background={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }}
        >
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={entry.fill} fillOpacity={0.85} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            style={{ fill: '#D1D5DB', fontSize: 12, fontWeight: 600 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
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
