// src/components/AutoCallbackPrompt.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import CallbackModal from "./CallbackModal";

type Props = {
  /** How long before we pop the modal (ms) */
  delayMs?: number;
  /** Optional name of the current project to pass through */
  projectName?: string | null;
  /** Disable auto-show (useful on pages you don't want it) */
  disabled?: boolean;
};

/** Auto-open the callback modal once per session after a delay */
export default function AutoCallbackPrompt({
  delayMs = 15000,
  projectName = null,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === "undefined") return;
    // Only once per session
    if (sessionStorage.getItem("altina:autoPromptShown") === "1") return;

    timerRef.current = window.setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("altina:autoPromptShown", "1");
    }, delayMs);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [delayMs, disabled]);

  return (
    <CallbackModal
      open={open}
      onOpenChange={setOpen}
      projectName={projectName ?? undefined}
      mode="callback"
    />
  );
}