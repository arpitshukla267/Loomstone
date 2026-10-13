"use client";

import { type ReactNode } from "react";
import { HeaderSection } from "@/components/sections/header-section";
import { FooterSection } from "@/components/sections/footer-section";
import { QuickActions } from "@/components/sections/quick-actions";
import { siteImages } from "./site-images";

// Re-exported so existing `import { siteImages } from '.../site-chrome'` keeps working.
export { siteImages };

export function PageFrame({
  active,
  children,
}: {
  active: string;
  children: ReactNode;
}) {
  return (
    <main className="overflow-hidden bg-ash text-ink font-sans">
      <HeaderSection activePage={active} />
      {children}
      <FooterSection />
      <QuickActions />
    </main>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-[30px] mb-[30px] md:mb-[43px]">
      <div>
        <h2 className="my-2 text-navy font-manrope font-normal text-[30px] md:text-[clamp(30px,4vw,50px)] leading-[1.1]">
          {title}
        </h2>
        <p className="max-w-[580px] m-0 text-cool text-[15px] leading-[1.7]">
          {text}
        </p>
      </div>
    </div>
  );
}
