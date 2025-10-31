// src/lib/track.ts
export type LeadPayload = {
  mode?: "contact" | "callback" | "visit" | "brochure" | string;
  project?: string;
  label?: string;
  value?: number;
};

export function trackLead(payload: LeadPayload = {}) {
  if (typeof window === "undefined") return;
  (window as any).altinaTrack?.lead?.(payload);
}

export function trackContact(payload: LeadPayload = {}) {
  if (typeof window === "undefined") return;
  (window as any).altinaTrack?.contact?.(payload);
}
