// Ambient global types used by Altina components
export {};

declare global {
  interface Window {
    altinaLeadOpen?: (details?: any) => void;
    __ALTINA_AUTOPROMPT_FIRED?: boolean;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    lintrk?: (...args: any[]) => void;
  }
}
