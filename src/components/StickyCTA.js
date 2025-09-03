"use client";

const PHONE = "9891234195";
const WHATSAPP = "9891234195";

export default function StickyCTA({ onEnquire }) {
  const handleClick = (type) => {
    if (typeof window !== "undefined") {
      if (window.gtag)
        window.gtag("event", "click", {
          event_category: "CTA",
          event_label: type,
        });
      if (window.fbq) window.fbq("trackCustom", "CTA_Click", { type });
      if (window.lintrk) window.lintrk("track", { conversion_id: 515682278 });
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex justify-around py-3 z-[9999]">
      {/* Call */}
      <a
        href={`tel:+91${PHONE}`}
        onClick={() => handleClick("Call")}
        className="flex-1 text-center text-green-600 font-semibold"
      >
        📞 Call
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/91${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick("WhatsApp")}
        className="flex-1 text-center text-green-500 font-semibold border-l border-r"
      >
        💬 WhatsApp
      </a>

      {/* Enquire */}
      <button
        onClick={() => {
          handleClick("Enquire Now");
          if (onEnquire) onEnquire();
        }}
        className="flex-1 text-center text-blue-600 font-semibold"
      >
        📝 Enquire
      </button>
    </div>
  );
}
