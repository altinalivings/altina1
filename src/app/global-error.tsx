// src/app/global-error.tsx
'use client'

/**
 * Safe global error boundary that avoids <html>/<body> tags
 * (some bundlers choke on those in client modules).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // console.error('[app/global-error.tsx]', error)

  return (
    <div
      style={{
        maxWidth: 840,
        margin: '40px auto',
        padding: 24,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        fontFamily: 'ui-sans-serif, system-ui',
      }}
    >
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Global error</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error?.message || error)}</pre>
      <div style={{ height: 12 }} />
      <button
        type="button"
        onClick={() => reset()}
        style={{
          padding: '8px 14px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        Try again
      </button>
    </div>
  )
}
