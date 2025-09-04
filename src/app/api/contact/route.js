export async function POST(req) {
  try {
    const data = await req.json();
    const res = await fetch(process.env.SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
