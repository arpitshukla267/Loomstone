"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  HeaderSection,
  HeroSection,
  FaqSection,
  RecentBlogsSection,
  FooterSection,
  QuickActions,
  InquiryModal,
  ClientsSection,
} from "@/components/sections";
import GlobalReachSection from "@/components/sections/global-reach-section";
import IndustriesServedSection from "@/components/sections/industries-we-serve";
import WhyLoomstoneSection from "@/components/sections/why-loomstone-section";

const clientLogos = [
  "marriott.webp",
  "hilton.webp",
  "hyatt.webp",
  "itc.png",
  "leela.webp",
  "dlf.webp",
  "fcml.png",
  "airtel.webp",
  // "vodafone.webp",
  // "aster.jpeg",
  // "moxy.avif",
  // "dlf-ultima.webp",
  // "courtyard.avif",
  // "tec.jpeg",
].map((name) => `/clients/${name}`);

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");

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
      <HeroSection onOpenInquiry={openInquiry} />

      {/* Why Loomstone: image + content + 6 features */}
      <WhyLoomstoneSection image="/why-loomstone.jpg" />

      {/* Industries We Serve: arrow click par inquiry modal khulega */}
      <IndustriesServedSection onOpenInquiry={openInquiry} />

      <GlobalReachSection />

      <ClientsSection images={clientLogos} imageFit="contain" />
      {/* <RecentBlogsSection /> */}
      {/* <FaqSection /> */}
      <FooterSection onShowToast={showToast} />
      <QuickActions />

      {toast && (
        <div className="fixed z-[100] top-[90px] md:top-[120px] left-3.5 right-3.5 md:left-auto md:right-[25px] flex items-center gap-2.5 py-[15px] px-[19px] text-navy bg-white border-l-[3px] border-gold shadow-[0_10px_30px_rgba(42,41,103,0.17)] text-xs font-semibold">
          <Check size={16} className="text-gold" /> {toast}
        </div>
      )}

      <InquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
