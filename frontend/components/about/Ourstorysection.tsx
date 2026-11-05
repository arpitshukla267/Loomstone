"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export default function OurStorySection() {
  return (
    <section
      id="our-story"
      className="flex w-full flex-col items-center pb-20 mt-24 lg:mt-36 min-[1400px]:mt-28 3xl:pb-[5vw] 3xl:pt-[2vw] sm:pt-12 3xl:pt-16"
    >
      <div className="px-6 text-center md:px-[5vw]">
        <Reveal delay={100}>
          <h2 className="font-manrope mb-6 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2a2a6b] md:text-[36px] lg:text-[42px] min-[1400px]:text-[48px] 3xl:mb-[1.8vw] 3xl:text-[3.5vw]">
            Flooring That Brings
            <br />
            <span className="text-[#e8a21c]">Design Visions to Life.</span>
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="mx-auto max-w-4xl space-y-4 text-center text-xs leading-[1.8] text-slate-600 md:text-sm min-[1400px]:text-base 3xl:max-w-[60vw] 3xl:space-y-[1vw] 3xl:text-[1.17vw] 3xl:leading-[1.6]">
            <p>
              Loomstone is a design-led flooring solutions company specialising
              in bespoke carpets, rugs and customised flooring for hospitality,
              commercial and luxury residential projects. Rooted in
              craftsmanship and driven by innovation, we bring together India’s
              rich textile heritage, contemporary design sensibilities and
              technical expertise to create distinctive flooring solutions that
              elevate interiors and enrich experiences.
            </p>
            <p>
              Driven by a passion for design and innovation, we transform
              materials, textures and patterns into thoughtfully curated
              flooring experiences that reflect the unique character and purpose
              of every space.
            </p>
            <p>
              Working in close collaboration with architects, interior
              designers, developers and project teams, we translate design
              visions into tailored flooring solutions that balance aesthetics,
              functionality and lasting performance. From concept development
              and material selection to manufacturing, supply and installation
              support, we bring expertise and attention to detail to every stage
              of the journey.
            </p>
            <p>
              At Loomstone, we believe flooring is more than a surface. It is an
              essential design element that shapes experiences, enhances
              environments and leaves a lasting impression.
            </p>
            <p>
              <span className="font-semibold">
                Thoughtfully Designed. Expertly Crafted. Made for Lasting
                Impact.
              </span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <Link
            href="/products"
            className="mt-9 inline-flex items-center gap-2.5 rounded-[8px] bg-[#2a2a6b] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#e8a21c] hover:text-[#2a2a6b] 3xl:mt-[2.6vw] 3xl:gap-[0.75vw] 3xl:px-[1.75vw] 3xl:py-[1vw] 3xl:text-[1.02vw]"
          >
            Explore Our Collections{" "}
            <ArrowUpRight size={16} className="3xl:h-[1.17vw] 3xl:w-[1.17vw]" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
