export async function submitLead(formData) {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      console.warn("⚠️ Lead submission response not OK:", response.statusText);
    }

    // Tracking Events
    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", "generate_lead", {
          event_category: "Leads",
          event_label: formData.project || "Website Lead",
        });
      }
      if (window.fbq) {
        window.fbq("track", "Lead", { content_name: formData.project || "Website Lead" });
      }
      if (window.lintrk) {
        window.lintrk("track", { conversion_id: 515682278 });
      }
      if (window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-17510039084/L-MdCP63l44bEKz8t51B",
        });
      }
    }

    return { success: true };
  } catch (err) {
    console.error("❌ Lead submission failed:", err);
    return { success: false, error: err };
  }
}
