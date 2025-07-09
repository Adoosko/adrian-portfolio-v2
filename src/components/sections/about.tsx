"use client";

import { useScroll } from "framer-motion";
import { useRef } from "react";

import { ProfileImage } from "../ProfileImage";
import { ScrollTextReveal } from "../ScrollRevealText";
import { SectionHeader } from "../SectionHeader";
import { TechList } from "../TechList";

interface AboutProps {
  data: {
    title: string;
    description: string;
    technologies: string[];
    tech_list_intro: string;
  };
}

export default function About({ data }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id="about"
      ref={containerRef}
      className="min-h-screen py-20 px-6 lg:px-20 bg-white dark:bg-black"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <SectionHeader
          scrollProgress={scrollYProgress}
          title={data.title}
        />

        <div className="grid lg:grid-cols-3 gap-16 mt-16">
          {/* Text Content - Scrollable */}
          <div className="lg:col-span-2">
            <div className="space-y-8 mb-12">
              <ScrollTextReveal
                blurStrength={4}
                revealSpeed="slow"
                className="mb-0"
              >
                {data.description}
              </ScrollTextReveal>
            </div>
            
            <TechList
              technologies={data.technologies}
              scrollProgress={scrollYProgress}
              introText={data.tech_list_intro}
            />
          </div>

          {/* Profile Image - Sticky */}
          <div className="lg:col-span-1">
            {/* ✅ Sticky wrapper */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <ProfileImage scrollProgress={scrollYProgress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
