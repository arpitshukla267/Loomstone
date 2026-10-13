"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { siteImages } from "@/components/site/site-images";
import { SectionIntro } from "./section-intro";
import { Reveal, FadeImage } from "../ui/reveal";

export interface DesignPiece {
  name: string;
  image: string;
  description: string;
  density: string;
}

export const defaultDesigns: DesignPiece[] = [
  {
    name: "Solstice No. VII",
    image: siteImages.wool,
    description:
      "Hand-spun highland wool accented with unbleached mulberry silk and natural walnut abrash.",
    density: "240 Knots / Sq. In.",
  },
  {
    name: "Travertine Strata",
    image: siteImages.relief,
    description:
      "Architectural striated relief with hand-carved elevation variation creating subtle shadows.",
    density: "180 Knots / Sq. In.",
  },
  {
    name: "Ochre Horizon",
    image: siteImages.flat,
    description:
      "Botanical vegetable dye hand-spun wool inspired by desert elevations at dusk.",
    density: "200 Knots / Sq. In.",
  },
];

export interface FeaturedDesignsSectionProps {
  designs?: DesignPiece[];
  onOpenInquiry?: () => void;
}

export function FeaturedDesignsSection({
  designs = defaultDesigns,
  onOpenInquiry,
}: FeaturedDesignsSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, designs.length]);

  // Moves to the previous/next card and brings it to the horizontal center.
  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
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
    "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-[0_8px_24px_rgba(42,41,103,0.18)] transition-all duration-300 hover:bg-navy hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-0 md:h-12 md:w-12 md:border md:border-line";

  return (
    <section
      className="bg-ash py-[70px] md:py-[100px] px-6 md:px-[5%] overflow-hidden"
      id="inspiration"
    >
      <div className="max-w-[1310px] mx-auto">
        <Reveal>
          <SectionIntro
            eyebrow="Gallery Selection"
            title="Featured Designs"
            text="Each piece is made to order. Custom size, color, and fiber options available."
          />
        </Reveal>

        <div className="relative">
          <button
            type="button"
            aria-label="Previous design"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className={`${arrowClass} left-2 md:-left-6`}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next design"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className={`${arrowClass} right-2 md:-right-6`}
          >
            <ArrowRight size={20} />
          </button>

          {/*
            Mobile: card width = 80vw - 32px, so one card + gap + 25% of the
            next one fills the screen (about 1.25 cards visible).
            Desktop (md+): fixed 390px cards.
            overflow-y-hidden stops the track from scrolling vertically.
          */}
          <div
            ref={scrollerRef}
            onScroll={updateArrows}
            className="-mx-6 -my-3 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:gap-6 md:px-0"
          >
            {designs.map((piece, index) => {
              const base = index * 160;

              return (
                <Reveal
                  key={piece.name}
                  delay={base}
                  className="w-[calc(80vw-32px)] flex-none snap-center md:w-[390px]"
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#dbe1e5] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_16px_30px_rgba(42,41,103,0.07)]">
                    <Reveal delay={base + 150} y={14}>
                      <div className="relative h-[170px] overflow-hidden bg-[#dbe1e5] md:h-[210px]">
                        <FadeImage
                          src={piece.image}
                          alt={piece.name}
                          fill
                          sizes="(min-width: 768px) 390px, 80vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                      </div>
                    </Reveal>

                    <div className="flex flex-1 flex-col p-4 md:p-5">
                      <Reveal delay={base + 250} y={14}>
                        <h3 className="m-0 truncate text-navy font-manrope font-normal text-[20px] leading-[1.3] md:text-[24px]">
                          {piece.name}
                        </h3>
                      </Reveal>

                      {/* Description: clamped with ellipsis, always reserves the same space */}
                      <Reveal delay={base + 350} y={14}>
                        <p className="mt-1.5 line-clamp-2 min-h-[3.2em] text-cool text-[12px] leading-[1.6] md:mt-2 md:line-clamp-3 md:min-h-[5.1em] md:text-[13px] md:leading-[1.7]">
                          {piece.description}
                        </p>
                      </Reveal>

                      <Reveal
                        delay={base + 450}
                        y={14}
                        className="flex flex-1 flex-col"
                      >
                        <dl className="my-3 rounded-lg border border-[#dbe1e5] bg-ash px-3 py-2 md:my-4 md:px-3.5 md:py-2.5">
                          <div className="flex justify-between gap-4 border-b border-[#dbe1e5] py-1">
                            <dt className="text-gold text-[9px] font-bold tracking-[.1em] uppercase">
                              Weave Density
                            </dt>
                            <dd className="m-0 text-navy text-[11px] text-right font-medium">
                              {piece.density}
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4 border-b border-[#dbe1e5] py-1">
                            <dt className="text-gold text-[9px] font-bold tracking-[.1em] uppercase">
                              Composition
                            </dt>
                            <dd className="m-0 text-navy text-[11px] text-right font-medium">
                              Pure natural fiber
                            </dd>
                          </div>
                          <div className="flex justify-between gap-4 py-1">
                            <dt className="text-gold text-[9px] font-bold tracking-[.1em] uppercase">
                              Craft Lead Time
                            </dt>
                            <dd className="m-0 text-navy text-[11px] text-right font-medium">
                              12–18 weeks
                            </dd>
                          </div>
                        </dl>

                        <button
                          type="button"
                          className="mt-auto min-h-[44px] w-full cursor-pointer rounded-[8px] border-0 bg-navy px-6 text-[10px] font-bold uppercase tracking-[.13em] text-white transition-colors duration-200 hover:bg-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
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

export default FeaturedDesignsSection;
