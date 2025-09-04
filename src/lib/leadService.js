// /src/lib/leadService.js
export async function submitLead(formData, source = "general") {
  try {
    const enrichedData = {
      ...formData,
      source,
      utm_source: formData.utm_source || '',
      utm_campaign: formData.utm_campaign || '',
      utm_medium: formData.utm_medium || '',
      utm_term: formData.utm_term || '',
      utm_content: formData.utm_content || '',
      // optional client fields if caller didn't include them
      referrer: formData.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
      language: formData.language || (typeof navigator !== 'undefined' ? navigator.language : ''),
      timezone: formData.timezone || (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''),
      viewport: formData.viewport || (typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : ''),
      screen: formData.screen || (typeof window !== 'undefined' ? `${screen.width}x${screen.height}` : ''),
      device_type: formData.device_type || (typeof navigator !== 'undefined' ? (/Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop') : ''),
      userAgent: formData.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
      time: new Date().toISOString()
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
