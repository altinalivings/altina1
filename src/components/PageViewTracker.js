"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();

    // GA4 + Ads
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: url,
        page_location: window.location.href,
      });
    }

    // FB Pixel
    if (window.fbq) {
      window.fbq("track", "PageView");
    }

    // LinkedIn
    if (window.lintrk) {
      window.lintrk("track", { conversion_id: 515682278 });
    }
  }, [pathname, searchParams]);

  return null;
}
