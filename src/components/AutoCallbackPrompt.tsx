"use client";

import React from "react";
import dynamic from "next/dynamic";

const CallbackModal = dynamic(() => import("./CallbackModal"), { ssr: false });

type Props = {
  delayMs?: number;
  projectName?: string | null;
};

export default function AutoCallbackPrompt({ delayMs = 15000, projectName = null }: Props) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (timerRef.current) return;
    timerRef.current = window.setTimeout(() => setOpen(true), delayMs);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [delayMs]);

  if (!open) return null;

  return (
    <CallbackModal
      open={open}
      onOpenChange={setOpen}
      projectName={projectName ?? undefined}
      source="auto-popup"
      mode="callback"
    />
  );
}
