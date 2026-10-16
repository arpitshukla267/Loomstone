"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "../ui/reveal";

interface RoomCard {
  name: string;
  tagline: string;
  image: string;
  href: string;
  count?: string;
}

const ROOMS: RoomCard[] = [
  {
    name: "Living Room",
    tagline:
      "Statement centerpieces designed for seating arrangements & conversation.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Living+Room",
    count: "8+ Curated Designs",
  },
  {
    name: "Bedroom",
    tagline:
      "Serene, tactile luxury providing acoustic warmth and soft morning steps.",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Bedroom",
    count: "6+ Curated Designs",
  },
  {
    name: "Dining Room",
    tagline:
      "Hard-wearing handlooms, low piles and axminsters allowing effortless chair gliding.",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Dining+Room",
    count: "5+ Curated Designs",
  },
  {
    name: "Hallway & Entryway",
    tagline:
      "Durable gallery runners welcoming guests and softening circulation zones.",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Hallway+%26+Entryway",
    count: "4+ Curated Designs",
  },
];

const MOBILE_GAP = 12; // gap-3 = 12px

export function FindByRoomSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

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
  }, [updateArrows]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    // exactly one card (width + gap) so the next card lands in the center
    const step = firstCard.offsetWidth + MOBILE_GAP;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="bg-ash px-6 py-16 md:px-[5%] md:py-24">
      <div className="mx-auto max-w-[1310px]">
        {/* Section Intro */}
        <div className="text-center">
          <Reveal delay={100}>
            <h2 className="mt-2 font-manrope text-[32px] font-normal tracking-[-0.02em] text-navy md:text-[44px]">
              Find by Room
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mx-auto mt-3 max-w-[620px] text-[13px] leading-[1.8] text-cool md:text-[15px]">
              Discover handmade rugs calibrated for the functional demands and
              architectural proportions of each space.
            </p>
          </Reveal>
        </div>

        {/* Mobile: centered snap carousel (prev/next peek) | sm+: grid */}
        <div className="relative mt-12">
          <div
            ref={scrollerRef}
            onScroll={updateArrows}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-[10%] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
          >
            {ROOMS.map((room, index) => (
              <div
                key={room.name}
                className="w-full shrink-0 snap-center sm:w-auto sm:shrink sm:snap-align-none [&>*]:h-full"
              >
                <Reveal delay={index * 120} y={24}>
                  <Link
                    href={room.href}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#dbe1e5] bg-white transition-all duration-300 sm:hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_36px_rgba(42,41,103,0.1)]"
                  >
                    {/* Room Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8e9e8] sm:aspect-[11/12]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={room.image}
                        alt={room.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Gradient Overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <h3 className="font-manrope text-[18px] font-normal text-navy transition-colors duration-200 group-hover:text-gold sm:text-[20px]">
                        {room.name}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.6] text-cool sm:mt-2 sm:leading-[1.7]">
                        {room.tagline}
                      </p>

                      <div className="mt-auto pt-3 sm:pt-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy transition-colors group-hover:text-gold">
                          View Collection <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </div>
            ))}
          </div>

          {/* Mobile arrows: vertically centered on cards */}
          <button
            type="button"
            aria-label="Previous rooms"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="absolute left-1 top-[calc(50%-8px)] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dbe1e5] bg-white text-navy shadow-md transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:hidden"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next rooms"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="absolute right-1 top-[calc(50%-8px)] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#dbe1e5] bg-white text-navy shadow-md transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-0 sm:hidden"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default FindByRoomSection;
