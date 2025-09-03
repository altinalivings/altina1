'use client';
import { useState } from "react";
import { MdCall } from "react-icons/md";
import ContactForm from "./ContactForm";

export default function StickyCTA({ showSiteVisit = false, projectName }) {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState("callback");

  const openModal = (type) => {
    setFormType(type);
    setOpen(true);
  };

  return (
    <>
      {/* Floating CTA */}
      <div className="fixed right-4 top-1/2 z-50 flex flex-col gap-3 -translate-y-1/2">
        {/* Request Callback */}
        <button
          onClick={() => openModal("callback")}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 p-4 shadow-lg text-white hover:scale-105 hover:shadow-2xl transition-all"
        >
          <MdCall size={22} />
          <span className="hidden md:inline">Request Callback</span>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            {formType === "callback" && (
              <>
                <h2 className="text-xl font-bold mb-4">Request a Callback</h2>
                <ContactForm hiddenFields={{ formType: "callback", project: projectName }} />
              </>
            )}

            {formType === "siteVisit" && showSiteVisit && (
              <>
                <h2 className="text-xl font-bold mb-4">Organize a Site Visit</h2>
                <ContactForm fields={["name", "email", "phone"]} hiddenFields={{ formType: "siteVisit", project: projectName }} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
