"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    try {
      const res = await fetch(`/api/subscribe?t=${Date.now()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, page: "/footer" }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Subscribe failed"));

      // Manual tracking (in addition to auto-track on /api/subscribe)
      window.altinaTrack?.lead?.({ mode: "subscribe", label: "subscribe", value: 1 });
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          event_category: "engagement",
          event_label: "subscribe",
          value: 1,
          mode: "subscribe",
          debug_mode: true,
        });
      }

      setEmail("");
      setOk(true);
      window.dispatchEvent(new CustomEvent("notify", { detail: { message: "Thanks! You’re subscribed.", type: "success" } }));
    } catch (err) {
      setOk(false);
      window.dispatchEvent(new CustomEvent("notify", { detail: { message: "Could not subscribe. Please try again.", type: "error" } }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex gap-2">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg border border-white/20 bg-transparent px-3 py-2 h-10 outline-none focus:border-white/40 placeholder:text-neutral-400"
      />
      <button type="submit" disabled={loading} className="golden-btn px-4 h-10 whitespace-nowrap disabled:opacity-60">
        {loading ? "Submitting…" : "Subscribe"}
      </button>
      {ok === true && <span className="text-emerald-400 text-xs self-center">Thanks!</span>}
      {ok === false && <span className="text-red-400 text-xs self-center">Try again</span>}
    </form>
  );
}