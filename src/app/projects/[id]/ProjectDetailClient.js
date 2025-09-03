"use client";

import { useState } from "react";
import ProjectEnquiryModal from "@/components/ProjectEnquiryModal";

export default function ProjectDetailClient({ project }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{project.title}</h1>
      <img src={project.image} alt={project.title} className="w-full mb-6 rounded" />
      <p className="mb-6">{project.description}</p>

      <div className="flex gap-4">
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Enquire
        </button>
        <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded">
          Download Brochure
        </button>
        <button onClick={() => setShowModal(true)} className="bg-yellow-600 text-white px-4 py-2 rounded">
          View Floorplan
        </button>
      </div>

      {showModal && <ProjectEnquiryModal onClose={() => setShowModal(false)} source={project.title} />}
    </div>
  );
}
