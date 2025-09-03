// /src/lib/leadService.js
export async function submitLead(formData, source = "general") {
  try {
    const enrichedData = {
      ...formData,
      source, // "enquiry" | "site-visit" | "newsletter"
      utm_source: formData.utm_source || "",
      utm_campaign: formData.utm_campaign || "",
      utm_medium: formData.utm_medium || "",
      utm_term: formData.utm_term || "",
      utm_content: formData.utm_content || "",
    };

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enrichedData),
    });

    return await res.json();
  } catch (err) {
    console.error("Lead submission failed:", err);
    return { success: false, error: err.message };
  }
}