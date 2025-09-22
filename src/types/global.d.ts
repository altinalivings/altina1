// src/types/global.d.ts
export {};
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    lintrk?: (...args: any[]) => void;
    altinaTrack?: { sendLead: (payload: any) => void };
  }
}
