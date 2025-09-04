// src/components/ProjectDetailClient.js
"use client";

import Image from "next/image";
import ContactForm from "@/components/ContactForm";

export default function ProjectDetailClient({ project }) {
  if (!project) {
    return <div className="p-8">Project not found.</div>;
  }

  const amenities = project.amenities || [];
  const gallery = project.gallery || [];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">{project.title}</h1>
      <p className="text-gray-600 mb-8">{project.location}</p>

      {gallery.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {gallery.map((src, i) => (
            <div key={i} className="relative w-full aspect-[4/3]">
              <Image src={src} alt={`Gallery ${i+1}`} fill className="object-cover rounded" />
            </div>
          ))}
        </div>
      )}

      {amenities.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10">
          {amenities.map((a, i) => (
            <li key={i} className="text-sm text-gray-700">• {a}</li>
          ))}
        </ul>
      )}

      <div className="max-w-lg">
        <h2 className="text-xl font-semibold mb-3">Enquire</h2>
        <ContactForm projectId={project.id} />
      </div>
    </div>
  );
}
