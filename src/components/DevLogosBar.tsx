/*
 * DevLogosBar component
 *
 * Displays a row of developer logos (DLF, M3M, Sobha, Godrej). Each logo
 * should be added to the public/logos directory. If you don’t have SVGs yet,
 * you can replace the Image components with simple text placeholders.
 */
import Image from 'next/image'

const developers = [
  { name: 'DLF', src: '/logos/dlf.svg' },
  { name: 'M3M', src: '/logos/m3m.svg' },
  { name: 'Sobha', src: '/logos/sobha.svg' },
  { name: 'Godrej', src: '/logos/godrej.svg' },
]

export default function DevLogosBar() {
  return (
    <div className="card p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center opacity-90">
        {developers.map((dev) => (
          <div key={dev.name} className="h-10 relative w-28">
            <Image src={dev.src} alt={dev.name} fill className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}
