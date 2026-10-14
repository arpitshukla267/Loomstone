'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  HeaderSection,
  HeroSection,
  FindYourRugSection,
  FindByRoomSection,
  CategoriesSection,
  FeaturedDesignsSection,
  ProcessSection,
  ProjectsSection,
  FaqSection,
  RecentBlogsSection,
  FooterSection,
  QuickActions,
  InquiryModal,
} from '@/components/sections';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  };

  const openInquiry = () => {
    setModalOpen(true);
  };

  return (
    <main className="overflow-hidden bg-ash text-ink font-sans">
      <HeaderSection onShowToast={showToast} activePage="Home" />
      <HeroSection onOpenInquiry={openInquiry} />
      {/* <FindYourRugSection /> */}
      <FindByRoomSection />
      <div className='text-4xl text-center'>banner</div>
      <CategoriesSection onOpenInquiry={openInquiry} onShowToast={showToast} />
      <FeaturedDesignsSection onOpenInquiry={openInquiry} />
      {/* <ProcessSection onOpenInquiry={openInquiry} /> */}
      {/* <ProjectsSection onOpenInquiry={openInquiry} /> */}
      <FaqSection />
      <RecentBlogsSection />
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
