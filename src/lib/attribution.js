// Store & retrieve attribution fields from the URL/localStorage

const KEYS = [
  "utm_source","utm_medium","utm_campaign","utm_term","utm_content",
  "gclid","fbclid","msclkid"
];

export function persistAttributionFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  let changed = false;

  KEYS.forEach((k) => {
    const v = url.searchParams.get(k);
    if (v) {
      localStorage.setItem(k, v);
      changed = true;
    }
  });

  // If you want to clear UTM from the URL after capture (optional):
  // if (changed && window.history.replaceState) {
  //   url.searchParams.forEach((_, key) => { if (KEYS.includes(key)) url.searchParams.delete(key); });
  //   window.history.replaceState({}, "", url.toString());
  // }
}

export function collectAttribution() {
  if (typeof window === "undefined") return {};
  const out = {};
  KEYS.forEach((k) => {
    const v = localStorage.getItem(k);
    if (v) out[k] = v;
  });
  return out;
}
