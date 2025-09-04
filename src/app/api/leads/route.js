import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, message, projectId } = body || {};

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "Name and phone are required" }, { status: 400 });
    }

    const SHEET_URL = process.env.SHEET_URL;
    if (!SHEET_URL) {
      // If no sheet configured, just log and pretend success to keep UX unblocked
      console.warn("Missing SHEET_URL env; received lead:", body);
      return NextResponse.json({ ok: true, stored: false });
    }

    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, message, projectId, ts: new Date().toISOString() }),
      redirect: "follow",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ ok: false, error: "Upstream error", detail: text }, { status: 502 });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ ok: true, stored: true, data });
  } catch (err) {
    console.error("Lead POST failed", err);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
