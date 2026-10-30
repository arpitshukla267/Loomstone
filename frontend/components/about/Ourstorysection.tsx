"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export default function OurStorySection() {
  return (
    <section
      id="our-story"
      className="grid w-full items-center gap-10 pb-20 pt-10 lg:grid-cols-[1.1fr_1fr] lg:gap-[4vw]"
    >
      {/* ================= Left: story illustration ================= */}
      <Reveal>
        <div className="flex items-center justify-start">
          <img
            src="/story.png"
            alt="A child imagining spaces as stories, surrounded by rug sketches and textures"
            loading="lazy"
            className="h-auto w-full object-contain object-left mix-blend-multiply"
          />
        </div>
      </Reveal>

      {/* ================= Right: content ================= */}
      <div className="pl-6 pr-6 md:pl-[5vw] md:pr-[5vw] lg:pl-0 lg:pr-[5vw] 3xl:pr-[6vw]">
        <Reveal delay={100}>
          <h2 className="font-manrope mb-6 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2a2a6b] md:text-[48px] 3xl:text-[58px] 4xl:text-[68px]">
            Flooring That Brings
            <br />
            <span className="text-[#e8a21c]">Design Visions to Life.</span>
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="max-w-full space-y-4 text-xs leading-[1.8] text-slate-600 md:text-base lg:max-w-[40vw] 3xl:text-lg 4xl:text-xl">
            <p>
              At Loomstone, we believe exceptional spaces begin with thoughtful
              design and are defined by the details beneath our feet. As a
              provider of bespoke carpets, handcrafted rugs and premium flooring
              solutions, we bring together design creativity, material expertise
              and precision to help transform architectural visions into
              remarkable interiors.
            </p>
            <p>
              Rooted in the art of craftsmanship and guided by contemporary
              design, we collaborate with architects, interior designers,
              hospitality brands and commercial developers to create flooring
              solutions tailored to each project's aesthetic, functional and
              performance requirements. From luxury hotels and distinguished
              commercial spaces to refined private residences, every solution is
              developed with careful attention to detail, enduring quality and
              the character of the space it serves.
            </p>
            <p>
              <span className="font-semibold">
                Thoughtfully designed. Expertly crafted. Made for lasting
                impact.
              </span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <Link
            href="/products"
            className="mt-9 inline-flex items-center gap-2.5 rounded-[8px] bg-[#2a2a6b] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#e8a21c] hover:text-[#2a2a6b] 3xl:text-base 4xl:px-8 4xl:py-4 4xl:text-lg"
          >
            Explore Our Collections <ArrowUpRight size={16} />
          </Link>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 max-w-full border-t border-slate-200 pt-6 lg:max-w-[40vw]">
            <div className="flex items-start gap-4">
              <span
                aria-hidden
                className="font-serif text-[40px] leading-none text-slate-300 4xl:text-[52px]"
              >
                &ldquo;
              </span>
              <p className="text-[15px] leading-[1.6] text-slate-600 3xl:text-[17px] 4xl:text-[20px]">
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
