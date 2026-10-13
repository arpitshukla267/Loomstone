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
      <div
        className="font-poppins min-h-screen overflow-x-hidden bg-[#f4f9fc] text-[15px] leading-relaxed text-slate-600 pt-20"
      >
        <main>
          {/* Hero */}
          <section className="mx-auto grid max-w-[85vw] items-start gap-12 pb-12 pt-12 lg:grid-cols-[1fr_300px] lg:pt-[72px]">
            <div>
              <Reveal>
                <Eyebrow line>
                  ABOUT {COMPANY.toUpperCase()}{" "}
                  {SINCE ? `• FOUNDED IN ${SINCE}` : ""}
                </Eyebrow>
              </Reveal>
              <Reveal delay={100}>
                <h1
                  className="font-manrope font-semibold mb-6 mt-5 text-[40px] leading-[1.1] text-[#2a2a6b] md:text-6xl"
                >
                  The Art of{" "}
                  <em className="block font-semibold text-[#e8a21c]">
                    Woven Carpets
                  </em>
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="max-w-lg">
                  {COMPANY} brings together timeless carpet-weaving tradition
                  and modern innovation. We create luxurious, durable and fully
                  customizable carpets for homes, hotels and commercial spaces.
                </p>
              </Reveal>
            </div>
            {/* <Reveal delay={150}>
              <aside className="rounded-r-xl border-l-[3px] border-[#e8a21c] bg-[#e8eef1] px-5 py-[18px]">
                <Eyebrow>WHAT WE DO</Eyebrow>
                <p className="mb-[18px] mt-2.5 text-xs text-[#2a2a6b]">
                  Axminster Carpets • Bespoke Designs • Hospitality &amp;
                  Residential Interiors
                </p>
                <div className="flex justify-between border-t border-[#dfe6ea] pt-3 text-[11px]">
                  <strong className="text-[10px] tracking-widest text-[#2a2a6b]">
                    EST. 1984
                  </strong>
                  <span>{COMPANY}</span>
                </div>
              </aside>
            </Reveal> */}
          </section>

          {/* Feature */}
          {/* <section className="mx-auto grid max-w-[85vw] items-center pb-16 lg:grid-cols-[1.35fr_1fr]">
            <Reveal>
              <div className="relative h-full min-h-[580px] w-full overflow-hidden rounded-xl">
                <Image
                  src={carpetImage}
                  alt={`${COMPANY} carpet in an elegant interior`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 90vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal
              delay={150}
              className="relative z-10 mx-3 -mt-6 lg:-ml-6 lg:mr-0 lg:mt-0"
            >
              <div className="rounded-xl border-t-[3px] border-[#e8a21c] bg-white p-8 shadow-[0_12px_32px_rgba(42,42,107,0.08)]">
                <Eyebrow>EVERY SPACE, ELEVATED</Eyebrow>
                <h2
                  className="font-manrope mb-3.5 mt-3.5 text-[26px] font-medium leading-tight text-[#2a2a6b]"
                >
                  Carpets Designed as the Foundation of Every Room
                </h2>
                <p className="text-sm">
                  Axminster carpets are woven with rich textures and intricate
                  designs. Each one is crafted by weaving individual tufts of a
                  wool and nylon blend through a backing, giving you patterns
                  that stay beautiful and a finish that lasts for decades.
                </p>
                <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold tracking-widest text-[#2a2a6b]">
                  <Check size={15} className="text-[#e8a21c]" /> WOOL / NYLON
                  BLEND CONSTRUCTION
                </div>
              </div>
            </Reveal>
          </section> */}
          <OurStorySection />

          {/* ================= Founder ================= */}
          <FounderSection />

          {/* Vision & Mission */}
          {/* <section className="bg-[#e8eef1]">
            <div className="mx-auto max-w-[90vw] py-16">
              <Reveal>
                <div className="mb-7">
                  <Eyebrow line>PURPOSE &amp; DIRECTION</Eyebrow>
                </div>
              </Reveal>
              <div className="grid items-stretch gap-7 md:grid-cols-2">
                {[
                  {
                    icon: Eye,
                    tag: "OUR OUTLOOK",
                    title: "Our Vision",
                    text: "To be the most trusted name in custom carpets, bringing luxury, comfort and lasting design to every space.",
                    points: visionPoints,
                    foot: "PILLAR I • LONGEVITY",
                    border: "border-[#2a2a6b]",
                    iconColor: "text-[#2a2a6b]",
                  },
                  {
                    icon: Hammer,
                    tag: "OUR PROMISE",
                    title: "Our Mission",
                    text: "To create durable, beautiful and sustainable carpets tailored to every client’s interiors.",
                    points: missionPoints,
                    foot: "PILLAR II • DESIGN & RESPONSIBILITY",
                    border: "border-[#e8a21c]",
                    iconColor: "text-[#e8a21c]",
                  },
                ].map(
                  (
                    {
                      icon: Icon,
                      tag,
                      title,
                      text,
                      points,
                      foot,
                      border,
                      iconColor,
                    },
                    i,
                  ) => (
                    <Reveal key={title} delay={i * 120} className="h-full">
                      <article
                        className={`flex h-full flex-col rounded-xl border border-t-[3px] bg-white p-8 md:p-10 ${border}`}
                      >
                        <span
                          className={`mb-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#e8eef1] ${iconColor}`}
                        >
                          <Icon size={18} />
                        </span>
                        <Eyebrow>{tag}</Eyebrow>
                        <h3
                          className="font-manrope mb-4 mt-3 text-[28px] font-medium leading-tight text-[#2a2a6b]"
                        >
                          {title}
                        </h3>
                        <p className="text-base leading-relaxed">{text}</p>
                        <ul className="mb-8 mt-6 flex-1 space-y-3">
                          {points.map((t) => (
                            <li
                              key={t}
                              className="flex items-start gap-2.5 text-[13px]"
                            >
                              <Check
                                size={14}
                                className="mt-[3px] shrink-0 text-[#e8a21c]"
                              />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                        <footer className="border-t border-[#dfe6ea] pt-4 text-[10px] font-semibold tracking-[0.14em] text-[#e8a21c]">
                          {foot}
                        </footer>
                      </article>
                    </Reveal>
                  ),
                )}
              </div>
            </div>
          </section> */}
          <VisionMissionSection />

          {/* Pillars */}
          <section className="mx-auto max-w-[90vw] py-16">
            <Reveal>
              <Eyebrow center>WHAT SETS US APART</Eyebrow>
              <h2
                className="font-manrope mb-2.5 mt-3.5 text-center text-3xl font-medium text-[#2a2a6b] md:text-4xl"
              >
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
                    <span
                      className="font-manrope mb-2.5 text-[#e8a21c]"
                    >
                      {p.n}
                    </span>
                    <h3
                      className="font-manrope mb-3 text-xl font-medium leading-tight text-[#2a2a6b]"
                    >
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
