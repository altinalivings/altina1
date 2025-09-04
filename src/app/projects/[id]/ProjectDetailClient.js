"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SiteVisitPopup from "@/components/SiteVisitPopup";

// NEW imports
import { useRouter } from "next/navigation";
import { submitLead } from "@/lib/submitLead"; // <- ensure submitLead.js is at src/lib/submitLead.js

export default function ProjectDetailClient({ project }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      // Append project info to formData so it's available in the sheet
      const payload = {
        ...formData,
        project: project?.title || project?.id || "",
        source: "project_page",
      };

      // submitLead handles posting via hidden form + iframe and showing toast
      const result = await submitLead(payload);

      // If submitLead returned success, fire analytics and redirect
      if (result && result.status === "success") {
        // Analytics (best-effort)
        try {
          if (typeof window !== "undefined") {
            if (window.gtag) {
              window.gtag("event", "generate_lead", {
                event_category: "Leads",
                event_label: payload.project || "Website Lead",
              });
              // conversion event (optional)
              window.gtag("event", "conversion", {
                send_to: "AW-17510039084/L-MdCP63l44bEKz8t51B",
              });
            }
            if (window.fbq) {
              window.fbq("track", "Lead", { content_name: payload.project || "Website Lead" });
            }
            if (window.lintrk) {
              window.lintrk("track", { conversion_id: 515682278 });
            }
          }
        } catch (aErr) {
          console.warn("analytics error", aErr);
        }

        // Reset form and redirect to thank-you
        setFormData({ name: "", email: "", phone: "", message: "" });
        // navigate to thank-you
        router.push("/thank-you");
      } else {
        // submitLead already shows toast for errors; log for debugging
        console.warn("Lead submission returned non-success:", result);
      }
    } catch (err) {
      // submitLead should already show a toast. Log and avoid alert.
      console.error("Contact form error:", err);
      if (typeof window !== "undefined" && window.showToast) {
        window.showToast({ text: "Submission failed — try again", type: "error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[400px] md:h-[500px]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-bold">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Project Info */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        {/* Left: Overview */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-700 mb-6">{project.description}</p>
          <p className="text-lg font-semibold text-gold-600">
            {project.price}
          </p>
          <p className="text-gray-500">{project.location}</p>

          {/* Amenities */}
          {project.amenities && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
                {project.amenities.map((a, i) => (
                  <li key={i} className="flex items-center gap-2">
                    ✅ {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Gallery</h2>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
              >
                {project.gallery.map((img, i) => (
                  <SwiperSlide key={i}>
                    <Image
                      src={img}
                      alt={`Gallery ${i}`}
                      width={1000}
                      height={600}
                      className="rounded-lg object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Floor Plan & Brochure */}
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="relative">
              <h2 className="text-xl font-bold mb-2">Floor Plan</h2>
              {!unlocked ? (
                <div className="relative">
                  <Image
                    src={project.floorPlan}
                    alt="Floor Plan"
                    width={600}
                    height={400}
                    className="rounded-lg opacity-30"
                  />
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && window.showToast) {
                        window.showToast({ text: "Please fill the form to unlock", type: "error" });
                        return;
                      }
                      alert("Please fill the form to unlock");
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-semibold"
                  >
                    Unlock Floor Plan
                  </button>
                </div>
              ) : (
                <Image
                  src={project.floorPlan}
                  alt="Floor Plan"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              )}
            </div>

            <div className="relative">
              <h2 className="text-xl font-bold mb-2">Brochure</h2>
              {!unlocked ? (
                <div className="p-6 border rounded-lg text-center bg-gray-50">
                  <p className="text-gray-600 mb-4">
                    Please fill the form to download the brochure
                  </p>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && window.showToast) {
                        window.showToast({ text: "Please fill the form to unlock", type: "error" });
                        return;
                      }
                      alert("Please fill the form to unlock");
                    }}
                    className="bg-gold-600 text-white px-6 py-2 rounded-lg hover:bg-gold-700"
                  >
                    Unlock Brochure
                  </button>
                </div>
              ) : (
                <a
                  href={project.brochure}
                  target="_blank"
                  className="bg-gold-600 text-white px-6 py-2 rounded-lg hover:bg-gold-700"
                >
                  Download Brochure
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Enquiry Form */}
        <div>
          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">
              Enquire about {project.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4" id="leadForm">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border rounded"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border rounded"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border rounded"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <textarea
                placeholder="Your Message"
                className="w-full p-3 border rounded"
                rows="3"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Site Visit Popup */}
      <SiteVisitPopup project={project} />
    </div>
  );
}
