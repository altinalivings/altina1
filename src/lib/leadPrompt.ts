// src/lib/leadPrompt.ts
// Centralized singleton event bus + helpers to open/close the unified lead modal
// Prevents duplicate popups when multiple components (AutoCallbackPrompt/IdleTrigger/etc.) fire.
'use client';

export type Mode = 'callback' | 'visit' | 'brochure' | 'enquiry' | 'contact';

export type LeadOpenDetail = {
  mode: Mode;
  projectId?: string | null;
  projectName?: string | null;
  source?: string | null;
};

type LeadOpenEvent = CustomEvent<LeadOpenDetail>;

// Put the event target on window so all islands share it
declare global {
  interface Window {
    __altinaLeadBus?: EventTarget;
    __altinaLeadState?: {
      isOpen: boolean;
      lastSig?: string;
      lastTs?: number;
    }
  }
}

function getBus(): EventTarget {
  if (typeof window === 'undefined') {
    // SSR no-op shim
    return new EventTarget();
  }
  if (!window.__altinaLeadBus) window.__altinaLeadBus = new EventTarget();
  if (!window.__altinaLeadState) window.__altinaLeadState = { isOpen: false };
  return window.__altinaLeadBus!;
}

function payloadSignature(d: LeadOpenDetail) {
  return JSON.stringify({
    m: d.mode, p: d.projectId ?? null, n: d.projectName ?? null, s: d.source ?? null
  });
}

/** Open the modal, with duplicate guard to avoid double pop-ups. */
export function openLeadModal(detail: LeadOpenDetail) {
  if (typeof window === 'undefined') return;
  const bus = getBus();
  const st = window.__altinaLeadState!;
  const sig = payloadSignature(detail);
  const now = Date.now();

  // Ignore if the same request fired within 1200ms (covers double timers / race)
  if (st.lastSig === sig && st.lastTs && (now - st.lastTs) < 1200) return;
  st.lastSig = sig;
  st.lastTs = now;

  bus.dispatchEvent(new CustomEvent<LeadOpenDetail>('lead:open', { detail }));
}

/** Tell listeners to close the modal */
export function closeLeadModal() {
  if (typeof window === 'undefined') return;
  const bus = getBus();
  bus.dispatchEvent(new Event('lead:close'));
}

/** Subscribe helpers (used by LeadBus) */
export function onLeadOpen(handler: (d: LeadOpenDetail) => void) {
  const bus = getBus();
  const fn = (ev: Event) => handler((ev as LeadOpenEvent).detail);
  bus.addEventListener('lead:open', fn as EventListener);
  return () => bus.removeEventListener('lead:open', fn as EventListener);
}

export function onLeadClose(handler: () => void) {
  const bus = getBus();
  bus.addEventListener('lead:close', handler as EventListener);
  return () => bus.removeEventListener('lead:close', handler as EventListener);
}
