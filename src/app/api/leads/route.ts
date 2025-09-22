import { NextResponse } from "next/server";

type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  note?: string;
  need?: string;
  msg?: string;
  mode: "callback" | "brochure" | "visit";
  projectId: string;
  projectName: string;
  source?: string;
  page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
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
  session_id?: string;
  ga_cid?: string;
  language?: string;
  timezone?: string;
  viewport?: string;
  screen?: string;
  device_type?: string;
  userAgent?: string;
  preferred_time?: string;
  preferred_date?: string;
  spreadsheetId?: string;
  __raw_payload?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<LeadPayload>;
    const ua = req.headers.get("user-agent") || "";
    const lang = req.headers.get("accept-language") || "";

    const message = body.message ?? body.note ?? body.msg ?? "";
    const nowIso = new Date().toISOString();

    const row: Record<string, string> = {
      name: String(body.name ?? ""),
      phone: String(body.phone ?? ""),
      email: String(body.email ?? ""),
      message: String(message),
      source: String(body.source ?? "altina-livings"),
      page: String(body.page ?? ""),
      utm_source: String(body.utm_source ?? ""),
      utm_medium: String(body.utm_medium ?? ""),
      utm_campaign: String(body.utm_campaign ?? ""),
      utm_term: String(body.utm_term ?? ""),
      utm_content: String(body.utm_content ?? ""),
      gclid: String(body.gclid ?? ""),
      fbclid: String(body.fbclid ?? ""),
      msclkid: String(body.msclkid ?? ""),
      last_touch_ts: String(Date.now()),
      last_touch_page: String(body.page ?? ""),
      first_touch_source: String(body.first_touch_source ?? ""),
      first_touch_medium: String(body.first_touch_medium ?? ""),
      first_touch_campaign: String(body.first_touch_campaign ?? ""),
      first_touch_term: String(body.first_touch_term ?? ""),
      first_touch_content: String(body.first_touch_content ?? ""),
      first_touch_gclid: String(body.first_touch_gclid ?? ""),
      first_touch_fbclid: String(body.first_touch_fbclid ?? ""),
      first_touch_msclkid: String(body.first_touch_msclkid ?? ""),
      first_landing_page: String(body.first_landing_page ?? ""),
      first_landing_ts: String(body.first_landing_ts ?? ""),
      session_id: String(body.session_id ?? ""),
      ga_cid: String(body.ga_cid ?? ""),
      referrer: String(body.referrer ?? ""),
      language: String(body.language ?? lang),
      timezone: String(body.timezone ?? ""),
      viewport: String(body.viewport ?? ""),
      screen: String(body.screen ?? ""),
      device_type: String(body.device_type ?? ""),
      userAgent: String(body.userAgent ?? ua),
      project: String(body.projectName ?? ""),
      mode: String(body.mode ?? ""),
      time: nowIso,
      __raw_payload: JSON.stringify(body ?? {}),
      first_touch_page: String(body.first_touch_page ?? ""),
      first_touch_ts: String(body.first_touch_ts ?? ""),
      ts: String(Date.now()),
      need: String(body.need ?? ""),
      msg: String(message),
      preferred_time: String(body.preferred_time ?? ""),
      preferred_date: String(body.preferred_date ?? ""),
      spreadsheetId: String(body.spreadsheetId ?? (process.env.SHEET_ID ?? "")),
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
