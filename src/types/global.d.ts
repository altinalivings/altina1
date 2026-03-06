// src/types/global.d.ts
export {};

declare global {
  interface Window {
    altinaTrack?: {
      lead?: (payload?: any) => void;
      contact?: (payload?: any) => void;
    };
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    lintrk?: (...args: any[]) => void;
  }
}
