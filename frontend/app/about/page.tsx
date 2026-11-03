"use client";

import { useEffect, useState } from "react";
import { PageFrame } from "@/components/site/site-chrome";
import OurStorySection from "@/components/about/Ourstorysection";
import FounderSection from "@/components/about/FounderSection";
import ProcessSection, { defaultProcessSteps } from "@/components/about/process-section";
import { preloadImage } from "@/lib/asset-preloader";

export default function AboutPage() {
  const [showProcess, setShowProcess] = useState(false);

  // Preload process section in background while user is viewing Our Story & Founder sections
  useEffect(() => {
    // 1. Preload process step images in background
    defaultProcessSteps.forEach((step) => {
      if (step.media) {
        preloadImage(step.media);
      }
    });

    // 2. Mount process section smoothly into the DOM
    const timer = setTimeout(() => {
      setShowProcess(true);
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageFrame active="About">
      <div className="font-poppins min-h-screen overflow-x-hidden bg-[#FFFCF4] text-[15px] leading-relaxed text-slate-600">
        <main>
          {/* 1. Our Story (loaded in background while loader is active) */}
          <OurStorySection />

          {/* 2. Founder's Message (loaded in background while loader is active) */}
          <FounderSection />

          {/* 3. Craft & Manufacturing Process (loaded in background while user views above sections) */}
          {showProcess && <ProcessSection />}
        </main>
      </div>
    </PageFrame>
  );
}
