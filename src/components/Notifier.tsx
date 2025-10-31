"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error";
type Toast = {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
};

const DEFAULT_DURATION = 9000;

const MESSAGES: Record<string, string> = {
  enquiry: "Your journey to premium living starts here — our team will reach out shortly.",
  visit: "We appreciate your interest. Expect a personalized follow-up very soon.",
  brochure: "Thanks for requesting the brochure. Our advisor will call you for the required details.",
};

export default function Notifier() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let nextId = 0;

    function onNotify(e: Event) {
      const detail = (e as CustomEvent).detail ?? {};
      const context = detail.context as string | undefined;

      const toast: Toast = {
        id: ++nextId,
        message:
          context && MESSAGES[context]
            ? MESSAGES[context]
            : String(detail.message ?? "Done"),
        type: detail.type === "error" ? "error" : "success",
        duration:
          typeof detail.duration === "number"
            ? detail.duration
            : DEFAULT_DURATION,
      };

      setToasts((prev) => [...prev, toast]);

      const t = setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== toast.id));
      }, toast.duration);

      return () => clearTimeout(t);
    }

    window.addEventListener("notify", onNotify as EventListener);
    return () => {
      window.removeEventListener("notify", onNotify as EventListener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-start justify-end p-4 sm:p-6">
      <div className="flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <button type=\"button\"
            key={t.id}
            onClick={() =>
              setToasts((prev) => prev.filter((x) => x.id !== t.id))
            }
            className={`pointer-events-auto text-left rounded-xl border px-4 py-2 text-sm shadow-lg backdrop-blur transition
              ${
                t.type === "error"
                  ? "border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                  : "border-amber-300/30 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20"
              }`}
          >
            {t.message}
          </button>
        ))}
      </div>
    </div>
  );
}