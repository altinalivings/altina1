// src/app/api/subscribe/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // disable caching for this endpoint
export const runtime = "nodejs";        // ensure Node runtime for server fetch

async function normalizeEmailFromRequest(req: Request): Promise<string> {
  const ctype = (req.headers.get("content-type") || "").toLowerCase();
  if (
    ctype.includes("multipart/form-data") ||
    ctype.includes("application/x-www-form-urlencoded")
  ) {
    const fd = await req.formData();
    return String(fd.get("email") || "").trim();
  }
  // JSON or other
  const body = await req.json().catch(() => ({} as any));
  return String(body.email || "").trim();
}

export async function POST(req: Request) {
  try {
    const email = await normalizeEmailFromRequest(req);
    if (!email) {
      return NextResponse.json({ ok: false, message: "Missing email" }, { status: 400 });
    }

    const url = process.env.LEADS_SHEETS_WEBAPP_URL;
    if (!url) {
      console.error("[/api/subscribe] Missing LEADS_SHEETS_WEBAPP_URL");
      return NextResponse.json({ ok: false, message: "Server not configured" }, { status: 500 });
    }

    // Build minimal row for Google Sheets
    const row = {
      name: "",
      phone: "",
      email,
      source: "newsletter",
      page: req.headers.get("referer") || "",
      time: new Date().toISOString(),
      mode: "subscribe",
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(row),
    });

    const text = await r.text().catch(() => "");
    if (!r.ok) {
      console.error("[/api/subscribe] Sheets error", r.status, text.slice(0, 200));
      return NextResponse.json({ ok: false, message: "Upstream error" }, { status: 502 });
    }

    console.log("[/api/subscribe] OK", { status: r.status });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[/api/subscribe] Exception", e);
    return NextResponse.json(
      { ok: false, message: e?.message || "Error" },
      { status: 500 }
    );
  }
}
