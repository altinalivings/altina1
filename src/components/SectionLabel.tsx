/*
 * SectionLabel component
 *
 * Displays a small uppercase label with a fading gold divider. Use it to
 * introduce sections elegantly. The gradient line fades out toward the right.
 */
export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-caps text-sm text-white/70">{children}</span>
      <span
        className="h-px flex-1"
        style={{ background: 'linear-gradient(90deg, #C9A227, transparent)' }}
      />
    </div>
  )
}