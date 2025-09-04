// src/lib/submitLead.js
export async function submitLead(formData) {
  try {
    // Helper that posts via a temporary form to avoid CORS/preflight
    function postViaForm(url, data) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.style.display = 'none';
      Object.keys(data || {}).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        const v = data[key];
        input.value = (v === undefined || v === null) ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v));
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      setTimeout(() => document.body.removeChild(form), 1000);
    }

    // If you want a client-side fetch (not recommended due to CORS),
    // remove 'mode: no-cors' and make sure Apps Script returns CORS headers
    // (Apps Script web apps don't generally allow that), so we use form submit.
    postViaForm(
      "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec",
      formData
    );

    // Trigger analytics as you already do
    if (window.gtag) {
      window.gtag("event", "conversion", { send_to: "AW-111111111/some_conversion" });
    }
    if (window.fbq) {
      window.fbq("track", "Lead", { content_name: "Contact Form" });
    }
    if (window.lintrk) {
      window.lintrk("track", { conversion_id: 515682278 });
    }

    // We can't read response body in this mode — return a best-effort result
    return { result: "submitted" };
  } catch (error) {
    console.error("❌ Lead submission failed:", error);
    return { result: "error", details: error.message };
  }
}
