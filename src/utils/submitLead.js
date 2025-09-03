// src/lib/submitLead.js
export async function submitLead(payload) {
  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const text = await res.text();
    console.log("📩 Lead API Raw Response:", text);

    try {
      return JSON.parse(text);
    } catch (e) {
      return { result: "error", details: "Invalid JSON from server", raw: text };
    }
  } catch (error) {
    console.error("🚨 Submit Lead Error:", error);
    return { result: "error", details: error.message };
  }
}
