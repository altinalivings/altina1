// src/app/api/lead/route.ts
import { NextResponse } from "next/server";

const SHEETS_URL = process.env.LEADS_SHEETS_WEBAPP_URL!;
const SHEET_ID = process.env.SHEET_ID || "";

function bad(msg: string, code = 400) {
  return new NextResponse(msg, { status: code });
}

function extractFromUrl(urlStr: string) {
  try {
    const u = new URL(urlStr);
    const p = u.searchParams;
    const get = (k: string) => p.get(k) || "";

    return {
      utm_source: get("utm_source"),
      utm_medium: get("utm_medium"),
      utm_campaign: get("utm_campaign"),
      utm_term: get("utm_term"),
      utm_content: get("utm_content"),
      gclid: get("gclid"),
      fbclid: get("fbclid"),
      msclkid: get("msclkid"),
      page: u.pathname + (u.search || ""),
    };
  } catch {
    return {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      gclid: "",
      fbclid: "",
      msclkid: "",
      page: "",
    };
  }
}

function firstNonEmpty(...vals: any[]) {
  for (const v of vals) {
    if (v === null || v === undefined) continue;
    const s = String(v).trim();
    if (s !== "") return s;
  }
  return "";
}

export async function POST(req: Request) {
  try {
    if (!SHEETS_URL) return bad("LEADS_SHEETS_WEBAPP_URL not configured", 500);

    const body = await req.json().catch(() => ({} as any));

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.note || body.message || body.msg || "").trim();
    const mode = String(body.mode || "contact");

    if (!name) return bad("Name required");
    if (!/^\+?[0-9\s\-()]{8,}$/.test(phone)) return bad("Valid phone required");
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad("Valid email required");

    const ua = req.headers.get("user-agent") || "";
    const lang = req.headers.get("accept-language") || "";
    const referer = req.headers.get("referer") || "";

    // Infer UTMs/click IDs from page (if it's a URL) and/or referer
    const fromPage = extractFromUrl(String(body.page || ""));
    const fromRef = extractFromUrl(referer);

    // If body.page is full URL it will parse; if it’s just "/path" it won’t.
    // So we also try referer, which often has the full page URL.
    const pageResolved = firstNonEmpty(
      String(body.page || "").startsWith("http") ? fromPage.page : String(body.page || ""),
      fromPage.page,
      fromRef.page,
      "/contact"
    );

    const tz =
      String(body.timezone || "").trim() ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "Asia/Kolkata";

    const payload = {
      name,
      phone,
      email,
      message,
      source: body.source || "altina-livings",
      page: pageResolved,
      mode,
      project: body.projectName || body.project || "",

      // ✅ UTMs/click ids: body wins; fallback to page URL; fallback to referer URL
      utm_source: firstNonEmpty(body.utm_source, fromPage.utm_source, fromRef.utm_source),
      utm_medium: firstNonEmpty(body.utm_medium, fromPage.utm_medium, fromRef.utm_medium),
      utm_campaign: firstNonEmpty(body.utm_campaign, fromPage.utm_campaign, fromRef.utm_campaign),
      utm_term: firstNonEmpty(body.utm_term, fromPage.utm_term, fromRef.utm_term),
      utm_content: firstNonEmpty(body.utm_content, fromPage.utm_content, fromRef.utm_content),

      gclid: firstNonEmpty(body.gclid, fromPage.gclid, fromRef.gclid),
      fbclid: firstNonEmpty(body.fbclid, fromPage.fbclid, fromRef.fbclid),
      msclkid: firstNonEmpty(body.msclkid, fromPage.msclkid, fromRef.msclkid),

      // touch
      last_touch_ts: String(Date.now()),
      last_touch_page: pageResolved,

      // passthrough if client sends
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
      first_touch_page: body.first_touch_page || "",
      first_touch_ts: body.first_touch_ts || "",

      session_id: body.session_id || "",
      ga_cid: body.ga_cid || "",

      // server hints
      referrer: body.referrer || referer,
      language: body.language || lang,
      timezone: tz,
      viewport: body.viewport || "",
      screen: body.screen || "",
      device_type: body.device_type || "",
      userAgent: body.userAgent || ua,

      time: new Date().toISOString(),
      spreadsheetId: SHEET_ID,
      __raw_payload: JSON.stringify(body),
    };

    const res = await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
