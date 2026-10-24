"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";


export default function OurStorySection() {
  return (
    <section
      id="our-story"
      className="mx-auto grid max-w-full items-center gap-10 pb-20 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20"
    >
      {/* ================= Left: story illustration ================= */}
      <Reveal>
        <div className="flex items-center justify-center">
          <img
            src="/story.png"
            alt="A child imagining spaces as stories, surrounded by rug sketches and textures"
            loading="lazy"
            className="h-auto w-full max-w-full object-contain mix-blend-multiply"
          />
        </div>
      </Reveal>

      {/* ================= Right: content ================= */}
      <div className="pr-6 md:pr-[5%]">
        <Reveal delay={100}>
          <h2 className="font-manrope mb-6 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2a2a6b] md:text-[48px]">
            Every exceptional space
            <br />
            <span className="text-[#e8a21c]">begins with a vision.</span>
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="max-w-[640px] space-y-4 text-xs leading-[1.8] text-slate-600 md:text-base">
            <p>
              At Loomstone, we believe exceptional flooring begins with a clear
              vision and is realised through meticulous execution. Combining
              design intelligence, technical expertise, and project management
              excellence, we guide each project through a seamless journey,
              transforming concepts into distinctive flooring experiences that
              elevate the character, performance, and identity of a space.
            </p>
            <p>
              Rooted in the heritage of handcrafted weaving and refined by
              modern manufacturing, we partner with architects, interior
              designers, developers, and hospitality groups across international
              markets. From luxury hotels and signature commercial developments
              to private residences, every collection is created to meet
              exacting design intent, specification standards, and long-term
              performance expectations.
            </p>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <Link
            href="/products"
            className="mt-9 inline-flex items-center gap-2.5 rounded-[8px] bg-[#2a2a6b] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#e8a21c] hover:text-[#2a2a6b]"
          >
            Explore Our Collections <ArrowUpRight size={16} />
          </Link>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 max-w-[640px] border-t border-slate-200 pt-6">
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="font-serif text-[40px] leading-none text-slate-300"
              >
                &ldquo;
              </span>
              <p className="text-[15px] leading-[1.6] text-slate-600">
                Designed with intent.
                <br />
                Built to endure.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
