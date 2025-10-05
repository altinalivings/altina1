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
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.altinalivings.com";
const FB_PIXEL = process.env.NEXT_PUBLIC_FB_PIXEL;

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
  try{ if('fbq'in w && typeof w.fbq==='function'){ var tmp=w.fbq; w.fbq=tmp; } }catch(e){}
  try{ if('_fbq'in w && typeof w._fbq==='function'){ var tmp2=w._fbq; w._fbq=tmp2; } }catch(e){}
  try{ if('gtag'in w && typeof w.gtag==='function'){ var tmp3=w.gtag; w.gtag=tmp3; } }catch(e){}
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
    ],
  };

  return (
    <html lang="en" className="bg-black text-white">
      <head>
        <Script id="analytics-guards-pre" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: preInteractiveGuard }} />
      </head>
      <body className={inter.className + " flex min-h-screen flex-col"}>
        <AnalyticsGuards />
        <Header />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <StickyCTABar />
        <ModalBridge />
        <GlobalLeadModal />
        <LeadBus />
        <Analytics />
        <Notifier />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {FB_PIXEL ? (
          <noscript>
            <img
              height="1" width="1" style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL}&ev=PageView&noscript=1`}
            />
          </noscript>
        ) : null}
        <AutoCallbackPrompt />
      
    <Script id="altina-analytics-consent" strategy="afterInteractive">
      {`
        (function(){
          function initAll(){
            var GA_ID = (window && window.__altina_ga) || process.env.NEXT_PUBLIC_GA_ID || "";

            if(GA_ID && !window.__ga_loaded){
              var s=document.createElement('script'); s.async=1; s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID; document.head.appendChild(s);
              window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag=gtag;
              gtag('js', new Date()); gtag('config', GA_ID);
              window.__ga_loaded=true;
            }
            var FB_ID = (window && window.__altina_fb) || process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";
            if(FB_ID && !window.__fb_loaded){
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', FB_ID); fbq('track', 'PageView');
              window.__fb_loaded=true;
            }
            var LI_ID=(window && window.__altina_li)||'${os.environ.get("NEXT_PUBLIC_LI_PARTNER_ID","")}';
            if(LI_ID && !window.__li_loaded){
              (function(){var s=document.createElement("script"); s.type="text/javascript"; s.async=true;
              s.src="https://snap.licdn.com/li.lms-analytics/insight.min.js"; document.head.appendChild(s);})();
              window.__li_loaded=true;
            }
          }
          var consent = localStorage.getItem('altina_cookie_consent');
          if(consent==='accepted'){ initAll(); }
          window.addEventListener('altina-analytics-enable', initAll);
        })();
      `}
    </Script>
    <CookieConsent />
    
</body>
    </html>
  );
}
