import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  titleTemplate: "%s | ALTINA™ Livings",
  defaultTitle: "ALTINA™ Livings – Luxury Real Estate Channel Partner",
  description:
    "ALTINA™ Livings – Curated luxury apartments, villas, and residences in Delhi NCR. Channel partner to leading developers like DLF, Sobha, M3M, Godrej.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.altinalivings.com/",
    siteName: "ALTINA™ Livings",
  },
  twitter: {
    handle: "@altinalivings",
    site: "@altinalivings",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    { name: "theme-color", content: "#0B0B0C" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
  ],
};

export default config;
