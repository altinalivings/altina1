import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const waUrl =
    "https://wa.me/919891234195?text=Hi%20Altina%20Livings%2C%20I%27m%20interested%20in%20DLF%20Midtown.%20Please%20share%20details.";
  const siteUrl = "https://www.altinalivings.com";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Redirecting to WhatsApp...</title>
        <style>
          body { 
            font-family: system-ui, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #000;
            color: #fff;
            text-align: center;
          }
          a {
            color: #ffd700;
            text-decoration: underline;
          }
        </style>
        <script>
          // Fire Google Analytics event
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('event', 'whatsapp_click', {
            event_category: 'engagement',
            event_label: '${waUrl}'
          });

          // Wait for 5 seconds, then redirect to WhatsApp
          setTimeout(() => {
            window.location.href = '${waUrl}';
          }, 5000);
        </script>
      </head>
      <body>
        <h2>ALTINA™ Livings</h2>
        <p>Preparing to connect you on WhatsApp...</p>
        <p><a href="${waUrl}">Click here if you’re not redirected automatically</a></p>
        <iframe 
          src="${siteUrl}" 
          style="width:100%;height:60vh;border:none;margin-top:20px;border-radius:8px;"
          title="Altina Livings Preview">
        </iframe>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
