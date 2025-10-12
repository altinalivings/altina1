import { NextResponse } from "next/server";

export async function GET() {
  const wa = "https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%E2%80%99m%20interested%20in%20DLF%20Midtown.%20Please%20share%20details.";

  // HTML delay for 1.5 seconds before redirect
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="refresh" content="1.5;url=${wa}" />
        <title>Redirecting to WhatsApp...</title>
        <script>
          // Fire Google Ads / Analytics tag
          window.dataLayer = window.dataLayer || [];
          dataLayer.push({ event: "WhatsApp_Click" });
        </script>
      </head>
      <body style="font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;">
        <h2>Connecting you to WhatsApp...</h2>
      </body>
    </html>
  `;
  return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}
