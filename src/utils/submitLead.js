export async function submitLead(payload) {
  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ required
        },
        body: JSON.stringify(payload),
      }
    );

    // Get raw response for debugging
    const text = await res.text();
    console.log("📩 Lead API Raw Response:", text);

    try {
      return JSON.parse(text); // parse if JSON
    } catch (e) {
      return { result: "error", details: "Invalid JSON from server", raw: text };
    }
  } catch (error) {
    console.error("🚨 Submit Lead Error:", error);
    return { result: "error", details: error.message };
  }
}
