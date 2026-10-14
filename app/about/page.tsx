"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Eye, Hammer } from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";
import { Reveal, FadeImage } from "@/components/ui/reveal";
import FounderSection from "@/components/about/FounderSection";
import VisionMissionSection from "@/components/about/Visionmissionsection";
import OurStorySection from "@/components/about/Ourstorysection";

const COMPANY = "Loomstone";
const OWNER = "Pawan Yadav";
const SINCE = "";

const carpetImage = "/carpet.jpeg";
const founderImage = "/founder.jpeg";
const heroImage = "/about.png";

const visionPoints = [
  "Pairing the richness of wool with the resilience of modern fibers",
  "Making bespoke, high-performance carpets the first choice for every space",
];
const missionPoints = [
  "Offering traditional and contemporary designs, or fully bespoke patterns",
  "Using responsibly sourced materials and low-waste manufacturing",
];

const pillars = [
  {
    n: "01",
    title: "Quality Craftsmanship",
    text: "Individual tufts are woven through a backing, creating stunning patterns and exceptional durability.",
    label: "MATERIALS",
    value: "Wool / Nylon Blend",
  },
  {
    n: "02",
    title: "Tailored Designs",
    text: "From timeless traditional patterns to sleek contemporary styles, designed to fit your interiors perfectly.",
    label: "DESIGN",
    value: "Custom & Bespoke",
  },
  {
    n: "03",
    title: "Built to Last",
    text: "Made to handle heavy foot traffic while keeping their elegance and structure for years.",
    label: "DURABILITY",
    value: "Low Cost Per Wear",
  },
  {
    n: "04",
    title: "Sustainable Practice",
    text: "Ethically sourced materials and manufacturing that reduces waste and respects the environment.",
    label: "IMPACT",
    value: "Eco-Conscious",
  },
];

function Eyebrow({
  children,
  line = false,
  center = false,
}: {
  children: React.ReactNode;
  line?: boolean;
  center?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-3.5 text-[10px] font-semibold tracking-[0.18em] text-[#e8a21c] ${center ? "justify-center text-center" : ""}`}
    >
      {children}
      {line && <i className="h-px w-14 shrink-0 bg-[#e8a21c]/50" />}
    </span>
  );
}

export default function AboutPage() {
  return (
    <PageFrame active="About">
      <div className="font-poppins min-h-screen overflow-x-hidden bg-[#f4f9fc] text-[15px] leading-relaxed text-slate-600 pt-20">
        <main>
          {/* Hero: centered title on background image */}
          <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden md:min-h-[500px]">
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-[#000000]/50" />

            <div className="relative z-10 mx-auto max-w-[85vw] px-4 py-16 text-center">
              <Reveal delay={100}>
                <h1 className="font-manrope text-[40px] font-semibold leading-[1.25] text-white md:text-6xl">
                  The Art of{" "}
                  <em className="block font-semibold not-italic text-[#e8a21c]">
                    Woven Carpets
                  </em>
                </h1>
              </Reveal>
            </div>
          </section>

          <OurStorySection />

          {/* ================= Founder ================= */}
          <FounderSection />

          <VisionMissionSection />

          {/* Pillars */}
          <section className="mx-auto max-w-[90vw] py-16">
            <Reveal>
              <h2 className="font-manrope mb-2.5 mt-3.5 text-center text-3xl font-medium text-[#2a2a6b] md:text-4xl">
                The Four Pillars of Craftsmanship
              </h2>
              <p className="mx-auto mb-10 max-w-md text-center text-[13px]">
                Every {COMPANY} carpet is built on four principles: quality,
                design freedom, durability and sustainability.
              </p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((p, i) => (
                <Reveal key={p.n} delay={i * 100} className="h-full">
                  <article className="flex h-full flex-col rounded-xl border border-[#dfe6ea] bg-[#e8eef1] px-5 py-6">
                    <span className="font-manrope mb-2.5 text-[#e8a21c]">
                      {p.n}
                    </span>
                    <h3 className="font-manrope mb-3 text-xl font-medium leading-tight text-[#2a2a6b]">
                      {p.title}
                    </h3>
                    <p className="flex-1 text-xs">{p.text}</p>
                    <div className="mt-5 rounded-r-md border-l-2 border-[#e8a21c] bg-[#f4f9fc] px-3 py-2">
                      <small className="block text-[8px] font-semibold tracking-[0.14em] text-[#e8a21c]">
                        {p.label}
                      </small>
                      <strong className="text-[11px] text-[#2a2a6b]">
                        {p.value}
                      </strong>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageFrame>
  );
}
