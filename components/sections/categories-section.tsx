"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteImages } from "@/components/site/site-images";
import { SectionIntro } from "./section-intro";
import { Reveal, FadeImage } from "../ui/reveal";

export interface CategoryItem {
  title: string;
  text: string;
  image: string;
}

export const defaultCategories: CategoryItem[] = [
  {
    title: "Hand-Knotted Haute Couture",
    text: "High-density botanical dye silk and highland fleece. Up to 300 KPSI with heirloom resilience.",
    image: siteImages.wool,
  },
  {
    title: "Textured Hand-Tufted & Relief",
    text: "Sculptural cut and loop pile crafted for luxury penthouses, suites, and high-traffic salons.",
    image: siteImages.relief,
  },
  {
    title: "Raw Jute & Flatweave Dhurries",
    text: "Artisanal heritage grounding pieces woven from unbleached jute, nettle, and hand-spun flax.",
    image: siteImages.flat,
  },
  {
    title: "Architectural Monochromes",
    text: "Understated tonalities, organic abrash variations, and micro-ribbed structures for calm expanses.",
    image: siteImages.mono,
  },
];

export interface CategoriesSectionProps {
  categories?: CategoryItem[];
  onOpenInquiry?: () => void;
  onShowToast?: (message: string) => void;
}

export function CategoriesSection({
  categories = defaultCategories,
  onOpenInquiry,
  onShowToast,
}: CategoriesSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  // Moves to the previous/next card and brings it to the horizontal center.
  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    if (!cards.length) return;

    const trackRect = el.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    const centerOf = (c: HTMLElement) => {
      const r = c.getBoundingClientRect();
      return r.left + r.width / 2;
    };

    // Card currently closest to the center
    let current = 0;
    let best = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(centerOf(c) - trackCenter);
      if (d < best) {
        best = d;
        current = i;
      }
    });

    const target =
      cards[Math.min(Math.max(current + direction, 0), cards.length - 1)];
    el.scrollBy({ left: centerOf(target) - trackCenter, behavior: "smooth" });
  };

  const arrowClass =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_6px_18px_rgba(42,41,103,0.2)] transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:hidden";

  return (
    <section
      className="bg-white py-[70px] md:py-[100px] px-6 md:px-[5%]"
      id="about"
    >
      <div className="max-w-[1310px] mx-auto">
        <Reveal>
          <SectionIntro
            eyebrow="Textile Typologies"
            title="Our Rug Styles"
            text="Four distinct weaving styles made for living rooms, bedrooms, and commercial spaces."
          />
        </Reveal>

        {/* Wrapper holds the arrows (mobile only) */}
        <div className="relative">
          <button
            type="button"
            aria-label="Previous style"
            onClick={() => scrollByCard(-1)}
            className={`${arrowClass} left-2 ${
              canPrev ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Next style"
            onClick={() => scrollByCard(1)}
            className={`${arrowClass} right-2 ${
              canNext ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ChevronRight size={20} />
          </button>

          {/*
            Mobile: horizontal swipe carousel, ~1.25 cards visible at a time.
            Card width = 80vw - 32px, so card + gap + 25% of the next card
            exactly fills the space to the right of the 24px page padding.
            Desktop (md+): original grid, unchanged.
          */}
          <div
            ref={trackRef}
            onScroll={updateArrows}
            className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4"
          >
            {categories.map((category, index) => {
              // Cards stagger by column; inner pieces follow the card in order.
              const base = (index % 4) * 160;

              return (
                <Reveal
                  key={category.title}
                  delay={base}
                  className="h-full w-[calc(80vw-32px)] shrink-0 snap-center md:w-auto md:shrink"
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#dbe1e5] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_16px_30px_rgba(42,41,103,0.07)]">
                    <Reveal delay={base + 150} y={14}>
                      <div className="relative h-[190px] overflow-hidden md:h-[270px] bg-[#dbe1e5]">
                        <FadeImage
                          src={category.image}
                          alt={category.title}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 80vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                      </div>
                    </Reveal>

                    <div className="flex flex-1 flex-col p-4 md:p-6">
                      <Reveal delay={base + 250} y={14}>
                        <h3 className="m-0 line-clamp-2 min-h-[2.6em] text-navy font-manrope font-normal text-[18px] leading-[1.3] md:text-[21px]">
                          {category.title}
                        </h3>
                      </Reveal>

                      <Reveal
                        delay={base + 350}
                        y={14}
                        className="flex flex-1 flex-col"
                      >
                        <p className="text-cool text-[12px] leading-[1.6] mt-1.5 mb-4 md:mb-[25px] line-clamp-3 min-h-[4.8em] md:text-[13px] md:leading-[1.7] md:mt-2 md:min-h-[5.1em]">
                          {category.text}
                        </p>

                        <button
                          type="button"
                          className="w-full cursor-pointer mt-auto pt-2 md:mt-auto rounded-[8px] border-0 bg-navy py-2.5 md:py-3 text-[10px] font-bold uppercase tracking-[.12em] text-white transition-colors hover:bg-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                          onClick={onOpenInquiry}
                        >
                          Enquire Now
                        </button>
                      </Reveal>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
