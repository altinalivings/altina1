// src/components/Analytics.tsx
"use client";

import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.altina.example";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;               // e.g. G-3Q43P5GKHK
const FB_PIXEL = process.env.NEXT_PUBLIC_FB_PIXEL;         // e.g. 2552081605172608
const LI_PARTNER = process.env.NEXT_PUBLIC_LI_PARTNER;     // e.g. 515682278
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID;           // e.g. AW-17510039084
const GADS_SEND_TO = process.env.NEXT_PUBLIC_GADS_SEND_TO; // e.g. AW-17510039084/XXXX
const LI_CONVERSION_ID = process.env.NEXT_PUBLIC_LI_CONVERSION_ID || ""; // optional, if you set one in Campaign Manager

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    lintrk: (...args: any[]) => void;
    altinaTrack?: {
      lead?: (payload?: any) => void;
      contact?: (payload?: any) => void;
    };
  }
}

export default function Analytics() {
  const debug = process.env.NODE_ENV !== "production";

  return (
    <>
      {/* GA4 + Google Ads */}
      {GA_ID && (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                send_page_view: true,
                anonymize_ip: true,
                debug_mode: ${debug ? "true" : "false"},
                transport_type: 'beacon'
              });
              ${GADS_ID ? `gtag('config', '${GADS_ID}');` : ""}
              console.log('[analytics] GA4 loaded:', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {FB_PIXEL && (
        <>
          <Script id="fbq-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL}');
              fbq('track', 'PageView');
              console.log('[analytics] FB pixel loaded:', '${FB_PIXEL}');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${FB_PIXEL}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}

      {/* LinkedIn Insight */}
      {LI_PARTNER && (
        <>
          <Script id="linkedin-insight" strategy="afterInteractive">
            {`
              _linkedin_partner_id = "${LI_PARTNER}";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            `}
          </Script>
          <Script
            id="linkedin-insight-src"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(l) {
                  if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                  window.lintrk.q=[]}
                  var s = document.getElementsByTagName("script")[0];
                  var b = document.createElement("script");
                  b.type = "text/javascript"; b.async = true;
                  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                  s.parentNode.insertBefore(b, s);
                })(window.lintrk);
              `,
            }}
          />
          <Script id="linkedin-insight-log" strategy="afterInteractive">
            {`console.log('[analytics] LinkedIn Insight loaded:', '${LI_PARTNER}');`}
          </Script>
        </>
      )}

      {/* Conversion helpers with clear console logs */}
      <Script id="altina-conv-helpers" strategy="afterInteractive">
        {`
          (function(){
            window.altinaTrack = {
              lead: function(payload) {
                try {
                  if (window.gtag) {
                    window.gtag('event', 'generate_lead', {
                      event_category: 'engagement',
                      event_label: payload?.label || payload?.mode || 'lead',
                      value: payload?.value || 1,
                      ${GADS_SEND_TO ? `send_to: '${GADS_SEND_TO}',` : ""}
                      mode: payload?.mode || 'lead',
                      project: payload?.project || ''
                    });
                    console.log('[analytics] GA4 event sent: generate_lead', payload);
                  } else {
                    console.warn('[analytics] gtag not available');
                  }
                  if (window.fbq) {
                    window.fbq('track', 'Lead', {
                      content_name: payload?.project || payload?.label || 'lead',
                      status: payload?.mode || 'lead'
                    });
                    console.log('[analytics] Meta Lead fired', payload);
                  }
                  if (window.lintrk && '${LI_CONVERSION_ID}') {
                    try { window.lintrk('track', { conversion_id: '${LI_CONVERSION_ID}' }); console.log('[analytics] LinkedIn conversion fired'); } catch(e){}
                  }
                } catch(e) { console.warn('[analytics] lead error', e); }
              },
              contact: function(payload) {
                try {
                  if (window.gtag) {
                    window.gtag('event', 'contact', {
                      event_category: 'engagement',
                      event_label: payload?.label || 'contact',
                      value: payload?.value || 1,
                      ${GADS_SEND_TO ? `send_to: '${GADS_SEND_TO}',` : ""}
                      mode: 'contact',
                      project: payload?.project || ''
                    });
                    console.log('[analytics] GA4 event sent: contact', payload);
                  } else {
                    console.warn('[analytics] gtag not available');
                  }
                  if (window.fbq) {
                    window.fbq('track', 'Contact', {
                      content_name: payload?.project || payload?.label || 'contact'
                    });
                    console.log('[analytics] Meta Contact fired', payload);
                  }
                  if (window.lintrk && '${LI_CONVERSION_ID}') {
                    try { window.lintrk('track', { conversion_id: '${LI_CONVERSION_ID}' }); console.log('[analytics] LinkedIn conversion fired'); } catch(e){}
                  }
                } catch(e) { console.warn('[analytics] contact error', e); }
              }
            };
          })();
        `}
      </Script>

      {/* Auto-tracking of lead endpoints (incl. /api/subscribe) */}
      <Script id="altina-auto-track" strategy="afterInteractive">
        {`
          (function(){
            if (typeof window === 'undefined' || !window.fetch) return;
            const originalFetch = window.fetch.bind(window);
            window.fetch = async function(input, init) {
              const url = (typeof input === 'string') ? input : (input && input.url) || '';
              const isLeadApi =
			 // Only auto-track newsletter subscribe; forms already track manually
			const isLeadApi = url.includes('/api/subscribe');

              // Attempt to capture request payload (best-effort, non-blocking)
              let payload = {};
              try {
                if (init && typeof init.body === 'string') {
                  try { payload = JSON.parse(init.body); } catch {}
                } else if (input && typeof input !== 'string') {
                  try {
                    const body = await input.clone().text();
                    try { payload = JSON.parse(body); } catch {}
                  } catch {}
                }
              } catch {}

              const res = await originalFetch(input, init);

              if (isLeadApi) {
                try {
                  const ok = res.ok;
                  const mode =
                    (payload && (payload.mode || payload.need)) ||
                    (url.includes('/subscribe') ? 'subscribe' : 'lead');
                  const project = payload?.projectName || payload?.project || '';
                  const label = payload?.page || project || mode || 'lead';
                  console.log('[analytics:auto]', url, 'status=', res.status, 'mode=', mode, 'label=', label);

                  if (ok) {
                    if (mode === 'contact') {
                      window.altinaTrack?.contact?.({ label, project, mode, value: 1 });
                    } else {
                      window.altinaTrack?.lead?.({ label, project, mode, value: 1 });
                    }
                  }
                } catch(e) {
                  console.warn('[analytics:auto] error', e);
                }
              }
              return res;
            };
          })();
        `}
      </Script>
    </>
  );
}
