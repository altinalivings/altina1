import "./globals.css";
import "../styles/altina-gold.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import StickyCTABar from "@/components/StickyCTABar";
import ModalBridge from "@/components/ModalBridge";
import GlobalLeadModal from "@/components/GlobalLeadModal";
import LeadBus from "@/components/LeadBus";
import Analytics from "@/components/Analytics";
import Notifier from "@/components/Notifier";
import AutoCallbackPrompt from "@/components/AutoCallbackPrompt";
import AnalyticsGuards from "@/components/AnalyticsGuards";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.altinalivings.com";
const FB_PIXEL = process.env.NEXT_PUBLIC_FB_PIXEL;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const LI_ID = process.env.NEXT_PUBLIC_LI_PARTNER_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ALTINA™ Livings", template: "%s | ALTINA™ Livings" },
  description:
    "ALTINA™ Livings partners with DLF, Sobha, M3M, Godrej to bring premium real estate launches across Delhi NCR.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ALTINA™ Livings",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: SITE_URL },
};

const preInteractiveGuard = `;(function(){try{
  var w=window;
  function guard(fn){
    if(typeof fn!=='function') return fn;
    try{
      if(fn.__guarded) return fn;
      var p=new Proxy(fn,{
        set:function(t,prop,val){ if(prop==='length') return true; t[prop]=val; return true; },
        defineProperty:function(t,prop,desc){ if(prop==='length') return true; Object.defineProperty(t,prop,desc); return true; }
      });
      p.__guarded=true;
      return p;
    }catch(e){ return fn; }
  }
  try{Object.defineProperty(w,'fbq',{configurable:true,enumerable:true,set:function(v){this.__fbq=guard(v);},get:function(){return this.__fbq;}});}catch(e){}
  try{Object.defineProperty(w,'_fbq',{configurable:true,enumerable:true,set:function(v){this.__fbq=guard(v);},get:function(){return this.__fbq;}});}catch(e){}
  try{Object.defineProperty(w,'gtag',{configurable:true,enumerable:true,set:function(v){this.__gtag=guard(v);},get:function(){return this.__gtag;}});}catch(e){}
}catch(e){} })();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ALTINA™ Livings",
    url: "https://www.altinalivings.com",
    logo: "https://www.altinalivings.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9891234195",
      contactType: "customer service",
      areaServed: "IN",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61580035583494",
      "https://www.instagram.com/altinalivings",
      "https://www.linkedin.com/company/108414321/",
      "https://www.youtube.com/@Altinalivings",
    ],
  };

  return (
    <html lang="en" className="bg-black text-white">
    <head>
  <meta
    name="google-site-verification"
    content="_1iZhV_tnYBQBc5MU2VMF9YObRDPkiFdNlGpxmsYIOU"
  />
  <Script
    id="analytics-guards-pre"
    strategy="beforeInteractive"
    dangerouslySetInnerHTML={{ __html: preInteractiveGuard }}
  />
</head>

      <body className={inter.className + " flex min-h-screen flex-col"}>
        {/* 🧩 Global safety guards */}
        <AnalyticsGuards />

        {/* 🏠 Header */}
        <Header />

        {/* 🧱 Main Content */}
        <main className="flex-1">{children}</main>

        {/* 🦶 Footer */}
        <SiteFooter />

        {/* 📞 CTAs, Modals, Leads, Analytics */}
        <StickyCTABar />
        <ModalBridge />
        <GlobalLeadModal />
        <LeadBus />
        <Analytics />
        <Notifier />
        <AutoCallbackPrompt />

        {/* 🧾 Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />

        {/* ✅ Analytics Script Loader */}
        <Script id="altina-analytics" strategy="afterInteractive">
          {`
            (function() {
              // GA4
              if ('${GA_ID}' && !window.__ga_loaded) {
                var s=document.createElement('script');
                s.async=true;
                s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
                document.head.appendChild(s);
                window.dataLayer=window.dataLayer||[];
                function gtag(){dataLayer.push(arguments);}
                window.gtag=gtag;
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
                window.__ga_loaded=true;
              }

              // FB Pixel
              if ('${FB_PIXEL}' && !window.__fb_loaded) {
                !(function(f,b,e,v,n,t,s){
                  if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)
                })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FB_PIXEL}');
                fbq('track', 'PageView');
                window.__fb_loaded=true;
              }

              // LinkedIn Insight
              if ('${LI_ID}' && !window.__li_loaded) {
                var s=document.createElement("script");
                s.type="text/javascript"; s.async=true;
                s.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
                document.head.appendChild(s);
                window.lintrk=function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q=[];
                window.__li_loaded=true;
              }
            })();
          `}
        </Script>

        {/* 🧠 FB Pixel no-script fallback */}
        {FB_PIXEL ? (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL}&ev=PageView&noscript=1`}
            />
          </noscript>
        ) : null}
      </body>
    </html>
  );
}
