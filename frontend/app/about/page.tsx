"use client";

import Image from "next/image";
import { PageFrame } from "@/components/site/site-chrome";
import { Reveal } from "@/components/ui/reveal";
import FounderSection from "@/components/about/FounderSection";
import VisionMissionSection from "@/components/about/Visionmissionsection";
import OurStorySection from "@/components/about/Ourstorysection";
import CoreValuesSection from "@/components/about/Corevaluessection";

const heroImage = "/about.png";

export default function AboutPage() {
  return (
    <PageFrame active="About">
      <div className="font-poppins min-h-screen overflow-x-hidden bg-[#FFFCF4] [#f4f9fc] text-[15px] leading-relaxed text-slate-600 pt-20">
        <main>
          {/* Hero: centered title on background image */}
          <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden md:min-h-[500px]">
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-[#000000]/50" />

            <div className="relative z-10 mx-auto max-w-[85vw] px-4 py-16 text-center">
              <Reveal delay={100}>
                <h1 className="font-manrope text-[40px] font-semibold leading-[1.25] text-white md:text-6xl">
                  The Art of{" "}
                  <em className="block font-semibold not-italic text-[#e8a21c]">
                    Woven Carpets
                  </em>
                </h1>
              </Reveal>
            </div>
          </section>

          <OurStorySection />

          {/* ================= Founder ================= */}
          <FounderSection />

          {/* ================= Core Values ================= */}
          <CoreValuesSection />

          {/* ================= Quality & Responsibility ================= */}
          <section className="bg-[#F6F1EB] w-full py-12">
            <div className="relative w-full h-[90vh] my-12">
              <Image
                src="/quality.png"
                alt="Quality & Responsibility"
                fill
                sizes="100vw"
                className="object-fill"
              />
            </div>
          </section>
          {/* ================= Vision & Mission ================= */}
          <VisionMissionSection />
        </main>
      </div>
    </PageFrame>
  );
}
