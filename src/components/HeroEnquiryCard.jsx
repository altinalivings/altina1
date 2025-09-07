"use client";

export default function HeroEnquiryCard() {
  const onSubmit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const payload = {
      interestedIn: f.interest.value,
      enquiryType: f.enquiry.value,
      name: f.name.value,
      phone: f.phone.value,
      email: f.email.value,
      city: f.city.value,
      msg: f.msg.value,
      page: typeof window !== "undefined" ? window.location.pathname : "",
    };
    // TODO: send to Apps Script /api
    console.log("lead", payload);
    alert("Thank you! We’ll contact you shortly.");
    f.reset();
  };

  return (
    <form onSubmit={onSubmit} className="card-glass w-[380px]">
      {/* Interested in (default: Buying property) */}
      <div className="space-y-2">
        <span className="label-chip">Interested in</span>
        <select name="interest" className="input-dark">
          <option>Buying property</option>
          <option>Investing</option>
          <option>Site visit</option>
          <option>Brochure request</option>
        </select>
      </div>

      {/* Enquiry type */}
      <div className="mt-3 space-y-2">
        <span className="label-chip">Enquiry</span>
        <select name="enquiry" className="input-dark">
          <option>General enquiry</option>
          <option>Request shortlist</option>
          <option>Schedule a site visit</option>
          <option>Talk to advisor</option>
        </select>
      </div>

      {/* Name / Phone */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <span className="label-chip">Name</span>
          <input name="name" placeholder="Your name" className="input-dark" required />
        </div>
        <div className="space-y-2">
          <span className="label-chip">Phone</span>
          <input name="phone" placeholder="+91" className="input-dark" required />
        </div>
      </div>

      {/* Email (optional) */}
      <div className="mt-3 space-y-2">
        <span className="label-chip">Email (optional)</span>
        <input name="email" type="email" placeholder="you@example.com" className="input-dark" />
      </div>

      {/* City (optional) */}
      <div className="mt-3 space-y-2">
        <span className="label-chip">City (optional)</span>
        <input name="city" placeholder="Gurugram / Delhi / Noida" className="input-dark" />
      </div>

      {/* Message (optional) */}
      <div className="mt-3 space-y-2">
        <span className="label-chip">Message (optional)</span>
        <textarea name="msg" rows={3} placeholder="Budget, timeline, preferences" className="input-dark" />
      </div>

      <button type="submit" className="btn-primary mt-4 w-full">Submit</button>
    </form>
  );
}
