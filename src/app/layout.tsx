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
import CookieConsent from "@/components/CookieConsent";
import PublicChrome from "@/components/PublicChrome";
import { getSiteStats } from "@/data/unified";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: true });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.altinalivings.com";
const FB_PIXEL = process.env.NEXT_PUBLIC_FB_PIXEL;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "ALTINA™ Livings | Luxury Real Estate Delhi NCR", template: "%s | ALTINA™ Livings" },
  description:
    "ALTINA™ Livings – premium channel partner for DLF, Sobha, M3M, Godrej luxury real estate launches across Delhi NCR. Zero buyer fees. 500+ happy families.",
  keywords: ["luxury properties Delhi NCR", "apartments Gurgaon", "flats Noida", "DLF projects", "SOBHA apartments", "M3M properties", "channel partner Delhi NCR"],
  authors: [{ name: "ALTINA™ Livings", url: SITE_URL }],
  creator: "ALTINA™ Livings",
  publisher: "ALTINA™ Livings",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ALTINA™ Livings",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "ALTINA™ Livings – Luxury Properties Delhi NCR" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@altinalivings",
    creator: "@altinalivings",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  icons: {
    icon: "/logos/Altina.png",
    apple: "/logos/Altina.png",
  },
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
  // Derive served cities from the live project catalogue — auto-updates when projects are added
  const { cities } = getSiteStats();
  const areaServed = ["Delhi NCR", ...cities].filter(
    (v, i, arr) => arr.indexOf(v) === i // deduplicate
  );

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ALTINA™ Livings",
    url: "https://www.altinalivings.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.altinalivings.com/projects?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ALTINA™ Livings",
    url: "https://www.altinalivings.com",
    logo: "https://www.altinalivings.com/logos/Altina.png",
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

  // ✅ Enhanced LocalBusiness / RealEstateAgent JSON-LD
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    name: "ALTINA™ Livings",
    image: "https://www.altinalivings.com/logos/Altina.png",
    url: "https://www.altinalivings.com",
    telephone: "+91-9891234195",
    priceRange: "₹₹₹₹",
    openingHours: "Mo-Sa 10:00-19:00",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Suite C, 704, 7th Floor, Palm Court, Mehrauli-Gurgaon Road, Sector 16",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122007",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.4595",
      longitude: "77.0266",
    },
    areaServed,
    department: [
      {
        "@type": "LocalBusiness",
        name: "ALTINA™ Livings – Gurugram Office",
        telephone: "+91-9891234195",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Suite C, 704, 7th Floor, Palm Court, Mehrauli–Gurgaon Road, Sector 16",
          addressLocality: "Gurugram",
          addressRegion: "Haryana",
          postalCode: "122007",
          addressCountry: "IN",
        },
        geo: { "@type": "GeoCoordinates", latitude: "28.4595", longitude: "77.0266" },
      },
      {
        "@type": "LocalBusiness",
        name: "ALTINA™ Livings – Delhi Office",
        address: {
          "@type": "PostalAddress",
          streetAddress: "26 & 27 A, H-Block, Office No. 401 & 404, Vikas Marg, Laxmi Nagar",
          addressLocality: "Delhi",
          addressRegion: "Delhi",
          postalCode: "110092",
          addressCountry: "IN",
        },
        geo: { "@type": "GeoCoordinates", latitude: "28.6391", longitude: "77.2772" },
      },
      {
        "@type": "LocalBusiness",
        name: "ALTINA™ Livings – Head Office (Ghaziabad)",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Apartment No. 301, 12th Floor, GH Plot No. 6, Sam Residency, Crossing Republik",
          addressLocality: "Ghaziabad",
          addressRegion: "Uttar Pradesh",
          postalCode: "201016",
          addressCountry: "IN",
        },
        geo: { "@type": "GeoCoordinates", latitude: "28.6235", longitude: "77.4311" },
      },
    ],
    sameAs: [
      "https://www.facebook.com/profile.php?id=61580035583494",
      "https://www.instagram.com/altinalivings",
      "https://www.linkedin.com/company/108414321/",
      "https://www.youtube.com/@Altinalivings",
    ],
  };

  return (
    <html lang="en-IN" className="bg-black text-white">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0B0B0C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
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

        {/* 🏠 Website chrome — hidden on /crm/* routes */}
        <PublicChrome>
          <Header />
        </PublicChrome>

        {/* 🧱 Main Content */}
        <main className="flex-1">{children}</main>

        {/* 🦶 Website chrome — hidden on /crm/* routes */}
        <PublicChrome>
          <SiteFooter />
          <StickyCTABar />
          <ModalBridge />
          <GlobalLeadModal />
          <LeadBus />
          <Notifier />
          <AutoCallbackPrompt />
          <CookieConsent />
        </PublicChrome>

        {/* Analytics runs on all pages */}
        <Analytics />
        

        {/* 🧾 Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
		

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
		{/* GetGabs WhatsApp widget removed — replaced by header WhatsApp button */}
		
      </body>
    </html>
  );
}
