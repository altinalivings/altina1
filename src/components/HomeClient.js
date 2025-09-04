"use client";

import Hero from "@/components/Hero";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import projects from "@/data/projects.json";
import { Shield, Users, Building2, Star } from "lucide-react";

export default function HomeClient() {
  return (
    <>
      {/* ✅ Hero Section */}
      <Hero
        title="Altina Livings"
        subtitle="Your premium channel partner for DLF, M3M, Sobha & Godrej"
        image="https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&h=600"
      />

      {/* ✅ Featured Projects */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Featured Projects
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {projects.slice(0, 6).map((project) => (
              <SwiperSlide key={project.id}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="text-gray-600">{project.location}</p>
                    <p className="text-gray-800 font-semibold">{project.price}</p>
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-block mt-3 bg-gold-600 text-white px-4 py-2 rounded-lg hover:bg-gold-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="text-center mt-10">
            <Link
              href="/projects"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ What We Do */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold mb-3">Property Consulting</h3>
              <p>Helping you choose the right investment or dream home.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold mb-3">Project Promotion</h3>
              <p>Marketing premium residential & commercial projects.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold mb-3">Channel Partnerships</h3>
              <p>Exclusive ties with DLF, M3M, Sobha & Godrej.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Why Choose Us */}
      <section className="py-20 bg-gold-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">
            Why Choose <span className="text-gold-600">Altina Livings</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Shield className="mx-auto text-gold-600 w-10 h-10 mb-3" />
              <h3 className="font-bold">15+</h3>
              <p>Years of Industry Expertise</p>
            </div>
            <div>
              <Users className="mx-auto text-gold-600 w-10 h-10 mb-3" />
              <h3 className="font-bold">3200+</h3>
              <p>Home Buyers & Investors Served</p>
            </div>
            <div>
              <Building2 className="mx-auto text-gold-600 w-10 h-10 mb-3" />
              <h3 className="font-bold">Top 4</h3>
              <p>Working with Best Developers</p>
            </div>
            <div>
              <Star className="mx-auto text-gold-600 w-10 h-10 mb-3" />
              <h3 className="font-bold">100%</h3>
              <p>Commitment to Transparency</p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Developers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Developers We Partner With</h2>
          <div className="flex justify-center gap-10">
            {["DLF", "M3M", "Sobha", "Godrej"].map((dev) => (
              <Image
                key={dev}
                src={`/images/logos/${dev}.png`}
                alt={dev}
                width={120}
                height={80}
                className="object-contain"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
