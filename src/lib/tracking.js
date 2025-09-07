export function initAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const fields = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "msclkid",
    ];

    const existing =
      JSON.parse(localStorage.getItem("altina_attribution") || "{}") || {};

    let changed = false;
    const next = { ...existing };
    fields.forEach((f) => {
      const v = params.get(f);
      if (v) {
        next[f] = v;
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem("altina_attribution", JSON.stringify(next));
    }
  } catch {
    // no-op
  }
}
