"use client";
import { useState } from "react";
import ProjectEnquiryModal from "@/components/ProjectEnquiryModal";

export default function ProjectDetailClient({ project }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="text-gray-700">{project.description}</p>

      {/* Organize Site Visit CTA */}
      <button
        onClick={() => setModalOpen(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
      >
        🏠 Organize Site Visit
      </button>

      {/* Modal */}
      <ProjectEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode="sitevisit"
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
}
