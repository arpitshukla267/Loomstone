"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import {
  HeaderSection,
  HeroSection,
  FindByRoomSection,
  CategoriesSection,
  FeaturedDesignsSection,
  FaqSection,
  RecentBlogsSection,
  FooterSection,
  QuickActions,
  InquiryModal,
  ClientsSection,
} from "@/components/sections";
import GlobalReachSection from "@/components/sections/global-reach-section";
import Link from "next/link";

const clientLogos = [
  "airtel.webp",
  "hyatt.png",
  "vodafone.webp",
  "leela.webp",
  "aster.jpeg",
  "moxy.avif",
  "dlf-ultima.webp",
  "dlf.webp",
  "tec.jpeg",
  "courtyard.avif",
  "Fortune-Hotel-logo.webp",
  "fcml.png",
  "leela.webp",
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
    <main className="overflow-hidden bg-ash text-ink font-sans">
      <HeaderSection onShowToast={showToast} activePage="Home" />
      <HeroSection onOpenInquiry={openInquiry} />
      <FindByRoomSection />

      <GlobalReachSection />

      <CategoriesSection onOpenInquiry={openInquiry} onShowToast={showToast} />

      {/* Banner - Categories ke neeche */}
      {/* <section className="relative w-full h-[80vh]">
        <Link href="/products">
          <Image
            src="/banner.webp"
            alt="Banner"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </Link>
      </section> */}

      <FeaturedDesignsSection onOpenInquiry={openInquiry} />
      <ClientsSection images={clientLogos} imageFit="contain" />
      <RecentBlogsSection />
      <FaqSection />
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
