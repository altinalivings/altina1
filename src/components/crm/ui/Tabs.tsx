'use client'

export default function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string; count?: number }[]
  active: string
  onChange: (key: string) => void
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-white/5 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            active === tab.key
              ? 'bg-altina-gold/20 text-altina-gold'
              : 'text-altina-muted hover:text-white'
          }`}
        >
          {tab.label}
          {tab.count != null && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                active === tab.key ? 'bg-altina-gold/30' : 'bg-white/10'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
