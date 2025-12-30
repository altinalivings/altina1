"use client";

import React, { useMemo } from "react";

type Props = {
  /** Any share/page URL (YouTube watch, youtu.be, Shorts, Vimeo, Matterport, etc.) */
  videoUrl: string;
  title?: string;
  className?: string;
};

/** Convert common video links to iframe-embeddable links */
function toEmbedUrl(input: string) {
  const url = (input || "").trim();
  if (!url) return "";

  // If already an iframe snippet accidentally got stored, try to extract src=""
  const iframeSrcMatch = url.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch?.[1]) return iframeSrcMatch[1];

  // Ensure protocol
  const normalized = url.startsWith("//") ? `https:${url}` : url;

  // YouTube
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID (already ok)
  try {
    const u = new URL(normalized);

    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    // YouTube variants
    if (host === "youtube.com" || host === "m.youtube.com") {
      // already embed
      if (u.pathname.startsWith("/embed/")) return u.toString();

      // shorts -> embed
      const shorts = u.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{6,})/);
      if (shorts?.[1]) {
        return `https://www.youtube.com/embed/${shorts[1]}?rel=0&modestbranding=1`;
      }

      // watch?v=
      const vid = u.searchParams.get("v");
      if (vid) return `https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`;
    }

    if (host === "youtu.be") {
      const id = u.pathname.replace("/", "").trim();
      if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
    }

    // Vimeo
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts.find((p) => /^\d+$/.test(p));
      if (id) return `https://player.vimeo.com/video/${id}`;
      // if already player url, keep
      return u.toString();
    }

    // Matterport and others: keep as is (many are embeddable directly)
    return u.toString();
  } catch {
    // If URL parsing fails, return raw
    return normalized;
  }
}

export default function VirtualTour({ videoUrl, title, className }: Props) {
  const embedUrl = useMemo(() => toEmbedUrl(videoUrl), [videoUrl]);
  if (!embedUrl) return null;

  return (
    <div className={className || ""}>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/10">
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl}
            title={title || "Virtual Tour"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>

      <div className="mt-2 text-xs text-neutral-400 break-words">
        Source: <span className="text-neutral-300">{videoUrl}</span>
      </div>
    </div>
  );
}
