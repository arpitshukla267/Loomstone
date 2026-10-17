"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
} from "lucide-react";
import { Reveal, FadeImage } from "../ui/reveal";
import { SectionIntro } from "./section-intro";
import {
  FEATURED_DESIGNS,
  type FeaturedDesign,
} from "../../data/featuredDesigns";

const queryClassName =
  "inline-flex shrink-0 items-center gap-1 rounded-full border-0 bg-white text-sm font-medium uppercase text-navy shadow-lg transition duration-300 hover:-translate-y-0.5 hover:text-gold";

const arrowClassName =
  "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition duration-300 hover:text-gold";

// Exported so other pages can reuse the exact same card.
// onOpenInquiry diya ho to Query button inquiry modal kholta hai,
// warna /contact?design=<slug> par le jaata hai.
export function FeaturedDesignCard({
  design,
  onOpenInquiry,
}: {
  design: FeaturedDesign;
  onOpenInquiry?: () => void;
}) {
  return (
    <article className="group relative h-[350px] w-full overflow-hidden rounded-xl border border-[#dbe1e5] bg-[#dbe1e5] transition duration-300 hover:border-gold hover:shadow-[0_16px_30px_rgba(42,41,103,0.07)]">
      <FadeImage
        src={design.image}
        alt={design.name}
        fill
        sizes="(min-width: 721px) 33vw, 100vw"
        className="object-cover object-bottom group-hover:scale-[1.06]"
      />

      {/* Neeche se dark overlay, upar ki taraf fade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

      {/* Bottom row: left mein text, right mein Query button */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-manrope text-xl font-normal leading-[1.3] text-white">
            {design.name}
          </h3>
          <p className="mt-1.5 line-clamp-3 text-sm leading-[1.25] text-gray-200/70">
            {design.description}
          </p>
        </div>

        {onOpenInquiry ? (
          <button
            type="button"
            onClick={onOpenInquiry}
            aria-label={`Send a query about ${design.name}`}
            className={queryClassName}
          >
            <CircleHelp size={32} />
          </button>
        ) : (
          <Link
            href={`/contact?design=${design.slug}`}
            aria-label={`Send a query about ${design.name}`}
            className={`${queryClassName} no-underline`}
          >
            Query <ArrowUpRight size={16} />
          </Link>
        )}
      </div>
    </article>
  );
}

export interface FeaturedDesignsSectionProps {
  onOpenInquiry?: () => void;
}

export function FeaturedDesignsSection({
  onOpenInquiry,
}: FeaturedDesignsSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  // Arrow click par agla/pichla card screen ke horizontal center mein aata hai
  const scrollByCard = (dir: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = Array.from(scroller.children) as HTMLElement[];
    if (!cards.length) return;

    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let current = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const distance = Math.abs(
        card.offsetLeft + card.offsetWidth / 2 - center,
      );
      if (distance < best) {
        best = distance;
        current = i;
      }
    });

    const target =
      cards[Math.min(Math.max(current + dir, 0), cards.length - 1)];
    const left =
      target.offsetLeft - (scroller.clientWidth - target.offsetWidth) / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-[1500px] bg-white px-6 py-[70px] md:px-[5%] md:py-[50px]">
      <Reveal>
        <SectionIntro
          eyebrow="Curated Collection"
          title="Featured Designs"
          text="A closer look at the designs our clients enquire about most."
        />
      </Reveal>

      <div className="relative">
        <button
          type="button"
          aria-label="Previous design"
          onClick={() => scrollByCard(-1)}
          className={`${arrowClassName} left-3 ${
            canPrev ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next design"
          onClick={() => scrollByCard(1)}
          className={`${arrowClassName} right-3 ${
            canNext ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronRight size={20} />
        </button>

        {/* Hamesha ek hi row: mobile par 1 card, desktop par 3 cards */}
        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          className="relative -my-4 flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FEATURED_DESIGNS.map((design, index) => (
            <Reveal
              key={design.slug}
              delay={(index % 3) * 160}
              className="h-full shrink-0 basis-full snap-center min-[721px]:basis-[calc((100%-3rem)/3)]"
            >
              <FeaturedDesignCard
                design={design}
                onOpenInquiry={onOpenInquiry}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedDesignsSection;
