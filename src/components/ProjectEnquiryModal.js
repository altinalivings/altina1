"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { submitLead } from "@/lib/submitLead";
import { useToast } from "./ToastContext";

export default function ProjectEnquiryModal({
  open,
  onClose,
  mode = "callback", // "callback" | "sitevisit"
  project // optional: { id, title }
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { show } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // UTM capture (once on mount/open)
  const utm = useMemo(() => {
    const grab = (k) => searchParams?.get(k) || "";
    return {
      utm_source: grab("utm_source"),
      utm_medium: grab("utm_medium"),
      utm_campaign: grab("utm_campaign"),
      utm_term: grab("utm_term"),
      utm_content: grab("utm_content"),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // recompute when modal opens

  const isProjectPage = pathname?.startsWith("/projects/");
  const projectId =
    project?.id ||
    (isProjectPage ? pathname.split("/").filter(Boolean).pop() : "");
  const projectTitle = project?.title || "";

  // Form handling
  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const form = new FormData(e.currentTarget);
      const name = (form.get("name") || "").toString().trim();
      const phone = (form.get("phone") || "").toString().trim();
      const email = (form.get("email") || "").toString().trim();
      const message = (form.get("message") || "").toString().trim();

      // Type rules you asked for:
      // - Request a call from ANY page except project detail => type: 'enquiry'
      // - Request a call from project detail page          => type: 'interested'
      // - Organize site visit (anywhere)                   => type: 'sitevisit'
      const type =
        mode === "sitevisit"
          ? "sitevisit"
          : isProjectPage
          ? "interested"
          : "enquiry";

      const payload = {
        type,
        name,
        phone,
        email,
        message,
        project: projectTitle || projectId || "",
        projectId,
        sourceUrl:
          typeof window !== "undefined" ? window.location.href : pathname,
        ...utm,
      };

      const res = await submitLead(payload);

      // Robust “success” detection (JSON or plain text)
      const ok =
        (res && (res.result === "success" || res.status === "success" || res.ok === true)) ||
        (typeof res === "string" && res.toLowerCase().includes("success"));

      if (ok) {
        show("Thank you! We’ll be in touch shortly.", { variant: "success" });
        onClose?.(); // close modal immediately
      } else {
        show("Something went wrong. Please try again.", { variant: "error" });
      }
    } catch (err) {
      console.error(err);
      show("Something went wrong. Please try again.", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[100] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose?.()}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            aria-modal="true"
            role="dialog"
          >
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <h3 className="text-lg font-semibold">
                  {mode === "sitevisit" ? "Organize a Site Visit" : "Request a Call Back"}
                </h3>
                <button
                  onClick={() => onClose?.()}
                  aria-label="Close"
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-3 px-5 py-4">
                {/* Shared fields */}
                <div className="grid grid-cols-1 gap-3">
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:border-black/60"
                  />
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="Your Phone"
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:border-black/60"
                  />

                  {/* For callback: Name + Email + Phone + optional message
                      For site visit: Name + Email + Phone (as you requested) */}
                  <input
                    name="email"
                    type="email"
                    required={mode !== "sitevisit" ? true : true} /* include email for both; site visit wanted email too */
                    placeholder="Your Email"
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:border-black/60"
                  />

                  {mode !== "sitevisit" && (
                    <textarea
                      name="message"
                      placeholder="Message (optional)"
                      className="min-h-[96px] w-full rounded-xl border px-3 py-2 outline-none focus:border-black/60"
                    />
                  )}
                </div>

                {/* Hidden fields */}
                <input type="hidden" name="project" value={projectTitle || projectId || ""} />
                <input type="hidden" name="projectId" value={projectId || ""} />
                <input type="hidden" name="sourceUrl" value={typeof window !== "undefined" ? window.location.href : pathname} />
                <input type="hidden" name="utm_source" value={utm.utm_source} />
                <input type="hidden" name="utm_medium" value={utm.utm_medium} />
                <input type="hidden" name="utm_campaign" value={utm.utm_campaign} />
                <input type="hidden" name="utm_term" value={utm.utm_term} />
                <input type="hidden" name="utm_content" value={utm.utm_content} />
                <input type="hidden" name="type" value={mode === "sitevisit" ? "sitevisit" : isProjectPage ? "interested" : "enquiry"} />

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : mode === "sitevisit" ? "Book Site Visit" : "Submit"}
                </button>

                <p className="pt-1 text-center text-xs text-gray-500">
                  We respect your privacy. By submitting, you agree to be contacted about this enquiry.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
