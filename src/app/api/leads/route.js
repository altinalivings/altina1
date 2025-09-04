// /src/app/api/leads/route.js
import { NextResponse } from "next/server";

const SHEET_URL = process.env.SHEET_URL; // set in .env.local

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Google Sheets request failed");

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
