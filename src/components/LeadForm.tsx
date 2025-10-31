"use client";
import { useEffect, useState } from "react";

function getClientHints() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const vp = `${window.innerWidth}x${window.innerHeight}`;
  const scr = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
  const ua = navigator.userAgent;
  const lang = navigator.language;
  const ref = document.referrer;
  return { timezone: tz, viewport: vp, screen: scr, userAgent: ua, language: lang, referrer: ref };
}

function getParams(keys: string[]) {
  const url = new URL(window.location.href);
  const out: Record<string, string> = {};
  keys.forEach((k) => {
    const v = url.searchParams.get(k);
    if (v) out[k] = v;
  });
  return out;
}

function getCookie(name: string) {
  const m = document.cookie.match("(^|; )" + name + "=([^;]*)");
  return m ? decodeURIComponent(m[2]) : "";
}

function getGaCid() {
  const ga = getCookie("_ga");
  if (!ga) return "";
  const parts = ga.split(".");
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : ga;
}

export default function LeadForm({ project }: { project?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  useEffect(() => {
    if (!localStorage.getItem("altina_ft_ts")) {
      const now = new Date().toISOString();
      const utm = getParams([
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "gclid",
        "fbclid",
        "msclkid",
      ]);
      localStorage.setItem("altina_ft_ts", now);
      localStorage.setItem("altina_ft_page", window.location.pathname + window.location.search);
      localStorage.setItem("altina_ft", JSON.stringify(utm));
    }
    localStorage.setItem("altina_lt_ts", new Date().toISOString());
    localStorage.setItem("altina_lt_page", window.location.pathname + window.location.search);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (typeof window === "undefined" || !("fetch" in window)) {
      alert("Please wait a moment while the page loads…");
      return;
    }

    setStatus("loading");
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());
    const utm = getParams([
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "msclkid",
    ]);
    const ft = JSON.parse(localStorage.getItem("altina_ft") || "{}");

    const payload: any = {
      ...fields,
      project: project || "",
      mode: "lead",
      page: window.location.pathname,
      source: "website",
      ...utm,
      last_touch_ts: localStorage.getItem("altina_lt_ts") || "",
      last_touch_page: localStorage.getItem("altina_lt_page") || "",
      first_touch_source: ft.utm_source || "",
      first_touch_medium: ft.utm_medium || "",
      first_touch_campaign: ft.utm_campaign || "",
      first_touch_term: ft.utm_term || "",
      first_touch_content: ft.utm_content || "",
      first_touch_gclid: ft.gclid || "",
      first_touch_fbclid: ft.fbclid || "",
      first_touch_msclkid: ft.msclkid || "",
      first_landing_page: localStorage.getItem("altina_ft_page") || "",
      first_landing_ts: localStorage.getItem("altina_ft_ts") || "",
      session_id:
        (typeof crypto !== "undefined" && "randomUUID" in crypto)
          ? crypto.randomUUID()
          : String(Date.now()) + Math.random().toString(36).slice(2),
      ga_cid: getGaCid(),
      ...getClientHints(),
      time: new Date().toISOString(),
      __raw_payload: JSON.stringify(fields),
      first_touch_page: localStorage.getItem("altina_ft_page") || "",
      first_touch_ts: localStorage.getItem("altina_ft_ts") || "",
      ts: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      if (!res.ok) throw new Error("Bad response");

      // Google Ads conversion event
      // @ts-ignore
      if (typeof window.gtag === "function" && process.env.NEXT_PUBLIC_GADS_SEND_TO) {
        // @ts-ignore
        window.gtag("event", "conversion", { send_to: process.env.NEXT_PUBLIC_GADS_SEND_TO });
      }
      // Facebook Lead event
      // @ts-ignore
      if (typeof window.fbq === "function") {
        // @ts-ignore
        window.fbq("track", "Lead");
      }

      setStatus("ok");
      form.reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <form onSubmit={onSubmit} id="lead" className="grid gap-3" noValidate>
      <label className="text-xs h-caps opacity-80">
        Name
        <input
          name="name"
          required
          placeholder="Full name"
          className="mt-1 px-4 py-3 rounded-xl bg-[var(--ink)] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--gold-2)] w-full"
        />
      </label>

      <label className="text-xs h-caps opacity-80">
        Phone
        <input
          name="phone"
          required
          placeholder="Phone"
          className="mt-1 px-4 py-3 rounded-xl bg-[var(--ink)] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--gold-2)] w-full"
        />
      </label>

      <label className="text-xs h-caps opacity-80">
        Email (optional)
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="mt-1 px-4 py-3 rounded-xl bg-[var(--ink)] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--gold-2)] w-full"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <select
          name="budget"
          className="px-4 py-3 rounded-xl bg-[var(--ink)] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--gold-2)]"
        >
          <option value="">Budget range</option>
          <option>₹1–2 Cr</option>
          <option>₹2–3 Cr</option>
          <option>₹3–5 Cr</option>
          <option>₹5 Cr+</option>
        </select>
        <input
          name="location"
          placeholder="Preferred location (e.g., DLF 5)"
          className="px-4 py-3 rounded-xl bg-[var(--ink)] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--gold-2)]"
        />
      </div>

      <textarea
        name="message"
        rows={3}
        placeholder="Anything else?"
        className="px-4 py-3 rounded-xl bg-[var(--ink)] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--gold-2)]"
      />

      {/* explicit submit to avoid any ambiguity */}
      <button
        type="submit"
        className="btn btn-gold"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Request a Callback"}
      </button>

      {status === "ok" && <p className="text-green-400 text-xs">Thanks! We’ll reach out shortly.</p>}
      {status === "err" && <p className="text-red-400 text-xs">Something went wrong. Please WhatsApp us.</p>}
    </form>
  );
}
