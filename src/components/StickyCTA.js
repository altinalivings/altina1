"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import ProjectEnquiryModal from "./ProjectEnquiryModal";

export default function StickyCTA() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("callback");

  // hide on contact page
  if (pathname.startsWith("/contact")) return null;

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed right-4 top-1/3 flex flex-col gap-4 z-50">
        {/* Request a Callback */}
        <button
          onClick={() => {
            setMode("callback");
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        >
          📞 Request Callback
        </button>

        {/* Organize Site Visit → only on project detail */}
        {pathname.startsWith("/projects/") && (
          <button
            onClick={() => {
              setMode("visit");
              setOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700"
          >
            🏠 Organize Site Visit
          </button>
        )}
      </div>

      {/* Modal */}
      {open && (
        <ProjectEnquiryModal
          mode={mode}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
