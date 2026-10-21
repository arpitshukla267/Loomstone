"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "../ui/reveal";

interface RoomCard {
  id: string;
  heading: string;
  desc: string;
  image: string;
  href: string;
}

// Backend se aane wala room (sirf wahi fields jo yahan kaam aati hain)
interface ApiRoom {
  _id: string;
  name?: string;
  heading?: string;
  desc?: string;
  image?: string;
  href?: string;
}

// Backend jaisa hi href format: "Hallway & Entryway" -> /products?room=Hallway+%26+Entryway
const buildHref = (name: string) =>
  `/products?room=${encodeURIComponent(name).replace(/%20/g, "+")}`;

// Backend band ho ya data khali ho to yahi dikhega
const DEFAULT_ROOMS: RoomCard[] = [
  {
    id: "living-room",
    heading: "Living Room",
    desc: "Statement centerpieces designed for seating arrangements & conversation.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Living+Room",
  },
  {
    id: "bedroom",
    heading: "Bedroom",
    desc: "Serene, tactile luxury providing acoustic warmth and soft morning steps.",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Bedroom",
  },
  {
    id: "dining-room",
    heading: "Dining Room",
    desc: "Hard-wearing handlooms, low piles and axminsters allowing effortless chair gliding.",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Dining+Room",
  },
  {
    id: "hallway-entryway",
    heading: "Hallway & Entryway",
    desc: "Durable gallery runners welcoming guests and softening circulation zones.",
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Hallway+%26+Entryway",
  },
];

const FETCH_TIMEOUT_MS = 4000;

export function FindByRoomSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [rooms, setRooms] = useState<RoomCard[]>(DEFAULT_ROOMS);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // Backend se rooms lao; kuch bhi gadbad ho to chup-chaap hardcoded rehne do
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!base) return;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    fetch(`${base}/api/rooms`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load rooms");
        return res.json();
      })
      .then((data) => {
        const list: ApiRoom[] | undefined = Array.isArray(data)
          ? data
          : data?.data;
        if (!Array.isArray(list) || list.length === 0) return;

        const mapped: RoomCard[] = list
          .filter((r) => r?.image && (r.heading || r.name))
          .map((r) => ({
            id: r._id,
            heading: (r.heading || r.name) as string,
            desc: r.desc || "",
            image: r.image as string,
            href: r.href || buildHref(r.name || (r.heading as string)),
          }));

        if (mapped.length > 0) setRooms(mapped);
      })
      .catch(() => {
        /* hardcoded rooms chalte rehte hain */
      })
      .finally(() => clearTimeout(timer));

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

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

  // Rooms badalne par (backend wale aaye) carousel shuru se dikhao aur arrows dobara check karo
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 });
    updateArrows();
  }, [rooms, updateArrows]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    // gap screen ke hisaab se badalta hai (mobile 12px, sm+ 24px), isliye CSS se padho
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = firstCard.offsetWidth + gap;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="bg-[#FFFCF4] ash px-6 py-16 md:px-[5%] md:py-24">
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

        {/* Hamesha ek hi row: mobile 1 card, sm 2 cards, lg 4 cards, baaki arrows se scroll */}
        <div className="relative mt-12">
          <div
            ref={scrollerRef}
            onScroll={updateArrows}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-[10%] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mt-2 sm:-mb-6 sm:gap-6 sm:px-0 sm:pt-2 sm:pb-8"
          >
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className="w-full shrink-0 snap-center sm:w-[calc((100%_-_1.5rem)/2)] sm:snap-start lg:w-[calc((100%_-_4.5rem)/4)] [&>*]:h-full"
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
                        alt={room.heading}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Gradient Overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <h3 className="font-manrope text-[18px] font-normal text-navy transition-colors duration-200 group-hover:text-gold sm:text-[20px]">
                        {room.heading}
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.6] text-cool sm:mt-2 sm:leading-[1.7]">
                        {room.desc}
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

          {/* Arrows: mobile par andar, sm+ par kinare par; sirf jab scroll karne ko kuch ho */}
          <button
            type="button"
            aria-label="Previous rooms"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="absolute left-1 top-[calc(50%-8px)] z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#dbe1e5] bg-white text-navy shadow-md transition-all hover:border-gold hover:text-gold active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:-left-5 sm:top-1/2 sm:h-11 sm:w-11"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next rooms"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="absolute right-1 top-[calc(50%-8px)] z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#dbe1e5] bg-white text-navy shadow-md transition-all hover:border-gold hover:text-gold active:scale-95 disabled:pointer-events-none disabled:opacity-50 sm:-right-5 sm:top-1/2 sm:h-11 sm:w-11"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default FindByRoomSection;
