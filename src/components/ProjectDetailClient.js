"use client";
import Link from "next/link";
import ContactForm from "../../contact/ContactForm";

export default function ProjectDetailClient({ project }) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />

      <p className="text-lg mb-4">{project.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Details</h2>
          <p><strong>Location:</strong> {project.location}</p>
          <p><strong>Developer:</strong> {project.developer}</p>
          <p><strong>Price:</strong> {project.price}</p>
          <p><strong>Area:</strong> {project.area}</p>
          <p><strong>Type:</strong> {project.type_of_property}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Amenities</h2>
          <ul className="list-disc list-inside">
            {(project.amenities || []).map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        {project.floorPlan && (
          <Link
            href={project.floorPlan}
            target="_blank"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            View Floorplan
          </Link>
        )}
        {project.brochure && (
          <Link
            href={project.brochure}
            target="_blank"
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Download Brochure
          </Link>
        )}
      </div>

      {/* ✅ Contact form with projectName */}
      <div className="p-6 border rounded-lg bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">
          Enquire about {project.title}
        </h2>
        <ContactForm projectName={project.title} />
      </div>
    </div>
  );
}
