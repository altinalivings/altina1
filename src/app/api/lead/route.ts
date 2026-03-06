// src/app/api/lead/route.ts
import { NextResponse } from "next/server";

const SHEETS_URL = process.env.LEADS_SHEETS_WEBAPP_URL!;
const SHEET_ID = process.env.SHEET_ID || "";

// ── In-process rate limiter (per IP, resets on cold start) ──────────────────
// Limits: max 5 submissions per IP per 10-minute window
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function bad(msg: string, code = 400) {
  return new NextResponse(JSON.stringify({ ok: false, message: msg }), {
    status: code,
    headers: { "Content-Type": "application/json" },
  });
}

// Basic bot-signal check: name/message shouldn't have URLs
function looksLikeSpam(text: string): boolean {
  return /https?:\/\/|www\.|<[a-z][\s\S]*>/i.test(text);
}

function mapLeadSource(utmSource?: string, gclid?: string, fbclid?: string): string {
  if (gclid) return "google_ads";
  if (fbclid) return "facebook";
  if (utmSource) {
    const s = utmSource.toLowerCase();
    if (s.includes("google")) return "google_ads";
    if (s.includes("facebook") || s.includes("fb")) return "facebook";
    if (s.includes("instagram") || s.includes("ig")) return "instagram";
    if (s.includes("linkedin")) return "linkedin";
  }
  return "website";
}

export async function POST(req: Request) {
  try {
    // ── Rate limiting ──────────────────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return bad("Too many requests. Please try again later.", 429);
    }

    if (!SHEETS_URL) return bad("Service unavailable", 500);

    const body = await req.json().catch(() => ({} as any));

    // ── Field extraction ────────────────────────────────────────────────────
    const name = String(body.name || "").trim().slice(0, 100);
    const phone = String(body.phone || "").trim().slice(0, 20);
    const email = String(body.email || "").trim().slice(0, 200);
    const message = String(body.note || body.message || "").trim().slice(0, 1000);
    const mode = String(body.mode || "contact").slice(0, 50);

    // ── Validation ──────────────────────────────────────────────────────────
    if (!name) return bad("Name is required");
    if (!/^\+?[0-9\s\-()]{8,}$/.test(phone)) return bad("A valid phone number is required");
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad("Please enter a valid email");
    if (looksLikeSpam(name) || looksLikeSpam(message)) return bad("Invalid submission", 400);

    // ── Assemble payload ────────────────────────────────────────────────────
    const ua = req.headers.get("user-agent") || "";
    const lang = req.headers.get("accept-language") || "";

    const payload = {
      name,
      phone,
      email,
      message,
      source: String(body.source || "altina-livings").slice(0, 100),
      page: String(body.page || "/contact").slice(0, 500),
      mode,
      project: String(body.projectName || body.project || "").slice(0, 200),
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
      utm_term: body.utm_term || "",
      utm_content: body.utm_content || "",
      gclid: body.gclid || "",
      fbclid: body.fbclid || "",
      msclkid: body.msclkid || "",
      last_touch_ts: Date.now(),
      last_touch_page: String(body.page || "/contact").slice(0, 500),
      first_touch_source: body.first_touch_source || "",
      first_touch_medium: body.first_touch_medium || "",
      first_touch_campaign: body.first_touch_campaign || "",
      first_touch_term: body.first_touch_term || "",
      first_touch_content: body.first_touch_content || "",
      first_touch_gclid: body.first_touch_gclid || "",
      first_touch_fbclid: body.first_touch_fbclid || "",
      first_touch_msclkid: body.first_touch_msclkid || "",
      first_landing_page: body.first_landing_page || "",
      first_landing_ts: body.first_landing_ts || "",
      session_id: body.session_id || "",
      ga_cid: body.ga_cid || "",
      referrer: String(body.referrer || "").slice(0, 500),
      language: lang,
      timezone: body.timezone || "",
      viewport: body.viewport || "",
      screen: body.screen || "",
      device_type: body.device_type || "",
      userAgent: ua,
      time: new Date().toISOString(),
      spreadsheetId: SHEET_ID,
    };

    // ── Forward to Google Sheets webhook ────────────────────────────────────
    const res = await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Sheets webhook error:", res.status, text);
      return bad("Could not save your enquiry right now. Please try calling us.", 502);
    }

    // ── Dual-write to Supabase CRM ──────────────────────────────────────
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createAdminClient();

      // Dedup by phone
      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (existing) {
        // Existing lead — log activity
        await supabase.from("lead_activities").insert({
          lead_id: existing.id,
          type: "system",
          title: `New ${mode} enquiry from website`,
          description: message || null,
          metadata: { page: payload.page, utm_source: payload.utm_source, project: payload.project },
        });
        await supabase.from("leads").update({ last_contacted_at: new Date().toISOString() }).eq("id", existing.id);
      } else {
        // New lead
        const source = mapLeadSource(payload.utm_source, payload.gclid, payload.fbclid);
        const { data: newLead } = await supabase
          .from("leads")
          .insert({
            name,
            phone,
            email: email || null,
            source,
            source_detail: payload.utm_campaign || null,
            stage: "new",
            quality: "warm",
            project_name: payload.project || null,
            form_mode: mode,
            utm_source: payload.utm_source || null,
            utm_medium: payload.utm_medium || null,
            utm_campaign: payload.utm_campaign || null,
            utm_term: payload.utm_term || null,
            utm_content: payload.utm_content || null,
            gclid: payload.gclid || null,
            fbclid: payload.fbclid || null,
            msclkid: payload.msclkid || null,
            landing_page: payload.page || null,
            referrer: payload.referrer || null,
            session_id: payload.session_id || null,
            ga_cid: payload.ga_cid || null,
            device_type: payload.device_type || null,
            notes: message || null,
          })
          .select("id")
          .single();

        if (newLead) {
          await supabase.from("lead_activities").insert({
            lead_id: newLead.id,
            type: "system",
            title: `Lead created from website (${mode})`,
            description: `${name} submitted a ${mode} form on ${payload.page}`,
          });
        }
      }
    } catch (supaErr) {
      // Log but don't fail — Sheets write already succeeded
      console.error("[Supabase dual-write]", supaErr);
    }

    return NextResponse.json({ ok: true, message: "Thanks! Our team will contact you shortly." });
  } catch (e: any) {
    console.error("Lead API error:", e);
    return bad("Could not submit right now. Please try again.", 500);
  }
}
