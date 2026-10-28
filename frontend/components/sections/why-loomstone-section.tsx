"use client";

import { motion, MotionConfig } from "framer-motion";
import {
  ClipboardCheck,
  Gem,
  Globe,
  Handshake,
  Layers,
  Palette,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/* Theme colours (from your design)                                    */
/* ------------------------------------------------------------------ */
const HEADING = "#151f28"; // "What Sets Loomstone Apart"
const ACCENT = "#ab7b4d"; // "Thoughtful Design. Tailored Solutions. Reliable Delivery."
const ICON = "#5b2a1d"; // icon stroke (deep brown)
const ICON_RING = "#d9c3b0"; // circle border around icons

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.15 } as const;

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const FEATURES: Feature[] = [
  {
    icon: Layers,
    title: "Flooring Expertise",
    text: "Axminster carpets & Rugs, Handcrafted carpets & Rugs, Textile flooring, Resilient Flooring",
  },
  {
    icon: Palette,
    title: "Design Collaboration",
    text: "Working with architects and designers to translate their creative vision into distinctive flooring concepts.",
  },
  {
    icon: Gem,
    title: "Bespoke Flooring Solutions",
    text: "Custom patterns, colours textures and specifications crafted to bring each project's unique design vision to life.",
  },
  {
    icon: Globe,
    title: "Global Manufacturing Partnerships",
    text: "Working with trusted manufacturing partners and specialist suppliers to deliver quality material, consistent standards & Bespoke flooring solutions.",
  },
  {
    icon: ClipboardCheck,
    title: "Technical Precision",
    text: "Meticulous attention to specification, accurate measurements, budget considration and project requirements ensuring flooring solutions that balance design intent, performance and practicality.",
  },
  {
    icon: Handshake,
    title: "End to End Project Support",
    text: "Coordinated support from design development to supply and installation, ensuring a seemless product journey from concept to completion .",
  },
];

function FeatureItem({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const row = Math.floor(index / 3);
  const col = index % 3;
  return (
    <motion.div
      className={
        "relative flex flex-col " +
        // Spacing only (the lines are separate absolutely-positioned bars
        // below, so they never touch each other).
        (index > 0 ? "pt-8 " : "") +
        (row === 0 ? "sm:pt-0 sm:pb-8 " : "") +
        (col > 0 ? "sm:pl-6 lg:pl-8" : "sm:pr-2")
      }
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.08, ease: EASE }}
    >
      {/* Horizontal line (3 separate lines on desktop: 1-4, 2-5, 3-6).
          On mobile it separates the stacked points. */}
      {index > 0 && (
        <span
          aria-hidden="true"
          className={
            "absolute top-0 left-0 right-0 h-px bg-[#eeeae4] " +
            (row === 0
              ? "sm:hidden"
              : col === 0
                ? "sm:left-0 sm:right-10"
                : "sm:left-10 sm:right-10")
          }
        />
      )}

      {/* Vertical line (4 separate lines on desktop: 1|2, 2|3, 4|5, 5|6) */}
      {col > 0 && (
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-0 top-6 hidden w-px bg-[#eeeae4] sm:block"
        />
      )}

      <span
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full border bg-white/40"
        style={{ borderColor: ICON_RING }}
      >
        <Icon size={22} strokeWidth={1.6} style={{ color: ICON }} />
      </span>

      <h3
        className="mb-0 mt-4 max-w-[170px] 3xl:max-w-[220px] text-[15px] 3xl:text-[17px] 4xl:text-[19px] font-semibold leading-[1.25]"
        style={{ color: HEADING }}
      >
        {feature.title}
      </h3>
      <p className="mb-0 mt-3 max-w-[240px] 3xl:max-w-[300px] text-[12.5px] 3xl:text-[14px] 4xl:text-[15px] leading-[1.5] text-[#808486]">
        {feature.text}
      </p>
    </motion.div>
  );
}

export interface WhyLoomstoneSectionProps {
  /** Put your left-side photo in /public and pass its path here. */
  image?: string;
  imageAlt?: string;
}

export function WhyLoomstoneSection({
  image = "/new-folder/why.jpg",
  imageAlt = "Loomstone luxury interior with textured flooring",
}: WhyLoomstoneSectionProps) {
  return (
    <MotionConfig reducedMotion="user">
      {/* 30 / 70 split. Image is full-bleed: touches the left edge of the screen. */}
      <section className="relative left-1/2 grid w-screen -translate-x-1/2 grid-cols-1 bg-[#fdfbf7] lg:grid-cols-[35%_65%] 3xl:grid-cols-[30%_70%]">
        {" "}
        {/* ================= IMAGE ================= */}
        <div className="relative h-[280px] sm:h-[380px] lg:h-auto lg:min-h-[640px] 3xl:min-h-[780px] 4xl:min-h-[900px]">
          <Image
            src="/new-folder/why.jpg"
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover"
            priority={false}
          />
        </div>
        {/* ================= CONTENT ================= */}
        <div className="flex items-center px-6 py-12 sm:px-10 md:px-14 lg:px-[6%] lg:py-20 xl:px-[7%] 3xl:px-[8%] 3xl:py-28 4xl:px-[10%] 4xl:py-32">
          <div className="mx-auto w-full max-w-[900px] 3xl:max-w-[1100px] 4xl:max-w-[1300px]">
            <motion.h2
              className="m-0 font-manrope text-[38px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-[46px] lg:text-[clamp(44px,3.9vw,58px)] 3xl:text-[64px] 4xl:text-[76px]"
              style={{ color: HEADING }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, ease: EASE }}
            >
              What Sets Loomstone Apart
            </motion.h2>

            <motion.p
              className="m-0 mt-2 font-manrope text-[20px] font-medium leading-[1.25] tracking-[-0.005em] sm:text-[26px] lg:text-[clamp(24px,2.3vw,34px)] 3xl:text-[38px] 4xl:text-[44px]"
              style={{ color: ACCENT }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              Thoughtful Design. Bespoke Craftmenship. Seemless Execution.
            </motion.p>

            {/* Feature grid: 3 columns x 2 rows */}
            <div className="mt-10 3xl:mt-14 4xl:mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0">
              {FEATURES.map((feature, i) => (
                <FeatureItem key={feature.title} feature={feature} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default WhyLoomstoneSection;
