"use client";
import { useState, useEffect } from "react";
import ContactForm from "./ContactForm"; // ✅ Correct path

export default function StickyCTA({ projectName }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleEnquiry = () => {
    setOpen(true);
    if (window.gtag) {
      window.gtag("event", "cta_click", { event_category: "Engagement", event_label: "Enquiry Button" });
    }
    if (window.fbq) window.fbq("trackCustom", "CTA_Click", { button: "Enquiry" });
  };

  const handleCall = () => {
    if (window.gtag) {
      window.gtag("event", "cta_click", { event_category: "Engagement", event_label: "Call Button" });
      window.gtag("event", "generate_lead", { event_category: "Leads", event_label: "Call Lead" });
      window.gtag("event", "conversion", {
        send_to: "AW-17510039084/L-MdCP63l44bEKz8t51B",
        value: 600.0,
        currency: "INR",
      });
    }
    if (window.fbq) window.fbq("track", "Lead", { content_name: "Call Lead" });
    if (window.lintrk) window.lintrk("track", { conversion_id: 515682278 });

    window.location.href = "tel:+919876543210";
  };

  const handleWhatsApp = () => {
    if (window.gtag) {
      window.gtag("event", "cta_click", { event_category: "Engagement", event_label: "WhatsApp Button" });
      window.gtag("event", "generate_lead", { event_category: "Leads", event_label: "WhatsApp Lead" });
      window.gtag("event", "conversion", {
        send_to: "AW-17510039084/L-MdCP63l44bEKz8t51B",
        value: 700.0,
        currency: "INR",
      });
    }
    if (window.fbq) window.fbq("track", "Lead", { content_name: "WhatsApp Lead" });
    if (window.lintrk) window.lintrk("track", { conversion_id: 515682278 });

    const baseText = "Hello Altina Livings, I am interested in";
    let message = projectName ? `${baseText} ${projectName}.` : `${baseText} your projects.`;
    const params = new URLSearchParams(window.location.search);
    const trackingInfo = [
      params.get("utm_source") && `Source: ${params.get("utm_source")}`,
      params.get("utm_campaign") && `Campaign: ${params.get("utm_campaign")}`,
      params.get("utm_medium") && `Medium: ${params.get("utm_medium")}`,
      params.get("utm_term") && `Term: ${params.get("utm_term")}`,
      params.get("utm_content") && `Content: ${params.get("utm_content")}`,
    ].filter(Boolean).join(" | ");
    if (trackingInfo) message += `\n\n🔎 Tracking Info:\n${trackingInfo}`;

    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <>
      {isMobile ? (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-3 z-50 shadow-lg">
          <button onClick={handleCall} className="flex-1 mx-1 bg-green-600 text-white py-2 rounded-lg">📞 Call</button>
          <button onClick={handleEnquiry} className="flex-1 mx-1 bg-blue-600 text-white py-2 rounded-lg">📝 Enquire</button>
          <button onClick={handleWhatsApp} className="flex-1 mx-1 bg-green-500 text-white py-2 rounded-lg">💬 WhatsApp</button>
        </div>
      ) : (
        <button onClick={handleEnquiry} className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50">
          Request a Callback
        </button>
      )}

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-black">✖</button>
            <h2 className="text-2xl font-semibold mb-4">Request a Callback</h2>
            <ContactForm projectName={projectName} />
          </div>
        </div>
      )}
    </>
  );
}
