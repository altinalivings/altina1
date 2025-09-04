// submitLead.js
// Replace your current file with this. It posts via a temporary form to avoid CORS/no-cors issues
// and preserves analytics calls. It returns a lightweight result object.

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBxCY-Y2LugQ/exec";

/**
 * Post data using a temporary form element (browsers send urlencoded form POSTs, no preflight).
 * This avoids CORS trouble when posting directly to Google Apps Script webapps.
 * @param {string} url
 * @param {Object} data - key/value map. Objects/arrays are JSON-stringified.
 */
function postViaForm(url, data) {
  try {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = url;
    form.style.display = "none";

    Object.keys(data || {}).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      const v = data[key];
      input.value = (v === undefined || v === null) ? "" : (typeof v === "object" ? JSON.stringify(v) : String(v));
      form.appendChild(input);
    });

    // Append to body, submit, and remove after a short timeout
    document.body.appendChild(form);

    // If you want the SPA to remain on same page (no navigation), you could set target to an invisible iframe:
    // form.target = 'hidden_iframe'; // ensure you create an iframe with that name if using this approach.
    form.submit();

    // cleanup: remove the form after submit (give the browser a moment to process)
    setTimeout(() => {
      try { document.body.removeChild(form); } catch (e) { /* ignore */ }
    }, 1000);

    return { result: "submitted" };
  } catch (err) {
    console.error("postViaForm error:", err);
    return { result: "error", details: err.message || String(err) };
  }
}

/**
 * Main export used by the site.
 * formData should be an object with keys: name, phone, email, message, source, etc.
 */
export async function submitLead(formData = {}) {
  try {
    // Ensure some minimal defaults
    const payload = {
      ...formData,
      ts: new Date().toISOString()
    };

    // Submit via form (no-cors safe)
    const res = postViaForm(WEBHOOK_URL, payload);

    // Analytics hooks (preserve existing behavior)
    try {
      if (window && window.gtag) {
        // Example: AW conversion or GA event — customize or remove as needed
        window.gtag("event", "conversion", { send_to: "AW-111111111/some_conversion" });
      }
      if (window && window.fbq) {
        window.fbq("track", "Lead", { content_name: "Contact Form" });
      }
      if (window && window.lintrk) {
        window.lintrk("track", { conversion_id: 515682278 });
      }
    } catch (e) {
      // swallow analytics errors
      console.warn("analytics call failed", e);
    }

    // Because we post via native form, we won't receive a JSON response in JS.
    // So return a best-effort success indicator.
    return { ok: true, status: res.result || "submitted" };
  } catch (error) {
    console.error("submitLead error:", error);
    return { ok: false, error: String(error) };
  }
}
