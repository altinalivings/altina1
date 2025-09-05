"use client";
import { useState } from "react";
import { submitLead, showToast } from "@/lib/submitLead";

export default function NewsletterSubscribe({ placeholder = "Your email" }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubscribe(e){
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await submitLead({
        email: (email || "").trim().toLowerCase(),
        source: "newsletter",
        page: typeof window !== "undefined" ? window.location.pathname : "",
      });
      const ok =
        (result && result.status === "success") ||
        (result && result.ok === true) ||
        (result && result.via === "fetch" && result.ok) ||
        (result && result.body && (result.body.status === "success" || result.body.ok === true));
      if (ok) {
        showToast({ text: "Thanks — you’re subscribed to our newsletter.", type: "success" });
        setEmail("");
      } else {
        const msg = (result && (result.message || (result.body && (result.body.message || result.body.msg)))) || "Subscription failed";
        showToast({ text: `Failed: ${msg}`, type: "error" });
      }
    } catch {
      showToast({ text: "Subscription failed — please try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubscribe} className="flex items-center gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        placeholder={placeholder}
        className="p-2 rounded border w-full"
      />
      <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-3 py-2 rounded">
        {submitting ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
