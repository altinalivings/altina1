"use client"
import { useMemo, useState } from 'react'
import ProjectCard from './ProjectCard'

export default function ProjectsExplorer({ items, hideFilters = false }: { items: any[]; hideFilters?: boolean }) {
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [location, setLocation] = useState('')
  const [ptype, setPtype] = useState('')

  const cityOptions = useMemo(
    () => Array.from(new Set(items.map((p: any) => (p.city || '').trim()).filter(Boolean))).sort(),
    [items]
  )
  const typeOptions = ['Apartment', 'Luxury Apartment', 'Villa', 'Plot', 'Commercial']

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim()
    const locTerm = location.toLowerCase()

    return items.filter((p: any) => {
      const matchesQ = !term
        ? true
        : [p.name, p.developer, p.location].join(' ').toLowerCase().includes(term)

      const matchesCity = !city || (p.city || '').toLowerCase() === city.toLowerCase()
      const matchesLoc = !locTerm || (p.location || '').toLowerCase().includes(locTerm)

      const conf = (p.configuration || '').toLowerCase()
      const matchesType = !ptype || conf.includes(ptype.toLowerCase())

      return matchesQ && matchesCity && matchesLoc && matchesType
    })
  }, [items, q, city, location, ptype])

  return (
    <div className="grid gap-4">
      {!hideFilters && (
        <div className="card p-3 sticky top-6 z-10">
          <div className="grid gap-2 sm:grid-cols-5">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search DLF, M3M, Sobha, Godrej…"
              className="sm:col-span-2 rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
              aria-label="Search"
            />
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
              aria-label="City"
            >
              <option value="" className="bg-[#0B0B0C] text-altina-ivory">City</option>
              {cityOptions.map((c) => (
                <option key={c} value={c} className="bg-[#0B0B0C] text-altina-ivory">{c}</option>
              ))}
            </select>
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Location"
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
              aria-label="Location"
            />
            <select
              value={ptype}
              onChange={e => setPtype(e.target.value)}
              className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory focus:outline-none focus:ring-2 focus:ring-altina-gold/40 focus:border-altina-gold/60"
              aria-label="Property Type"
            >
              <option value="" className="bg-[#0B0B0C] text-altina-ivory">Property Type</option>
              {typeOptions.map((t) => (
                <option key={t} value={t} className="bg-[#0B0B0C] text-altina-ivory">{t}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p: any) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  )
}
