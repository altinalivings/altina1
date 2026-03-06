import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // no caching
export const runtime = "nodejs";

async function formToObject(req: Request): Promise<Record<string, string>> {
  // Accept FormData or JSON payloads
  const ctype = (req.headers.get("content-type") || "").toLowerCase();
  if (ctype.includes("multipart/form-data") || ctype.includes("application/x-www-form-urlencoded")) {
    const fd = await req.formData();
    const out: Record<string, string> = {};
    for (const [k, v] of fd.entries()) out[k] = String(v ?? "");
    return out;
  }
  try {
    const json = await req.json();
    return json && typeof json === "object" ? json : {};
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  try {
    const body = await formToObject(req);

    // normalize / enrich
    const ua = req.headers.get("user-agent") || "";
    const lang = req.headers.get("accept-language") || "";
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const row = {
      name: body.name || "",
      phone: body.phone || "",
      email: body.email || "",
      message: body.message || "",
      source: body.source || "contact-page",
      page: body.page || "",
      mode: "contact",
      time: new Date().toISOString(),
      userAgent: ua,
      language: lang,
      timezone: tz,
      __raw_payload: JSON.stringify(body),
    };

    // forward to Google Apps Script endpoint you already use
    const webhook = process.env.LEADS_SHEETS_WEBAPP_URL;
    if (!webhook) {
      throw new Error("LEADS_SHEETS_WEBAPP_URL not configured");
    }

    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });

    // Even if Apps Script responds with HTML wrapper, we return {ok:true}
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Sheets webhook error ${res.status}: ${txt}`);
    }

    // ── Dual-write to Supabase CRM ──────────────────────────────────────
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createAdminClient();
      const phone = String(row.phone || "").trim();
      const name = String(row.name || "").trim();
      if (phone) {
        const { data: existing } = await supabase.from("leads").select("id").eq("phone", phone).maybeSingle();
        if (existing) {
          await supabase.from("lead_activities").insert({
            lead_id: existing.id, type: "system",
            title: "New contact form enquiry from website",
            description: String(row.message || "").slice(0, 500) || null,
          });
          await supabase.from("leads").update({ last_contacted_at: new Date().toISOString() }).eq("id", existing.id);
        } else {
          const { data: newLead } = await supabase.from("leads").insert({
            name, phone, email: String(row.email || "") || null,
            source: "website", stage: "new", quality: "warm", form_mode: "contact",
            notes: String(row.message || "") || null,
          }).select("id").single();
          if (newLead) {
            await supabase.from("lead_activities").insert({
              lead_id: newLead.id, type: "system",
              title: "Lead created from contact form",
            });
          }
        }
      }
    } catch (supaErr) {
      console.error("[Supabase dual-write /api/contact]", supaErr);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("CONTACT API error:", e);
    return NextResponse.json(
      { ok: false, message: e?.message || "Bad Request" },
      { status: 400 }
    );
  }
}
