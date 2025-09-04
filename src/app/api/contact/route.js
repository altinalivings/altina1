import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
    if (!webhookUrl) throw new Error("Missing SHEETS_WEBHOOK_URL env");

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        ts: new Date().toISOString(),
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Webhook failed: ${await res.text()}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
