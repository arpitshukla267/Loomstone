"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import {
  HeaderSection,
  HeroSection,
  FooterSection,
  QuickActions,
  InquiryModal,
  ClientsSection,
} from "@/components/sections";
import GlobalReachSection from "@/components/sections/global-reach-section";
import IndustriesServedSection from "@/components/sections/industries-we-serve";
import WhyLoomstoneSection from "@/components/sections/why-loomstone-section";
import { INDUSTRIES } from "@/data/industries";
import { preloadImage } from "@/lib/asset-preloader";

const clientLogos = [
  "marriott.webp",
  "hilton.webp",
  "hyatt.webp",
  "itc.png",
  "leela.webp",
  "dlf.webp",
  "fcml.png",
  "airtel.webp",
].map((name) => `/clients/${name}`);

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  // Staged loading of sections: hero & why loomstone load with startup loader,
  // then subsequent sections load one by one
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Preload next section assets in background
    INDUSTRIES.forEach((ind) => {
      if (ind.image) preloadImage(ind.image);
    });

    // Sequence loading of sections one by one
    const t1 = setTimeout(() => setStage(1), 180);
    const t2 = setTimeout(() => setStage(2), 380);
    const t3 = setTimeout(() => {
      setStage(3);
      clientLogos.forEach((src) => preloadImage(src));
    }, 580);
    const t4 = setTimeout(() => setStage(4), 780);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3500);
  };

  const openInquiry = () => {
    setModalOpen(true);
  };

  return (
    <main className="overflow-hidden bg-[#FFFCF4] text-ink font-sans">
      <HeaderSection onShowToast={showToast} activePage="Home" />

      {/* 1. Hero Section (images loaded in background while loader is active) */}
      <HeroSection onOpenInquiry={openInquiry} />

      {/* 2. Why Loomstone (video + poster loaded in background while loader is active) */}
      <WhyLoomstoneSection poster="/why_loomstone.png" />

      {/* 3. Industries We Serve (loaded next in sequence) */}
      {stage >= 1 && <IndustriesServedSection onOpenInquiry={openInquiry} />}

      {/* 4. Global Reach (loaded next in sequence) */}
      {stage >= 2 && <GlobalReachSection />}

      {/* 5. Clients (loaded next in sequence) */}
      {stage >= 3 && <ClientsSection images={clientLogos} imageFit="contain" />}

      {/* 6. Footer & QuickActions (loaded next in sequence) */}
      {stage >= 4 && (
        <>
          <FooterSection onShowToast={showToast} />
          <QuickActions />
        </>
      )}

      {toast && (
        <div className="fixed z-[100] top-[90px] md:top-[120px] left-3.5 right-3.5 md:left-auto md:right-[25px] flex items-center gap-2.5 py-[15px] px-[19px] text-navy bg-white border-l-[3px] border-gold shadow-[0_10px_30px_rgba(42,41,103,0.17)] text-xs font-semibold">
          <Check size={16} className="text-gold" /> {toast}
        </div>
      )}

      <InquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
