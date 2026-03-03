'use client'

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  required,
  className = '',
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-altina-muted">
          {label}
          {required && <span className="text-red-400"> *</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-altina-gold/50 focus:ring-2 focus:ring-altina-gold/20"
      >
        <option value="" className="bg-[#1A1A1C]">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1A1A1C]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
