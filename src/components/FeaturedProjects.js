import { MapPin, Building2, Home, IndianRupee, ArrowRight } from 'lucide-react'

const allProjects = [
  {
    id: 1,
    name: "DLF Camellias",
    developer: "DLF",
    location: "Gurgaon, Sector 42",
    type: "Luxury Apartments",
    price: "4.5 Cr",
    bhk: "3 & 4 BHK",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Ready to Move",
    featured: true
  },
  {
    id: 2,
    name: "M3M Golf Estate",
    developer: "M3M",
    location: "Gurgaon, Golf Course Road",
    type: "Luxury Villas",
    price: "7.2 Cr",
    bhk: "4 & 5 BHK",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Ready to Move",
    featured: true
  },
  {
    id: 3,
    name: "DLF Cyber City",
    developer: "DLF",
    location: "Gurgaon, Cyber City",
    type: "Commercial Office",
    price: "12.5 Cr",
    bhk: "Office Spaces",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Ready to Move",
    featured: true
  },
  {
    id: 4,
    name: "Godrej Garden City",
    developer: "Godrej",
    location: "Mumbai",
    type: "Residential",
    price: "4.2 Cr",
    bhk: "2 & 3 BHK",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "Ready to Move",
    featured: true
  }
]

export default function FeaturedProjects({ showOnlyFeatured = false }) {
  const displayedProjects = showOnlyFeatured 
    ? allProjects.filter(project => project.featured)
    : allProjects

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayedProjects.map(project => (
        <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="relative h-56">
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                project.status === "Ready to Move" 
                  ? "bg-green-100 text-green-800"
                  : project.status === "Under Construction"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gold-100 text-gold-800"
              }`}>
                {project.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-gold-600" />
              <span className="text-sm text-gray-600">{project.developer}</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>

            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{project.location}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{project.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-800">{project.price}</span>
              </div>
            </div>

            <a
              href={`/projects/${project.id}`}
              className="w-full bg-gold-600 text-white py-2 px-4 rounded-lg hover:bg-gold-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
