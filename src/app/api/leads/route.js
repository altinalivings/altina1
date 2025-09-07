export async function POST(req) {
  try {
    const formData = await req.formData(); // supports multipart/form-data
    // forward to Apps Script
    const r = await fetch(
      "https://script.google.com/macros/s/AKfycbyaT79B9lI8SQRKMT92dxvJGBIHvuV1SOhjCszEocDUqqkwdnOYmI9pG5bhfBfXdf8H2g/exec",
      { method: "POST", body: formData }
    );
    return new Response(await r.text(), {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") || "text/plain" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
