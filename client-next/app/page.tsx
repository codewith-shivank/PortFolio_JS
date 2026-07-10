"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

// For incremental migration, import the original sections from the Vite app
// where needed. Keep client-side only to avoid SSR mismatches.
const Hero = dynamic(() => import("../src/sections/Hero.jsx"), { ssr: false });
const About = dynamic(() => import("../src/sections/About.jsx"), { ssr: false });
const Skills = dynamic(() => import("../src/sections/Skills.jsx"), { ssr: false });
const Projects = dynamic(() => import("../src/sections/Projects.jsx"), { ssr: false });
const Experience = dynamic(() => import("../src/sections/Experience.jsx"), { ssr: false });
const Services = dynamic(() => import("../src/sections/Services.jsx"), { ssr: false });
const Testimonials = dynamic(() => import("../src/sections/Testimonials.jsx"), { ssr: false });
const Contact = dynamic(() => import("../src/sections/Contact.jsx"), { ssr: false });

// 3D and feature components (client-only)
const Loader = dynamic(() => import("../src/components/3d/Loader/index.jsx"), { ssr: false });
const Avatar = dynamic(() => import("../src/components/3d/Avatar/index.jsx"), { ssr: false });
const SolarSystemScene = dynamic(
  () => import("../src/components/3d/SolarSystem/index.jsx").then((m) => ({ default: m.SolarSystemScene })),
  { ssr: false }
);
const PhysicsDesk = dynamic(() => import("../src/components/3d/PhysicsDesk/index.jsx"), { ssr: false });
const HeroBackground = dynamic(() => import("../src/components/3d/HeroBackground/index.jsx"), { ssr: false });

export default function Home() {
  // no-op; 3D components are loaded with next/dynamic (ssr: false)
  return (
    <>
      {/* Background WebGL canvas (client-only) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroBackground />
      </div>

      <main className="relative z-10">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Loader />

          <Hero />
          <About />

          {/* Skills Universe section with dynamic SolarSystem */}
          <section id="skills-universe" className="section relative min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
              <h3 className="font-display font-extrabold text-[clamp(2.2rem,5vw,4.5rem)] tracking-tight text-text-primary">
                Skills <span className="gradient-text">Universe</span>
              </h3>
            </div>
            <div className="w-full h-[65vh] relative bg-bg-secondary/20 border-y border-border-glass">
              <SolarSystemScene />
            </div>
          </section>

          <Skills />

          <Projects />

          {/* Physics Desk 3D section */}
          <section id="projects-desk" className="section relative min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-8">
              <h3 className="font-display font-extrabold text-[clamp(2.2rem,5vw,4.5rem)] tracking-tight text-text-primary">
                Physics <span className="gradient-text-rose">Desk</span>
              </h3>
            </div>
            <div className="w-full h-[65vh] relative bg-bg-secondary/20 border-y border-border-glass">
              <PhysicsDesk />
            </div>
          </section>

          <Experience />
          <Services />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>

      {/* Floating Avatar */}
      <Avatar />
    </>
  );
}
