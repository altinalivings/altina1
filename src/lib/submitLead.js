// src/lib/submitLead.js
export async function submitLead(formData) {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec",
      {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script web apps
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    // 🔹 Debug: log raw response (will be empty in no-cors mode, but useful if switched later)
    const raw = await response.text().catch(() => "");
    console.log("📩 Lead API Raw Response:", raw);

    // Try parsing JSON (if response is not empty)
    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      result = { result: "success" }; // Assume success in no-cors mode
    }

    // 🔹 Fire tracking events (Google, Facebook, LinkedIn)
    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", "generate_lead", {
          event_category: "Leads",
          event_label: "Contact Form",
        });
        window.gtag("event", "conversion", {
          send_to: "AW-17510039084/L-MdCP63l44bEKz8t51B",
        });
      }
      if (window.fbq) {
        window.fbq("track", "Lead", { content_name: "Contact Form" });
      }
      if (window.lintrk) {
        window.lintrk("track", { conversion_id: 515682278 });
      }
    }

    return result;
  } catch (error) {
    console.error("❌ Lead submission failed:", error);
    return { result: "error", details: error.message };
  }
}
