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
  projectId?: string;
  projectName?: string;
  leadEndpoint?: string; // default "/api/lead"
  title?: string; // heading in form
};

export default function GatedVideo({
  videoUrl,
  projectId,
  projectName,
  leadEndpoint = "/api/lead",
  title = "Enter Details to Watch Video",
}: Props) {
  const [openForm, setOpenForm] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [tracking, setTracking] = useState<Record<string, string>>({});

  const safeUrl = useMemo(() => normalizeVideoUrl(videoUrl), [videoUrl]);

  const sessionKey = useMemo(
    () => (projectId ? `altina_gate_video_${projectId}` : "altina_gate_video_generic"),
    [projectId]
  );

  // Restore unlock for this session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(sessionKey) === "1") setUnlocked(true);
  }, [sessionKey]);

  // UTM/device tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const t: Record<string, string> = {};

    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"].forEach(
      (k) => {
        const v = params.get(k);
        if (v) t[k] = v;
      }
    );

    t.device = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
    t.page = window.location.href;
    t.source = "gated-video";
    if (projectId) t.projectId = projectId;
    if (projectName) t.projectName = projectName;

    setTracking(t);
  }, [projectId, projectName]);

  // Thumbnail (YouTube/Instagram)
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
      const payload = { ...form, ...tracking };

      // Save lead (if endpoint exists)
      const res = await fetch(leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lead save failed");

      // Analytics hooks (optional)
      if (typeof window !== "undefined") {
        (window as any).dataLayer?.push({ event: "generate_lead", ...payload });
        if (typeof (window as any).fbq !== "undefined") (window as any).fbq("track", "Lead");
        if (typeof (window as any).gtag !== "undefined")
          (window as any).gtag("event", "generate_lead", payload);
      }

      setUnlocked(true);
      sessionStorage.setItem(sessionKey, "1");
      setOpenForm(false);
    } catch (err) {
      console.error(err);
      setError("Could not submit details. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Once unlocked, show the real video
  if (unlocked && safeUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10">
        <iframe
          src={safeUrl}
          className="h-full w-full"
          title={projectName ? `${projectName} video` : "Video"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Otherwise show faded preview (click opens form)
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-white/10">
      {/* Background preview (blurred/faded) */}
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt="Video preview"
          className="absolute inset-0 h-full w-full object-cover scale-[1.02] blur-[2px] brightness-[0.65]"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-black/60" />
      )}

      {/* Overlay layer */}
      <button
        type="button"
        onClick={() => setOpenForm(true)}
        className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 hover:bg-black/50 transition"
        aria-label="Open form to watch video"
      >
        <div className="flex items-center justify-center h-16 w-16 rounded-full border border-altina-gold/50 bg-black/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-altina-gold"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div className="mt-3 text-sm text-white/90 font-medium">
          Click to watch
        </div>
        <div className="mt-1 text-xs text-white/60">
          (Lead form required)
        </div>
      </button>

      {/* Form modal */}
      {openForm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-4 rounded-2xl border border-altina-gold/40 bg-neutral-900 p-6 shadow-lg"
          >
            <div className="text-lg font-semibold text-white">{title}</div>

            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-white/15 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-altina-gold/60"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-white/15 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-altina-gold/60"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-white/15 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-altina-gold/60"
            />

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-neutral-800"
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

            <p className="text-[11px] leading-relaxed text-white/50">
              By continuing, you agree to be contacted by Altina Livings for project updates.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
