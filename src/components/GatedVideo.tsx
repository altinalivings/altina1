"use client";

import { useMemo, useState } from "react";
import VirtualTour from "@/components/VirtualTour";

type Props = {
  projectId?: string;
  projectName?: string;
  /** Any YouTube/drive/video URL your VirtualTour supports */
  videoUrl: string;
  /** Optional: show this text under the title */
  helperText?: string;

  /** OPTIONAL: if you already have a lead API endpoint, put it here */
  leadEndpoint?: string; // e.g. "/api/lead" (or your Apps Script proxy)
};

function storageKey(projectId?: string) {
  return projectId ? `altina_video_unlocked_${projectId}` : "altina_video_unlocked_generic";
}

export default function GatedVideo({
  projectId,
  projectName,
  videoUrl,
  helperText = "Please share your details to watch the walkthrough.",
  leadEndpoint,
}: Props) {
  const key = useMemo(() => storageKey(projectId), [projectId]);

  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(key) === "1";
  });

  const [name, setName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);

    const n = name.trim();
    const p = phoneOrEmail.trim();

    if (!n || n.length < 2) return setErr("Please enter your name.");
    if (!p || p.length < 6) return setErr("Please enter a valid phone/email.");

    setLoading(true);
    try {
      // OPTIONAL: send lead to your backend/webhook
      if (leadEndpoint) {
        await fetch(leadEndpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: n,
            contact: p,
            projectId,
            projectName,
            source: "video_gate",
            page: typeof window !== "undefined" ? window.location.href : "",
          }),
        }).catch(() => {
          // even if lead capture fails, still unlock (your call)
        });
      }

      if (typeof window !== "undefined") localStorage.setItem(key, "1");
      setUnlocked(true);
    } finally {
      setLoading(false);
    }
  }

  if (unlocked) {
    return <VirtualTour videoUrl={videoUrl} />;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-neutral-300">{helperText}</div>

        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
          <input
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            placeholder="Phone or Email"
            className="rounded-xl border border-altina-gold/30 bg-transparent px-3 py-2 text-sm text-altina-ivory placeholder:text-altina-ivory/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad disabled:opacity-60"
          >
            {loading ? "Unlocking…" : "Unlock Video"}
          </button>
        </div>

        {err ? <div className="mt-1 text-xs text-red-300">{err}</div> : null}

        <div className="mt-3 text-xs text-neutral-400 leading-relaxed">
          By submitting, you agree to be contacted by Altina Livings via call/WhatsApp/SMS for project updates.
          Reply STOP to opt out.
        </div>
      </div>

      {/* Visual locked placeholder */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <div className="h-[260px] w-full grid place-items-center text-neutral-400 text-sm">
          Video locked — submit the form to watch
        </div>
      </div>
    </div>
  );
}
