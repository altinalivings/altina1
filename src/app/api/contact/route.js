// src/app/api/contact/route.js
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // no caching for API
export const fetchCache = "force-no-store";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const { name, phone } = body;
    if (!name || !phone) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name and phone" },
        { status: 400 }
      );
    }

    const webhook = process.env.SHEETS_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json(
        { ok: false, error: "SHEETS_WEBHOOK_URL env var is not set" },
        { status: 500 }
      );
    }

    // Ensure timestamp and a basic source
    const payload = {
      ts: body.ts || new Date().toISOString(),
      source: body.source || "Website",
      ...body,
    };

    // Forward to Google Apps Script Web App
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script happily accepts server-to-server calls; CORS not needed here
      // Keep it Node runtime (default) to ensure env access
    });

    const text = await r.text();
    if (!r.ok) {
      // Bubble up Apps Script errors so you can see them in the UI
      return NextResponse.json(
        { ok: false, error: `Sheets webhook ${r.status}: ${text || "No body"}` },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    return NextResponse.json({ ok: true, sheets: parsed }, { status: 200 });
  } catch (err) {
    console.error("API /contact error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
