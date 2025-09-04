import Hero from "@/components/Hero";
import ProjectsClient from "@/components/ProjectsClient";

export const metadata = {
  title: "Projects – Altina Livings",
  description:
    "Explore premium residential & commercial projects by DLF, M3M, Sobha & Godrej with Altina Livings.",
};

export default function ProjectsPage() {
  return (
    <>
      <Hero
        title="Our Projects"
        subtitle="Explore premium residential and commercial projects with Altina Livings"
        image="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&h=600"
      />
      <ProjectsClient />
    </>
  );
}
