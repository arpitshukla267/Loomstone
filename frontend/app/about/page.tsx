"use client";

import Image from "next/image";
import { PageFrame } from "@/components/site/site-chrome";
import { Reveal } from "@/components/ui/reveal";

import OurStorySection from "@/components/about/Ourstorysection";
import VisionMissionSection from "@/components/about/Visionmissionsection";
import ProcessSection from "@/components/about/process-section";
import FounderSection from "@/components/about/FounderSection";
import CoreValuesSection from "@/components/about/Corevaluessection";

const heroImage = "/about.png";

export default function AboutPage() {
  return (
    <PageFrame active="About">
      <div className="font-poppins min-h-screen overflow-x-hidden bg-[#FFFCF4] text-[15px] leading-relaxed text-slate-600 pt-20">
        <main>
          {/* 1. About Hero */}
          <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden md:min-h-[500px] 3xl:min-h-[640px] 4xl:min-h-[720px]">
            <Image
              src={heroImage}
              alt="Loomstone flooring solutions and craftsmanship"
              fill
              priority
              sizes="100vw"
              className="object-cover object-bottom"
            />

            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 mx-auto max-w-[85vw] px-4 py-16 text-center">
              <Reveal delay={100}>
                <h1 className="font-manrope text-[40px] font-semibold leading-[1.25] text-white md:text-6xl 3xl:text-7xl 4xl:text-8xl">
                  The Art of{" "}
                  <span className="block font-semibold text-[#E8A21C]">
                    Flooring Solutions
                  </span>
                </h1>
              </Reveal>
            </div>
          </section>

          {/* 2. Our Story */}
          <OurStorySection />

          {/* 3. Vision & Mission */}
          {/* <VisionMissionSection /> */}

          {/* 4. Our Craft & Manufacturing Process */}
          {/* <ProcessSection /> */}

          {/* 5. Founder's Message */}
          <FounderSection />

          {/* 6. Core Values */}
          <CoreValuesSection />

          {/* 7. Quality & Responsibility */}
          <section className="w-full py-12">
            <div className="relative my-12 h-[65vh] min-h-[420px] w-full md:h-[90vh] 3xl:min-h-[700px] 4xl:min-h-[800px]">
              <Image
                src="/quality.png"
                alt="Loomstone's commitment to quality and responsibility"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </section>
        </main>
      </div>
    </PageFrame>
  );
}
