// src/lib/attribution.ts
'use client'

export type Attribution = {
  source?: string
  page?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
  last_touch_ts?: string
  last_touch_page?: string
  first_touch_source?: string
  first_touch_medium?: string
  first_touch_campaign?: string
  first_touch_term?: string
  first_touch_content?: string
  first_touch_gclid?: string
  first_touch_fbclid?: string
  first_touch_msclkid?: string
  first_landing_page?: string
  first_landing_ts?: string
  session_id?: string
  ga_cid?: string
  referrer?: string
  language?: string
  timezone?: string
  viewport?: string
  screen?: string
  device_type?: string
  userAgent?: string
  project?: string
  mode?: string
  time?: string
  __raw_payload?: any
  ts?: string
}

const FIRST_KEY = 'altina_first_touch_v1'
const SESSION_KEY = 'altina_session_id_v1'

function parseQuery(qs: string) {
  const params = new URLSearchParams(qs)
  const get = (k: string) => params.get(k) || undefined
  return {
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    utm_term: get('utm_term'),
    utm_content: get('utm_content'),
    gclid: get('gclid'),
    fbclid: get('fbclid'),
    msclkid: get('msclkid'),
  }
}

function deviceType() {
  if (typeof navigator === 'undefined') return ''
  const ua = navigator.userAgent.toLowerCase()
  if (/mobile|iphone|android/.test(ua)) return 'mobile'
  if (/ipad|tablet/.test(ua)) return 'tablet'
  return 'desktop'
}

export function initAttributionOnce() {
  if (typeof window === 'undefined') return
  try {
    // session id
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, crypto.randomUUID?.() || String(Date.now()))
    }
    const now = new Date().toISOString()
    const q = parseQuery(window.location.search)
    const current = {
      source: document.referrer ? 'referral' : 'direct',
      page: window.location.href,
      ...q,
      last_touch_ts: now,
      last_touch_page: window.location.href,
      referrer: document.referrer || '',
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screen: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : '',
      device_type: deviceType(),
      userAgent: navigator.userAgent,
      ts: now,
    } as Partial<Attribution>

    // first touch
    const firstRaw = localStorage.getItem(FIRST_KEY)
    if (!firstRaw) {
      const first = {
        first_touch_source: current.utm_source || current.source,
        first_touch_medium: current.utm_medium,
        first_touch_campaign: current.utm_campaign,
        first_touch_term: current.utm_term,
        first_touch_content: current.utm_content,
        first_touch_gclid: current.gclid,
        first_touch_fbclid: current.fbclid,
        first_touch_msclkid: current.msclkid,
        first_landing_page: current.page,
        first_landing_ts: now,
      }
      localStorage.setItem(FIRST_KEY, JSON.stringify(first))
    }
  } catch {}
}

export function getAttribution(extra?: Partial<Attribution>): Attribution {
  if (typeof window === 'undefined') return { ...extra } as Attribution
  const now = new Date().toISOString()
  const q = parseQuery(window.location.search)
  let first = {}
  try { first = JSON.parse(localStorage.getItem(FIRST_KEY) || '{}') } catch {}
  const session_id = sessionStorage.getItem(SESSION_KEY) || ''
  const ga_cid = (document.cookie.match(/_ga=GA\\d+\\.\\d+\\.(\\d+\\.\\d+)/)?.[1] || '')
  const base: Attribution = {
    source: document.referrer ? 'referral' : 'direct',
    page: window.location.href,
    ...q,
    last_touch_ts: now,
    last_touch_page: window.location.href,
    session_id,
    ga_cid,
    referrer: document.referrer || '',
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    screen: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : '',
    device_type: deviceType(),
    userAgent: navigator.userAgent,
    time: now,
    ts: now,
    __raw_payload: { location: window.location.href, search: window.location.search },
    ...(first as any),
    ...(extra || {}),
  }
  return base
}
