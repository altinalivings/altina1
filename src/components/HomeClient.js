"use client";
import { useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import WhyChoose from "@/components/WhyChoose";
import FloatingButtons from "@/components/FloatingButtons";
import CallRequestModal from "@/components/CallRequestModal";
import Wrapper from "@/components/Wrapper";
import projects from "@/data/projects.json";
import "@/styles/fab.css";

export default function HomeClient() {
  const [open, setOpen] = useState(false);
  const featured = (projects || []).slice(0, 6);

  return (
    <div>
      <Hero />

      <section className="py-12 md:py-16">
        <Wrapper>
          <h2 className="text-center text-2xl md:text-3xl font-semibold">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {featured.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="rounded-xl border overflow-hidden shadow-sm group bg-white">
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images?.[0] || "/placeholder.jpg"} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                </div>
                <div className="p-4">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-600">{p.location}</div>
                  {p.price && <div className="mt-1 text-sm">₹ {p.price}</div>}
                  <span className="inline-block mt-3 text-amber-700">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/projects" className="inline-flex px-5 py-2 rounded-lg border hover:bg-gray-50">View All Projects</Link>
          </div>
        </Wrapper>
      </section>

      <WhatWeDo />
      <WhyChoose />

      <FloatingButtons onRequestCall={() => setOpen(true)} />
      <CallRequestModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
