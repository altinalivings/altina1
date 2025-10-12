import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // OPTIONAL: capture source for basic attribution (?src=youtube, ?src=shorts, etc.)
  const url = new URL(request.url);
  const src = url.searchParams.get("src") ?? "direct";

  // OPTIONAL: send a tiny log to your Google Apps Script endpoint (if you have one)
  // await fetch("https://script.google.com/macros/s/___YOUR_GAS_EXEC_URL___/exec", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ event: "whatsapp_click", src, ts: Date.now() }),
  // });

  const wa = "https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%E2%80%99m%20interested%20in%20DLF%20Midtown.%20Please%20share%20details.";
  return NextResponse.redirect(wa, { status: 302 });
}
