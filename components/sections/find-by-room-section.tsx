"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    tagline: "Statement centerpieces designed for seating arrangements & conversation.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Living+Room",
    count: "8+ Curated Designs",
  },
  {
    name: "Bedroom",
    tagline: "Serene, tactile luxury providing acoustic warmth and soft morning steps.",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Bedroom",
    count: "6+ Curated Designs",
  },
  {
    name: "Dining Room",
    tagline: "Hard-wearing flatweaves and low piles allowing effortless chair gliding.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Dining+Room",
    count: "5+ Curated Designs",
  },
  {
    name: "Hallway & Entryway",
    tagline: "Durable gallery runners welcoming guests and softening circulation zones.",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80",
    href: "/products?room=Hallway+%26+Entryway",
    count: "4+ Curated Designs",
  },
];

export function FindByRoomSection() {
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
              Discover handmade rugs calibrated for the functional demands and architectural proportions of each space.
            </p>
          </Reveal>
        </div>

        {/* Room Cards Grid (Matching Screenshot 2) */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROOMS.map((room, index) => (
            <Reveal key={room.name} delay={index * 120} y={24}>
              <Link
                href={room.href}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#dbe1e5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_36px_rgba(42,41,103,0.1)]"
              >
                {/* Room Image */}
                <div className="relative aspect-[11/12] w-full overflow-hidden bg-[#e8e9e8]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={room.image}
                    alt={room.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                  {/* Pill count */}
                  {/* <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wide text-navy shadow-sm backdrop-blur-sm">
                    {room.count}
                  </span> */}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-manrope text-[20px] font-normal text-navy transition-colors duration-200 group-hover:text-gold">
                    {room.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-[12px] leading-[1.7] text-cool">
                    {room.tagline}
                  </p>

                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy transition-colors group-hover:text-gold">
                      View Collection <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FindByRoomSection;
