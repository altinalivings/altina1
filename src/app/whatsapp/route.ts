import { NextResponse } from "next/server";

export async function GET() {
  const wa =
    "https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%27m%20interested%20in%20DLF%20Midtown.%20Please%20share%20details.";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Redirecting to WhatsApp…</title>
        <script>
          // Fire GA4 event immediately
          if (typeof gtag === 'function') {
            gtag('event', 'whatsapp_click', {
              event_category: 'engagement',
              event_label: '${wa}'
            });
          }
          // Redirect after 1 s
          setTimeout(function() {
            window.location.href = '${wa}';
          }, 1000);
        </script>
      </head>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
        <h2>Connecting you to WhatsApp…</h2>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
