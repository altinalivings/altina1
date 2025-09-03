export async function submitLead(payload) {
  try {
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbwaqJVZtKdSKVeM2fl3pz2qQsett3T-LDYqwBB_yyoOA1eMcsAbZ5vbTIBJxCY-Y2LugQ/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",  // ✅ required
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) throw new Error("Network response was not ok");

    return await res.json();
  } catch (error) {
    console.error("Submit Lead Error:", error);
    return { result: "error", details: error.message };
  }
}
