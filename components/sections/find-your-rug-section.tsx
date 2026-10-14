"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "../ui/reveal";
import { ArrowRight } from "lucide-react";

type TabType = "weave" | "style";

interface RugOption {
  title: string;
  image: string;
  href: string;
  tag: string;
}

const WEAVE_OPTIONS: RugOption[] = [
  {
    title: "Hand Knotted",
    image: "/products/hand-knotted.png",
    href: "/products?weave=Hand+Knotted",
    tag: "Heirloom Craft",
  },
  {
    title: "Hand Tufted",
    image: "/products/hand-tufted.png",
    href: "/products?weave=Hand+Tufted",
    tag: "Plush & Sculpted",
  },
  {
    title: "Handloom",
    image: "/products/Power-Loomed.png",
    href: "/products?weave=Handloom",
    tag: "Tactile Texture",
  },
  {
    title: "Flatweave",
    image: "/products/flatweave.png",
    href: "/products?weave=Flatweave",
    tag: "Dhurrie & Kilim",
  },
];

const STYLE_OPTIONS: RugOption[] = [
  {
    title: "Modern Minimalist",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    href: "/products?style=Modern+Minimalist",
    tag: "Quiet Neutrals",
  },
  {
    title: "Heritage & Vintage",
    image: "/products/hand-knotted.png",
    href: "/products?style=Heritage+%26+Vintage",
    tag: "Classic Medallions",
  },
  {
    title: "Geometric & Linear",
    image: "/products/flatweave.png",
    href: "/products?style=Geometric+%26+Linear",
    tag: "Architectural Lines",
  },
  {
    title: "Organic & Abstract",
    image: "/products/hand-tufted.png",
    href: "/products?style=Organic+%26+Abstract",
    tag: "Sculptural Curves",
  },
];

export function FindYourRugSection() {
  const [activeTab, setActiveTab] = useState<TabType>("weave");
  const options = activeTab === "weave" ? WEAVE_OPTIONS : STYLE_OPTIONS;

  return (
    <section className="bg-white px-6 py-16 md:px-[5%] md:py-24">
      <div className="mx-auto max-w-[1310px]">
        {/* Section Header */}
        <div className="text-center">
          <Reveal>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Curated Discovery
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mt-2 font-manrope text-[32px] font-normal tracking-[-0.02em] text-navy md:text-[44px]">
              Find Your Rug
            </h2>
          </Reveal>

          {/* Weave / Style Switcher Tabs */}
          <Reveal delay={200}>
            <div className="mt-7 flex items-center justify-center gap-8">
              <button
                type="button"
                onClick={() => setActiveTab("weave")}
                className={`relative pb-2 text-[13px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                  activeTab === "weave"
                    ? "text-navy"
                    : "text-cool/60 hover:text-navy"
                }`}
              >
                Weave
                {activeTab === "weave" && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-navy" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("style")}
                className={`relative pb-2 text-[13px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                  activeTab === "style"
                    ? "text-navy"
                    : "text-cool/60 hover:text-navy"
                }`}
              >
                Style
                {activeTab === "style" && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-navy" />
                )}
              </button>
            </div>
          </Reveal>
        </div>

        {/* Rug Grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8">
          {options.map((item, index) => (
            <Reveal key={item.title} delay={index * 120} y={20}>
              <Link
                href={item.href}
                className="group flex flex-col items-center text-center transition-transform duration-300"
              >
                {/* Rug Cutout Image Container */}
                <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#f8f9fa] p-4 transition-all duration-500 group-hover:bg-[#f1f4f6] group-hover:shadow-[0_16px_36px_rgba(42,41,103,0.08)]">
                  <div className="relative h-full w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-contain drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wide text-cool shadow-sm backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Rug Label */}
                <h3 className="mt-4 font-manrope text-[16px] font-normal text-navy transition-colors duration-200 group-hover:text-gold sm:text-[18px]">
                  {item.title}
                </h3>

                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium tracking-wide text-cool/70 group-hover:text-navy">
                  Explore Designs <ArrowRight size={12} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FindYourRugSection;
