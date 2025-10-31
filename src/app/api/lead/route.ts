// src/app/api/lead/route.ts
import { NextResponse } from "next/server";

const SHEETS_URL = process.env.LEADS_SHEETS_WEBAPP_URL!;
const SHEET_ID = process.env.SHEET_ID || "";

function bad(msg: string, code = 400) {
  return new NextResponse(msg, { status: code });
}

export async function POST(req: Request) {
  try {
    if (!SHEETS_URL) return bad("LEADS_SHEETS_WEBAPP_URL not configured", 500);

    const body = await req.json().catch(() => ({} as any));

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.note || body.message || "").trim();
    const mode = String(body.mode || "contact");

    if (!name) return bad("Name required");
    if (!/^\+?[0-9\s\-()]{8,}$/.test(phone)) return bad("Valid phone required");
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad("Valid email required");

    const ua = req.headers.get("user-agent") || "";
    const lang = req.headers.get("accept-language") || "";
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      name,
      phone,
      email,
      message,
      source: body.source || "altina-livings",
      page: body.page || "/contact",
      mode,
      project: body.projectName || body.project || "",
      // marketing fields (best-effort passthrough)
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
      utm_term: body.utm_term || "",
      utm_content: body.utm_content || "",
      gclid: body.gclid || "",
      fbclid: body.fbclid || "",
      msclkid: body.msclkid || "",
      last_touch_ts: Date.now(),
      last_touch_page: body.page || "/contact",
      first_touch_source: body.first_touch_source || "",
      first_touch_medium: body.first_touch_medium || "",
      first_touch_campaign: body.first_touch_campaign || "",
      first_touch_term: body.first_touch_term || "",
      first_touch_content: body.first_touch_content || "",
      first_touch_gclid: body.first_touch_gclid || "",
      first_touch_fbclid: body.first_touch_fbclid || "",
      first_touch_msclkid: body.first_touch_msclkid || "",
      first_landing_page: body.first_landing_page || "",
      first_landing_ts: body.first_landing_ts || "",
      session_id: body.session_id || "",
      ga_cid: body.ga_cid || "",
      referrer: body.referrer || "",
      language: lang,
      timezone: tz,
      viewport: body.viewport || "",
      screen: body.screen || "",
      device_type: body.device_type || "",
      userAgent: ua,
      time: new Date().toISOString(),
      spreadsheetId: SHEET_ID,
      __raw_payload: JSON.stringify(body),
    };

    const res = await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // If your Apps Script is slow, you can bump this with Next’s fetch timeout in next.config.js
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Sheets webhook error:", res.status, text);
      return bad("Upstream error while saving lead", 502);
    }

    return NextResponse.json({ ok: true, message: "Thanks! Our team will contact you shortly." });
  } catch (e: any) {
    console.error("Lead API error:", e);
    return bad("Could not submit right now. Please try again.", 500);
  }
}
