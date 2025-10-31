// src/components/BrochureLeadGate.tsx
'use client'

type GateProps = {
  open: boolean
  onClose: () => void
  projectId?: string
  projectName?: string
}

export default function BrochureLeadGate({
  open,
  onClose,
  projectId,
  projectName,
}: GateProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0C] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Download Brochure</h3>
            {(projectName || projectId) && (
              <p className="text-sm opacity-70">{projectName || projectId}</p>
            )}
          </div>
          <button
            type="button"
            className="px-2 py-1 rounded-md border border-white/10"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="mt-4">
          {/* Place your lead form here to unlock brochure */}
          {/* <LeadForm project={projectName} /> */}
        </div>
      </div>
    </div>
  )
}

/**
 * Named export expected by /app/brochure/[id]/page.tsx
 * Accepts both `href` and `brochureUrl` (alias) to be backwards compatible.
 */
export function GatedDownloadButton({
  href,
  brochureUrl,
  children = 'Download Brochure',
  projectId,
  projectName,
  className,
}: {
  href?: string
  brochureUrl?: string
  children?: React.ReactNode
  projectId?: string
  projectName?: string
  className?: string
}) {
  const finalHref = href || brochureUrl

  const onClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('lead:open', {
          detail: { mode: 'brochure', projectId, projectName, href: finalHref },
        }),
      )
    }
  }

  return (
    <button type="button" onClick={onClick} className={className || 'btn btn-gold'}>
      {children}
    </button>
  )
}
