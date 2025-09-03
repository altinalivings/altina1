"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ThankYouPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("leadTrkFired")) {
      sessionStorage.setItem("leadTrkFired", "true");

      // ✅ GA4 & Google Ads Conversion (Form Lead)
      if (window.gtag) {
        // GA4 custom lead event
        window.gtag("event", "generate_lead", {
          event_category: "Leads",
          event_label: "Thank You Page (Form Lead)",
        });

        // Optional GA4 standard event
        window.gtag("event", "sign_up", {
          method: "Website Form",
        });

        // Google Ads Conversion with Value
        window.gtag("event", "conversion", {
          send_to: "AW-17510039084/L-MdCP63l44bEKz8t51B",
          value: 500.0, // ✅ form leads value
          currency: "INR",
        });
      }

      // ✅ Facebook Pixel
      if (window.fbq) {
        window.fbq("track", "Lead", { content_name: "Form Lead" });
      }

      // ✅ LinkedIn Insight
      if (window.lintrk) {
        window.lintrk("track", { conversion_id: 515682278 });
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <h1 className="text-4xl font-bold mb-6 text-green-600">
        ✅ Thank You for Your Enquiry!
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl">
        Our team at <b>Altina Livings</b> will reach out to you shortly with
        project details. Meanwhile, feel free to explore more projects.
      </p>

      <div className="flex gap-4">
        <Link
          href="/projects"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          🔎 Browse More Projects
        </Link>
        <Link
          href="/"
          className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
        >
          🏠 Back to Home
        </Link>
      </div>
    </div>
  );
}
