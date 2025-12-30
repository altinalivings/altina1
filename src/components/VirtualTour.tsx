"use client";

import { useEffect, useMemo, useState } from "react";
import { normalizeVideoUrl } from "@/lib/normalizeVideoUrl";

function getYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2];
    return null;
  } catch {
    return null;
  }
}

type Props = {
  videoUrl: string;

  /** Optional context (recommended) */
  projectId?: string;
  projectName?: string;

  /** Optional: override endpoint if needed */
  leadEndpoint?: string; // default "/api/lead"
};

export default function VirtualTour({
  videoUrl,
  projectId,
  projectName,
  leadEndpoint = "/api/lead",
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [thumbnail, setThumbnail] = useState<string | undefined>();

  const safeUrl = useMemo(() => normalizeVideoUrl(videoUrl), [videoUrl]);

  // Optional unlock persistence (session-level)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = projectId ? `altina_vt_${projectId}` : `altina_vt_generic`;
    if (sessionStorage.getItem(key) === "1") setFormSubmitted(true);
  }, [projectId]);

  // Collect UTM/device tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const t: Record<string, string> = {};

    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
    ].forEach((key) => {
      const v = params.get(key);
      if (v) t[key] = v;
    });

    t.device = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
    t.page = window.location.href;

    if (projectId) t.projectId = projectId;
    if (projectName) t.projectName = projectName;

    setTracking(t);
  }, [projectId, projectName]);

  // Derive thumbnail for YouTube or Instagram
  useEffect(() => {
    const ytId = getYoutubeId(videoUrl);
    if (ytId) {
      setThumbnail(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      return;
    }

    if (videoUrl.includes("instagram.com")) {
      const oEmbed = `https://www.instagram.com/oembed/?url=${encodeURIComponent(
        videoUrl
      )}&omitscript=true`;

      fetch(oEmbed)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.thumbnail_url) setThumbnail(data.thumbnail_url);
        })
        .catch(() => {});
    }
  }, [videoUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const leadData = {
        ...form,
        ...tracking,
        source: "virtual-tour",
      };

      const res = await fetch(leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (!res.ok) throw new Error("Failed to save lead");

      // Analytics events
      if (typeof window !== "undefined") {
        (window as any).dataLayer?.push({ event: "generate_lead", ...leadData });

        if (typeof (window as any).fbq !== "undefined")
          (window as any).fbq("track", "Lead");

        if (typeof (window as any).gtag !== "undefined")
          (window as any).gtag("event", "generate_lead", leadData);
      }

      setFormSubmitted(true);
      setShowForm(false);

      // Optional unlock persistence (session only)
      if (typeof window !== "undefined") {
        const key = projectId ? `altina_vt_${projectId}` : `altina_vt_generic`;
        sessionStorage.setItem(key, "1");
      }
    } catch (err) {
      console.error(err);
      setError("Could not submit details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // After submit, render the iframe
  if (formSubmitted && safeUrl) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={safeUrl}
          className="w-full h-full rounded-xl border border-white/10 bg-black"
          allow="autoplay; fullscreen; vr"
          allowFullScreen
        />
      </div>
    );
  }

  // If URL invalid, don’t render broken iframe/thumbnail
  if (!safeUrl) return null;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
      {/* Thumbnail background */}
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}

      {/* Dark overlay + play */}
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition"
        aria-label="Play virtual tour"
      >
        <span className="grid place-items-center h-20 w-20 rounded-full border border-altina-gold/40 bg-black/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-altina-gold"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>

      {/* Popup form */}
      {showForm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900/95 p-6 rounded-2xl max-w-sm w-full space-y-4 border border-altina-gold/40 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-white">
              Enter details to watch
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-neutral-800 p-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-neutral-800 p-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-neutral-800 p-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-altina-gold/40"
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <p className="text-[11px] text-white/50 leading-relaxed">
              By submitting, you agree to receive updates via call/WhatsApp/SMS
              from Altina Livings. Reply STOP to opt out.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-white/25 px-4 py-2 text-sm text-white hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-altina-gold px-4 py-2 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Watch Now"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
