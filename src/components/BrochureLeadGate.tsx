"use client";

import { useState } from "react";
import projects from "@/data/projects.json";
import { trackLead } from "@/lib/track";

type Props = {
  projectId: string;
  brochureUrl: string; // absolute or public path
  projectName?: string; // optional override
};

type Project = { id: string; name: string; developer?: string };

function getProjectName(projectId: string, override?: string): string {
  if (override) return override;
  const p = (projects as Project[]).find((x) => x.id === projectId);
  return p?.name || projectId;
}

export function GatedDownloadButton({ projectId, brochureUrl, projectName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95"
      >
        Download Brochure
      </button>

      {open && (
        <BrochureModal
          projectId={projectId}
          projectName={getProjectName(projectId, projectName)}
          brochureUrl={brochureUrl}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function BrochureModal({
  projectId,
  projectName,
  brochureUrl,
  onClose,
}: {
  projectId: string;
  projectName: string;
  brochureUrl: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string>("");

  function onChange<K extends keyof typeof form>(k: K, v: string) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr("");
    setOk(null);

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        mode: "brochure",
        projectId,
        projectName,
        source: "brochure-gate",
        page: `/brochure/${projectId}`,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ __no_autotrack: 1, ...payload }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Unable to submit");
      }

      setOk(true);

      // 🔔 Conversion tracking (manual)
      trackLead({
        mode: "brochure",
        project: projectName,
        label: `/brochure/${projectId}`,
        value: 1,
      });

      // start download
      setTimeout(() => {
        try {
          const a = document.createElement("a");
          a.href = brochureUrl;
          a.download = "";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch {}
      }, 300);
    } catch (e: any) {
      setOk(false);
      setErr(e?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0B0C] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Get Brochure</h3>
            <p className="text-xs text-neutral-400 mt-1">{projectName}</p>
          </div>
          <button onClick={onClose} className="text-neutral-300 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input
            required
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
          <input
            required
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-altina-gold/40"
          />

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl px-5 py-2 text-sm font-semibold text-[#0D0D0D] border border-altina-gold/60 shadow-altina bg-gold-grad hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "Please wait…" : "Get Brochure"}
          </button>
        </form>

        {ok === true && <p className="mt-3 text-sm text-emerald-400">Thanks! Starting your download…</p>}
        {ok === false && err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}
      </div>
    </div>
  );
}

/* ✅ Add this at the very end */
export default GatedDownloadButton;
