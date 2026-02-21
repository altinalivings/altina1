import { NextResponse } from "next/server";

function safeStringify(v: any) {
  try {
    if (v === null || v === undefined) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function pickFirstNonEmpty(...vals: any[]) {
  for (const v of vals) {
    if (v === null || v === undefined) continue;
    const s = typeof v === "string" ? v : safeStringify(v);
    if (String(s).trim() !== "") return s;
  }
  return "";
}

function extractAttributionFromUrl(urlStr: string) {
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
      // Helpful page fallback
      __page_from_referer: u.pathname + (u.search || ""),
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
      __page_from_referer: "",
    };
  }
}

export async function POST(req: Request) {
  try {
    const raw = (await req.json().catch(() => ({}))) as any;

    // Support: { payload: {...} } or { data: {...} } etc.
    const body =
      (raw && typeof raw === "object" && raw.payload && typeof raw.payload === "object"
        ? raw.payload
        : raw) || {};

    const ua = req.headers.get("user-agent") || "";
    const lang = req.headers.get("accept-language") || "";
    const referer = req.headers.get("referer") || "";

    const nowIso = new Date().toISOString();
    const nowMs = Date.now();

    // If client didn't send UTMs, try infer from referer (same-origin usually includes full URL)
    const inferred = referer ? extractAttributionFromUrl(referer) : extractAttributionFromUrl("");

    // Normalize message fields
    const message = pickFirstNonEmpty(body.message, body.note, body.msg, "");
    const pageFromBody = pickFirstNonEmpty(body.page, "");
    const pageFromReferer = inferred.__page_from_referer;

    // Build row:
    // 1) start with everything client sent (so you "capture all")
    // 2) add/override normalized fields and server hints
    // 3) fill utms/click ids from referer ONLY if missing in body
    const row: Record<string, any> = {
      ...body,

      // Normalize common fields (keep consistent columns)
      name: pickFirstNonEmpty(body.name, ""),
      phone: pickFirstNonEmpty(body.phone, ""),
      email: pickFirstNonEmpty(body.email, ""),
      message,
      msg: message,

      // Source/page/referrer
      source: pickFirstNonEmpty(body.source, "altina-livings"),
      page: pickFirstNonEmpty(pageFromBody, pageFromReferer),
      referrer: pickFirstNonEmpty(body.referrer, referer),

      // Attribution: body wins; fallback to referer
      utm_source: pickFirstNonEmpty(body.utm_source, inferred.utm_source),
      utm_medium: pickFirstNonEmpty(body.utm_medium, inferred.utm_medium),
      utm_campaign: pickFirstNonEmpty(body.utm_campaign, inferred.utm_campaign),
      utm_term: pickFirstNonEmpty(body.utm_term, inferred.utm_term),
      utm_content: pickFirstNonEmpty(body.utm_content, inferred.utm_content),
      gclid: pickFirstNonEmpty(body.gclid, inferred.gclid),
      fbclid: pickFirstNonEmpty(body.fbclid, inferred.fbclid),
      msclkid: pickFirstNonEmpty(body.msclkid, inferred.msclkid),

      // Touch timestamps: respect client if provided, else fallback
      last_touch_ts: pickFirstNonEmpty(body.last_touch_ts, String(nowMs)),
      last_touch_page: pickFirstNonEmpty(body.last_touch_page, pageFromBody, pageFromReferer),

      // Server hints
      language: pickFirstNonEmpty(body.language, lang),
      userAgent: pickFirstNonEmpty(body.userAgent, ua),

      // Always include these
      time: nowIso,
      ts: pickFirstNonEmpty(body.ts, String(nowMs)),

      // Keep the full payload for debugging (but don’t explode the sheet)
      __raw_payload: safeStringify(body),
    };

    // Spreadsheet routing
    row.spreadsheetId = pickFirstNonEmpty(body.spreadsheetId, process.env.SHEET_ID || "");

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
