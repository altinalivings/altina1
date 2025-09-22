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

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.altinalivings.com";

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
      <body className={inter.className + " flex min-h-screen flex-col"}>
        {/* Install guards BEFORE anything else renders */}
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
        <AutoCallbackPrompt />
      </body>
    </html>
  );
}
