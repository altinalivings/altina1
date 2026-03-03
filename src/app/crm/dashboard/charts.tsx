'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
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

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 24, top: 4, bottom: 4 }}>
        <XAxis
          type="number"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={110}
          tick={{ fill: '#D1D5DB', fontSize: 12 }}
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
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={entry.fill} />
          ))}
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
    return <p className="py-12 text-center text-sm text-altina-muted">No source data</p>
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
