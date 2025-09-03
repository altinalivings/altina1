
import projects from "../../../data/projects.json";

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }) {
  const project = projects.find((p) => p.id === params.id);
  if (!project) {
    return {
      title: "Project Not Found | Altina Livings",
      description: "Explore premium real estate projects with Altina Livings."
    };
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `https://yourdomain.com/projects/${project.id}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.image, width: 1200, height: 630, alt: project.title }],
      url: `https://yourdomain.com/projects/${project.id}`,
      siteName: "Altina Livings",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

import ProjectDetailClient from "./ProjectDetailClient";
import projects from "../../../data/projects.json";

export default function ProjectPage({ params }) {
  const project = projects.find((p) => p.id === params.id);
  if (!project) return <div className="p-6">Project not found</div>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": project.title,
    "description": project.description,
    "image": project.image,
    "brand": { "@type": "Organization", "name": project.developer },
    "offers": {
      "@type": "Offer",
      "price": project.price,
      "priceCurrency": "INR"
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Area", "value": project.area },
      { "@type": "PropertyValue", "name": "Type of Property", "value": project.type_of_property },
      { "@type": "PropertyValue", "name": "Amenities", "value": project.amenities.join(", ") }
    ]
  };

return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProjectDetailClient project={project} />
    </>
  );
}
