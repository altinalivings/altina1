"use client";
import { useState } from "react";
import CallRequestModal from "@/components/CallRequestModal";

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fab-rail">
        <button
          className="fab fab-primary"
          onClick={() => setOpen(true)}
          aria-label="Request a Call Back"
        >
          Request a Call
        </button>

        <a
          className="fab fab-whatsapp"
          href="https://wa.me/919891234195?text=Hi%20ALTINA%20Team%2C%20I%27d%20like%20to%20know%20more."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
        >
          WhatsApp
        </a>
      </div>

      <div id="request-callback" />
      <CallRequestModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
