"use client";

import StickyCTA from "@/components/StickyCTA";
import { ToastProvider } from "@/components/ToastContext";

export default function ClientRoot() {
  return (
    <ToastProvider>
      <StickyCTA />
    </ToastProvider>
  );
}
