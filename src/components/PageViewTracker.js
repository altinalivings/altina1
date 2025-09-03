"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

function PageViewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", "page_view", {
          page_path: pathname,
          page_location: window.location.href,
        });
      }
      if (window.fbq) {
        window.fbq("track", "PageView");
      }
      if (window.lintrk) {
        window.lintrk("track", { conversion_id: 515682278 });
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewInner />
    </Suspense>
  );
}
