export function normalizeVideoUrl(raw?: string): string | undefined {
  if (!raw) return undefined;

  try {
    const url = new URL(raw);

    // YouTube full
    if (url.hostname.includes("youtube.com")) {
      if (url.searchParams.has("v")) {
        const id = url.searchParams.get("v");
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.pathname.startsWith("/embed/")) {
        return raw;
      }
    }

    // youtu.be short
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }

    // Instagram reels/posts
    if (url.hostname.includes("instagram.com")) {
      // Strip trailing / and add embed
      const clean = url.href.split("?")[0].replace(/\/$/, "");
      return `${clean}/embed`;
    }

    return raw; // fallback
  } catch {
    return raw;
  }
}
