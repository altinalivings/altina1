"use client";

type Dict = Record<string, any>;

const PIXEL_EVENT_MAP: Dict = {
  generate_lead: "Lead",
  contact: "Contact",
  brochure_download: "ViewContent",
  visit_request: "Lead",
  lead_modal_opened: "ViewContent",
};

const recent = new Set<string>();
function dedupe(key: string, windowMs = 1500) {
  if (recent.has(key)) return true;
  recent.add(key);
  setTimeout(() => recent.delete(key), windowMs);
  return false;
}

export function track(eventName: string, params: Dict = {}) {
  if (typeof window === "undefined") return;

  const key = `${eventName}:${JSON.stringify(params)}`;
  if (dedupe(key)) return;

  (window as any).dataLayer?.push({ event: eventName, ...params });

  const gtag = (window as any).gtag as ((...args: any[]) => void) | undefined;
  const send_to = process.env.NEXT_PUBLIC_GADS_SEND_TO;
  if (typeof gtag === "function") {
    try { gtag("event", eventName, { ...params, ...(send_to ? { send_to } : {}) }); } catch {}
  }

  const fbq = (window as any).fbq as ((...args: any[]) => void) | undefined;
  const pixelEvent = PIXEL_EVENT_MAP[eventName] ?? eventName;
  if (typeof fbq === "function") {
    try { fbq("track", pixelEvent, params); } catch {}
  }

  const lintrk = (window as any).lintrk as ((...args: any[]) => void) | undefined;
  if (typeof lintrk === "function") {
    try {
      const conv = process.env.NEXT_PUBLIC_LI_PARTNER;
      if (conv) lintrk("track", { conversion_id: conv });
    } catch {}
  }
}
