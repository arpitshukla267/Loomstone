"use client";

import { useRef } from "react";
import { motion, MotionConfig, useInView, type Variants } from "framer-motion";
import {
  Compass,
  Droplets,
  Grid3x3,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";

export interface ProcessStep {
  title: string;
  description: string;
  phase: string;
  highlights?: string[];
  /** GIF / video-like image URL (e.g. "/process/spinning.gif") */
  media?: string;
  mediaAlt?: string;
}

export const defaultProcessSteps: ProcessStep[] = [
  {
    title: "Design & Color Choice",
    description: "Choose your size, colors, and yarn samples.",
    phase: "PHASE 1 · 10–18 WEEKS",
    highlights: ["Size & Shape", "Color Matching", "Yarn Samples"],
    media: "/process/design.gif",
    mediaAlt: "Choosing rug design and colors",
  },
  {
    title: "Spinning & Dyeing",
    description: "Natural wool hand-spun and dyed in small batches.",
    phase: "PHASE 2 · 10–18 WEEKS",
    highlights: ["Hand-Spun Wool", "Natural Dyes", "Small Batches"],
    media: "/process/dyeing.gif",
    mediaAlt: "Wool yarn being spun and dyed",
  },
  {
    title: "Loom Weaving",
    description: "Woven knot by knot on upright wooden looms.",
    phase: "PHASE 3 · 10–18 WEEKS",
    highlights: ["Wooden Looms", "Knot by Knot", "Master Weavers"],
    media: "/process/weaving.gif",
    mediaAlt: "Artisan weaving a rug on a loom",
  },
  {
    title: "Finishing & Delivery",
    description: "Washed, hand-trimmed, inspected, and delivered.",
    phase: "PHASE 4 · GLOBAL DELIVERY",
    highlights: ["Hand-Trimmed", "Quality Inspection", "Global Delivery"],
    media: "/process/finishing.gif",
    mediaAlt: "Finishing and packing the rug",
  },
];

const STEP_ICONS: LucideIcon[] = [Compass, Droplets, Grid3x3, PackageCheck];

function getIconForStep(title: string, index: number): LucideIcon {
  const lower = title.toLowerCase();
  if (lower.includes("design")) return Compass;
  if (lower.includes("dye") || lower.includes("spin")) return Droplets;
  if (lower.includes("loom") || lower.includes("weav")) return Grid3x3;
  if (lower.includes("deliver") || lower.includes("finish"))
    return PackageCheck;
  return STEP_ICONS[index % STEP_ICONS.length];
}

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Single row                                                          */
/* ------------------------------------------------------------------ */

interface ProcessRowProps {
  step: ProcessStep;
  index: number;
  /** true → GIF on the left column, content on the right (desktop) */
  mediaOnLeft: boolean;
}

function ProcessRow({ step, index, mediaOnLeft }: ProcessRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Each row triggers on its own when it scrolls into view
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const Icon = getIconForStep(step.title, index);
  // Slide in from the outer edge of its own column
  const dir = mediaOnLeft ? -1 : 1;

  const mediaVariants: Variants = {
    hidden: { opacity: 0, x: 60 * dir },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.9, ease: EASE },
    },
  };

  const imageVariants: Variants = {
    hidden: { scale: 1.18 },
    show: { scale: 1, transition: { duration: 1.4, ease: EASE } },
  };

  const textContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
  };

  const textItem: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <div ref={ref} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {/* ---------- MEDIA ---------- */}
      <motion.div
        variants={mediaVariants}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className={`relative aspect-[16/10] w-full overflow-hidden rounded-none bg-[#dbe1e5] ${
          mediaOnLeft ? "lg:order-1" : "lg:order-2"
        }`}
      >
        {step.media ? (
          <motion.img
            variants={imageVariants}
            src={step.media}
            alt={step.mediaAlt ?? step.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <motion.div
            variants={imageVariants}
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy to-[#2A2967]"
          >
            <Icon className="h-16 w-16 text-white/80" strokeWidth={1.5} />
          </motion.div>
        )}
      </motion.div>

      {/* ---------- CONTENT ---------- */}
      <motion.div
        variants={textContainer}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className={`flex flex-col items-center px-2 text-center ${
          mediaOnLeft ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <motion.h3
          variants={textItem}
          className="font-manrope text-[28px] font-normal leading-[1.2] text-navy sm:text-[34px] lg:text-[40px]"
        >
          {step.title}
        </motion.h3>

        <motion.p
          variants={textItem}
          className="mt-5 max-w-[620px] text-[16px] leading-[1.8] text-cool sm:text-[18px] lg:text-[20px]"
        >
          {step.description}
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export interface ProcessSectionProps {
  steps?: ProcessStep[];
  /**
   * Which side the GIF sits on for the FIRST row (desktop).
   * "right" → row 1: content left / GIF right, row 2: GIF left / content right…
   * "left"  → row 1: GIF left / content right (exactly like the reference image)
   */
  firstMediaSide?: "left" | "right";
  onOpenInquiry?: () => void;
}

export function ProcessSection({
  steps = defaultProcessSteps,
  firstMediaSide = "right",
}: ProcessSectionProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <MotionConfig reducedMotion="user">
      <section className="overflow-hidden bg-ash" id="products">
        <div className="mx-auto max-w-[85vw] px-6 py-[70px] md:px-[5%] md:py-[100px]">
          {/* ================= HEADER ================= */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto mb-14 flex w-full flex-col items-center text-center md:mb-20"
          >
            <h2 className="mx-auto max-w-[900px] font-manrope text-[36px] font-normal leading-[1.15] text-navy sm:text-[46px] md:text-[clamp(42px,4.5vw,64px)]">
              How we make your custom rug
            </h2>
            <p className="mx-auto mt-4 max-w-[600px] text-[14px] leading-[1.8] text-cool sm:text-[16px]">
              From your first idea to the finished rug delivered to your space.
            </p>
          </motion.div>

          {/* ================= ZIG-ZAG ROWS ================= */}
          <div className="flex flex-col gap-14 md:gap-20 lg:gap-24">
            {steps.map((step, index) => {
              const firstOnLeft = firstMediaSide === "left";
              const mediaOnLeft = index % 2 === 0 ? firstOnLeft : !firstOnLeft;
              return (
                <ProcessRow
                  key={step.title}
                  step={step}
                  index={index}
                  mediaOnLeft={mediaOnLeft}
                />
              );
            })}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default ProcessSection;
