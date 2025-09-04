"use client";

import { ToastProvider } from "@/components/ToastContext";
import StickyCTA from "@/components/StickyCTA";
import PageViewTracker from "@/components/PageViewTracker";

export default function ClientProviders({ children }) {
  return (
    <ToastProvider>
      {children}
      {/* Global client-only widgets */}
      <StickyCTA />
      <PageViewTracker />
    </ToastProvider>
  );
}
