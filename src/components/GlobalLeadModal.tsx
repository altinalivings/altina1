// src/components/GlobalLeadModal.tsx
"use client";
import { useEffect } from "react";

export default function GlobalLeadModal() {
  useEffect(() => {
    // Ensure a hidden trigger button exists (backward-compat with old code)
    let trigger = document.getElementById("lead-form-trigger") as HTMLButtonElement | null;
    if (!trigger) {
      trigger = document.createElement("button");
      trigger.id = "lead-form-trigger";
      trigger.style.display = "none";
      document.body.appendChild(trigger);
    }

    // When clicked, open the unified lead dialog (callback, general enquiry)
    const handler = () => {
      window.dispatchEvent(
        new CustomEvent("lead:open", {
          detail: { mode: "callback", projectId: "ALL", projectName: "General Enquiry" },
        })
      );
    };

    trigger.addEventListener("click", handler);
    return () => trigger?.removeEventListener("click", handler);
  }, []);

  // No UI here; we simply bridge the old global trigger into the unified modal flow.
  return null;
}