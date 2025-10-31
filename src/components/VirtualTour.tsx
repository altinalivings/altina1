"use client";

import { useState, useEffect } from "react";
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

export default function VirtualTour({ videoUrl }: { videoUrl: string }) {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState<Record<string, string>>({});
  const [thumbnail, setThumbnail] = useState<string | undefined>();

  const safeUrl = normalizeVideoUrl(videoUrl);

  // Collect UTM/device tracking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"].forEach(
      (key) => {
        const v = params.get(key);
        if (v) t[key] = v;
      }
    );
    t.device = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
    setTracking(t);
  }, []);

  // Derive thumbnail for YouTube or Instagram
  useEffect(() => {
    const ytId = getYoutubeId(videoUrl);
    if (ytId) {
      setThumbnail(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      return;
    }

    if (videoUrl.includes("instagram.com")) {
      // Use oEmbed API
      const oEmbed = `https://www.instagram.com/oembed/?url=${encodeURIComponent(videoUrl)}&omitscript=true`;
      fetch(oEmbed)
        .then((res) => res.json())
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

      // Send to backend (Google Sheet integration)
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });
      if (!res.ok) throw new Error("Failed to save lead");

      // Fire analytics events
      if (typeof window !== "undefined") {
        (window as any).dataLayer?.push({ event: "generate_lead", ...leadData });
        // FB Pixel
        if (typeof (window as any).fbq !== "undefined") (window as any).fbq("track", "Lead");
        // Google Ads / GA4
        if (typeof (window as any).gtag !== "undefined") (window as any).gtag("event", "generate_lead", leadData);
      }

      setFormSubmitted(true);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError("Could not submit details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (formSubmitted && safeUrl) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={safeUrl}
          className="w-full h-full rounded-xl border border-white/10"
          allow="autoplay; fullscreen; vr"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      {/* Thumbnail background */}
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}

      {/* Dark overlay + play */}
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-altina-gold drop-shadow-lg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      {/* Popup form */}
      {showForm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 p-6 rounded-xl max-w-sm w-full space-y-4 border border-altina-gold/40 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-white">
              Enter Details to Watch Tour
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-neutral-800 p-2 text-sm text-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-neutral-800 p-2 text-sm text-white"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-white/20 bg-neutral-800 p-2 text-sm text-white"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-white/30 px-4 py-2 text-sm text-white hover:bg-neutral-800"
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