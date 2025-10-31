import { Suspense } from "react";
import WhatsAppRedirectInner from "./WhatsAppRedirectInner";

// ✅ Wrapper page that handles Suspense correctly
export default function WhatsAppPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <WhatsAppRedirectInner />
    </Suspense>
  );
}