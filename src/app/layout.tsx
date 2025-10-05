import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import BrochureLeadGate from "@/components/BrochureLeadGate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ALTINA™ Livings – Gateway to Luxury Livings",
  description:
    "Altina™ Livings brings you luxury residences and premium commercial investments across Delhi-NCR.",
  openGraph: {
    type: "website",
    siteName: "ALTINA™ Livings",
    title: "ALTINA™ Livings – Gateway to Luxury Livings",
    description:
      "Premium channel partner for DLF, Godrej, M3M, Sobha and more. Discover verified luxury homes and investments.",
    images: ["/og-default.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0D0D0D] text-white`}>
        {/* ✅ Header */}
        <Header />

        {/* ✅ Main content */}
        {children}

        {/* ✅ BrochureLeadGate is auto-triggered via events */}
        {/* <BrochureLeadGate /> */}

        {/* ✅ Footer */}
        <SiteFooter />

        {/* ✅ Lead form / popup script */}
        <Script src="/submitLead.js" strategy="afterInteractive" />

        <Script id="lead-popup-init" strategy="afterInteractive">
          {`
            window.addEventListener("lead:open", function(e) {
              try {
                const d = e.detail || {};
                if (window.openLeadPopup) {
                  window.openLeadPopup(d.mode, d.projectId, d.projectName);
                } else if (document.getElementById("lead-modal")) {
                  document.getElementById("lead-modal").classList.remove("hidden");
                }
              } catch(err) {
                console.warn("Lead popup trigger failed:", err);
              }
            });
          `}
        </Script>

        {/* ✅ Analytics */}
        <Script id="altina-analytics" strategy="afterInteractive">
          {`
            (function() {
              var GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
              if (GA_ID && !window.__ga_loaded) {
                var s=document.createElement('script');
                s.async=true;
                s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
                document.head.appendChild(s);
                window.dataLayer=window.dataLayer||[];
                function gtag(){dataLayer.push(arguments);}
                window.gtag=gtag;
                gtag('js', new Date());
                gtag('config', GA_ID);
                window.__ga_loaded=true;
              }

              var FB_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";
              if (FB_ID && !window.__fb_loaded) {
                !(function(f,b,e,v,n,t,s){
                  if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)
                })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', FB_ID);
                fbq('track', 'PageView');
                window.__fb_loaded = true;
              }

              var LI_ID = process.env.NEXT_PUBLIC_LI_PARTNER_ID || "";
              if (LI_ID && !window.__li_loaded) {
                var s=document.createElement("script");
                s.type="text/javascript"; s.async=true;
                s.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
                document.head.appendChild(s);
                window.__li_loaded = true;
                window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q = [];
              }
            })();
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  );
}
