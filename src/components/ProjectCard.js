import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-2">{project.location}</p>
        <p className="text-gray-800 font-bold">{project.price}</p>
        <p className="text-sm text-gray-600">Area: {project.area}</p>
        <p className="text-sm text-gray-600">Type: {project.type_of_property}</p>
        <Link
          href={`/projects/${project.id}`}
          className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
