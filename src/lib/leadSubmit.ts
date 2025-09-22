// src/lib/leadSubmit.ts
'use client'

export type LeadPayload = Record<string, any>

/**
 * Sends a "simple" POST (text/plain + JSON string) to Google Apps Script to avoid CORS preflight.
 * Matches what your Organize Visit flow is doing.
 */
export async function submitLead(payload: LeadPayload) {
  const scriptUrl =
    process.env.NEXT_PUBLIC_APPS_SCRIPT ||
    'https://script.google.com/macros/s/AKfycbyaT79B9lI8SQRKMT92dxvJGBIHvuV1SOhjCszEocDUqqkwdnOYmI9pG5bhfBfXdf8H2g/exec'

  const res = await fetch(scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // IMPORTANT: simple request (no preflight)
    body: JSON.stringify(payload),
  })

  // Apps Script often returns opaque on no-cors—treat that as OK if not explicitly failing.
  if (!res.ok && res.type !== 'opaque') {
    const text = await res.text().catch(() => '')
    throw new Error(`Lead submit failed ${res.status}: ${text}`)
  }

  return true
}
