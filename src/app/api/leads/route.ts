import { NextResponse } from "next/server";

/**
 * /api/leads
 * - Accepts ANY lead payload from client
 * - Enriches with UA / language
 * - If UTMs/click IDs are missing, attempts to infer them from the Referer header
 * - Forwards to Apps Script Web App (LEADS_SHEETS_WEBAPP_URL)
 */

type LeadMode = "callback" | "brochure" | "visit" | "contact";

type LeadPayload = Record<string, any> & {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  note?: string;
  msg?: string;
  need?: string;
  mode?: LeadMode;
  projectId?: string;
  projectName?: string;
  source?: string;
  page?: string;
  referrer?: string;

  // attribution
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;

  // touch
  last_touch_ts?: string;
  last_touch_page?: string;
  first_touch_source?: string;
  first_touch_medium?: string;
  first_touch_campaign?: string;
  first_touch_term?: string;
  first_touch_content?: string;
  first_touch_gclid?: string;
  first_touch_fbclid?: string;
  first_touch_msclkid?: string;
  first_landing_page?: string;
  first_landing_ts?: string;
  first_touch_page?: string;
  first_touch_ts?: string;

  // device/session
  session_id?: string;
  ga_cid?: string;
  language?: string;
  timezone?: string;
  viewport?: string;
  screen?: string;
  device_type?: string;
  userAgent?: string;

  // visit
  preferred_time?: string;
  preferred_date?: string;

  // routing
  spreadsheetId?: string;

  __raw_payload?: string;
};

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
      page: u.pathname || "",
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

function s(v: any) {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export async function POST(req: Request) {
  try {
    const raw = (await req.json().catch(() => ({}))) as any;

    // Support payload nesting if any client sends { payload: {...} }
    const body: LeadPayload =
      raw && typeof raw === "object" && raw.payload && typeof raw.payload === "object"
        ? { ...raw.payload, ...raw }
        : (raw as LeadPayload);

    const ua = req.headers.get("user-agent") || "";
    const lang = req.headers.get("accept-language") || "";
    const referer = req.headers.get("referer") || "";

    const nowIso = new Date().toISOString();
    const nowMs = String(Date.now());

    // Attempt to infer attribution from referer if missing
    const inferred = referer ? extractFromUrl(referer) : extractFromUrl("");

    const message = body.message ?? body.note ?? body.msg ?? "";
    const page = body.page || inferred.page || "";

    const row: Record<string, string> = {
      // core
      name: s(body.name),
      phone: s(body.phone),
      email: s(body.email),
      message: s(message),

      // ids/context
      source: s(body.source || "altina-livings"),
      page: s(page),
      projectId: s(body.projectId),
      projectName: s(body.projectName),

      // attribution (body wins; fallback to inferred)
      utm_source: s(body.utm_source || inferred.utm_source),
      utm_medium: s(body.utm_medium || inferred.utm_medium),
      utm_campaign: s(body.utm_campaign || inferred.utm_campaign),
      utm_term: s(body.utm_term || inferred.utm_term),
      utm_content: s(body.utm_content || inferred.utm_content),
      gclid: s(body.gclid || inferred.gclid),
      fbclid: s(body.fbclid || inferred.fbclid),
      msclkid: s(body.msclkid || inferred.msclkid),

      // touch
      last_touch_ts: s(body.last_touch_ts || nowMs),
      last_touch_page: s(body.last_touch_page || page),
      first_touch_source: s(body.first_touch_source),
      first_touch_medium: s(body.first_touch_medium),
      first_touch_campaign: s(body.first_touch_campaign),
      first_touch_term: s(body.first_touch_term),
      first_touch_content: s(body.first_touch_content),
      first_touch_gclid: s(body.first_touch_gclid),
      first_touch_fbclid: s(body.first_touch_fbclid),
      first_touch_msclkid: s(body.first_touch_msclkid),
      first_landing_page: s(body.first_landing_page),
      first_landing_ts: s(body.first_landing_ts),
      first_touch_page: s(body.first_touch_page),
      first_touch_ts: s(body.first_touch_ts),

      // session/device
      session_id: s(body.session_id),
      ga_cid: s(body.ga_cid),
      referrer: s(body.referrer || referer),
      language: s(body.language || lang),
      timezone: s(body.timezone),
      viewport: s(body.viewport),
      screen: s(body.screen),
      device_type: s(body.device_type),
      userAgent: s(body.userAgent || ua),

      // extra
      need: s(body.need),
      msg: s(message),
      mode: s(body.mode),
      preferred_time: s(body.preferred_time),
      preferred_date: s(body.preferred_date),

      // always
      time: nowIso,
      ts: s(body.ts || nowMs),
      __raw_payload: JSON.stringify(body ?? {}),

      // sheet routing (optional)
      spreadsheetId: s(body.spreadsheetId || process.env.SHEET_ID || ""),
    };

    const endpoint = process.env.LEADS_SHEETS_WEBAPP_URL;
    if (!endpoint) throw new Error("LEADS_SHEETS_WEBAPP_URL not configured");

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Sheets webhook error: ${res.status} ${t}`);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[/api/leads] error:", e);
    return new NextResponse(e?.message || "Bad Request", { status: 400 });
  }
}
