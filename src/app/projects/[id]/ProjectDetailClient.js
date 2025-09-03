"use client";
import { useState } from "react";
import ProjectEnquiryModal from "../../../components/ProjectEnquiryModal";

export default function ProjectDetailClient({ project }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [purpose, setPurpose] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p>{project.description}</p>
      <img src={project.image} alt={project.title} className="w-full max-w-lg rounded shadow" />

      <button
        onClick={() => { setPurpose("Project Enquiry"); setModalOpen(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enquire Now
      </button>

      <button
        onClick={() => { setPurpose("Organize Site Visit"); setModalOpen(true); }}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 ml-3"
      >
        Organize Site Visit
      </button>

      {modalOpen && (
        <ProjectEnquiryModal purpose={purpose} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
