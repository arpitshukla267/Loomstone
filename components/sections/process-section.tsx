"use client";

import { useRef } from "react";
import { motion, MotionConfig, useInView } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Droplets,
  Grid3x3,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import { SectionIntro } from "./section-intro";

export interface ProcessStep {
  title: string;
  description: string;
  phase: string;
  highlights?: string[];
}

export const defaultProcessSteps: ProcessStep[] = [
  {
    title: "Design & Color Choice",
    description: "Choose your size, colors, and yarn samples.",
    phase: "PHASE 1 · 10–18 WEEKS",
    highlights: ["Size & Shape", "Color Matching", "Yarn Samples"],
  },
  {
    title: "Spinning & Dyeing",
    description: "Natural wool hand-spun and dyed in small batches.",
    phase: "PHASE 2 · 10–18 WEEKS",
    highlights: ["Hand-Spun Wool", "Natural Dyes", "Small Batches"],
  },
  {
    title: "Loom Weaving",
    description: "Woven knot by knot on upright wooden looms.",
    phase: "PHASE 3 · 10–18 WEEKS",
    highlights: ["Wooden Looms", "Knot by Knot", "Master Weavers"],
  },
  {
    title: "Finishing & Delivery",
    description: "Washed, hand-trimmed, inspected, and delivered.",
    phase: "PHASE 4 · GLOBAL DELIVERY",
    highlights: ["Hand-Trimmed", "Quality Inspection", "Global Delivery"],
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

// The 4 points sit at evenly spaced fractions (0, 1/3, 2/3, 1) along the line.
// The line fills at a constant rate, so each node + card is timed to appear
// exactly when the fill reaches it.
const LINE_START_DELAY = 0.15; // seconds before the line starts filling
const LINE_DURATION = 1.8; // desktop horizontal line
const LINE_DURATION_MOBILE = 1.6; // mobile vertical line
const CARD_LAG = 0.15; // card appears slightly after its node

function pointDelay(index: number, total: number, lineDuration: number) {
  const progress = total > 1 ? index / (total - 1) : 0;
  return LINE_START_DELAY + lineDuration * progress;
}

export interface ProcessSectionProps {
  steps?: ProcessStep[];
  onOpenInquiry?: () => void;
}

export function ProcessSection({
  steps = defaultProcessSteps,
  onOpenInquiry,
}: ProcessSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={containerRef}
        className="bg-ash overflow-hidden"
        id="products"
      >
        <div className="mx-auto max-w-[1500px] px-6 py-[70px] md:px-[5%] md:py-[100px]">
          {/* ================= HEADER ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mb-16 flex w-full flex-col items-center text-center md:mb-20"
          >
            <h2 className="mx-auto max-w-[900px] font-manrope text-[36px] font-normal leading-[1.15] tracking-[-0.03em] text-navy sm:text-[46px] md:text-[clamp(42px,4.5vw,64px)]">
              How we make your custom rug
            </h2>

            <p className="mx-auto mt-4 max-w-[600px] text-[14px] leading-[1.8] text-cool sm:text-[16px]">
              From your first idea to the finished rug delivered to your space.
            </p>
          </motion.div>

          {/* ================= DESKTOP VIEW (horizontal progressive line) ================= */}
          <div className="relative hidden lg:block">
            {/* Track across column centers (12.5% to 87.5%) */}
            <div className="absolute left-[12.5%] right-[12.5%] top-7 -z-0 h-1 rounded-full bg-[#dbe1e5]">
              <motion.div
                className="h-full rounded-full bg-[#2A2967]"
                style={{ transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{
                  duration: LINE_DURATION,
                  delay: LINE_START_DELAY,
                  ease: "linear",
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-6">
              {steps.map((step, index) => {
                const Icon = getIconForStep(step.title, index);
                const nodeDelay = pointDelay(
                  index,
                  steps.length,
                  LINE_DURATION,
                );
                const cardDelay = nodeDelay + CARD_LAG;
                const number = String(index + 1).padStart(2, "0");

                return (
                  <div key={step.title} className="flex flex-col items-center">
                    {/* Node: pops in the instant the line reaches it */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{
                        duration: 0.45,
                        delay: nodeDelay,
                        ease: "backOut",
                      }}
                      className="relative z-10 mb-8 flex flex-col items-center"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white shadow-[0_8px_20px_rgba(42,41,103,0.25)] transition-transform duration-300 hover:scale-110">
                        <Icon
                          className="h-6 w-6 text-white"
                          strokeWidth={2.2}
                        />
                      </div>
                      <span className="mt-2 rounded-full bg-white px-2.5 py-0.5 font-mono text-[11px] font-bold text-navy">
                        STEP {number}
                      </span>
                    </motion.div>

                    {/* Card: rises in just after its node lights up */}
                    <motion.article
                      initial={{ opacity: 0, y: 35 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.55,
                        delay: cardDelay,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex h-full w-full flex-col justify-between rounded-xl border border-[#dbe1e5] bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_16px_30px_rgba(42,41,103,0.07)]"
                    >
                      <div>
                        <h3 className="mb-3 font-manrope text-[21px] font-normal leading-[1.3] text-navy">
                          {step.title}
                        </h3>
                        <p className="text-[13px] leading-[1.7] text-cool">
                          {step.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-[#dbe1e5] pt-4">
                        {step.highlights && step.highlights.length > 0 && (
                          <ul className="space-y-2">
                            {step.highlights.map((item) => (
                              <li
                                key={item}
                                className="flex items-center gap-2 text-[12.5px] font-medium text-cool"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.article>
                  </div>
                );
              })}
            </div>
          </div>
          {/* ================= MOBILE / TABLET VIEW (vertical progressive line) ================= */}
          <div className="relative block pl-12 sm:pl-16 lg:hidden">
            <div className="absolute bottom-8 left-[23px] top-6 -z-0 w-1 rounded-full bg-[#dbe1e5] sm:left-[27px]">
              <motion.div
                className="w-full rounded-full bg-[#2A2967]"
                style={{ transformOrigin: "top", height: "100%" }}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{
                  duration: LINE_DURATION_MOBILE,
                  delay: LINE_START_DELAY,
                  ease: "linear",
                }}
              />
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = getIconForStep(step.title, index);
                const nodeDelay = pointDelay(
                  index,
                  steps.length,
                  LINE_DURATION_MOBILE,
                );
                const cardDelay = nodeDelay + CARD_LAG;
                const number = String(index + 1).padStart(2, "0");

                return (
                  <div key={step.title} className="relative">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{
                        duration: 0.45,
                        delay: nodeDelay,
                        ease: "backOut",
                      }}
                      className="absolute -left-12 top-4 z-10 sm:-left-16"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-ash bg-navy text-white shadow-md sm:h-14 sm:w-14">
                        <Icon
                          className="h-5 w-5 sm:h-6 sm:w-6"
                          strokeWidth={2.2}
                        />
                      </div>
                    </motion.div>

                    <motion.article
                      initial={{ opacity: 0, x: 25 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: cardDelay,
                        ease: "easeOut",
                      }}
                      className="rounded-xl border border-[#dbe1e5] bg-white p-5 shadow-sm sm:p-6"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-full bg-ash px-2.5 py-0.5 font-mono text-[11px] font-bold text-navy">
                          STEP {number}
                        </span>
                      </div>

                      <h3 className="mb-2 font-manrope text-[19px] font-normal leading-[1.3] text-navy">
                        {step.title}
                      </h3>
                      <p className="text-[13px] leading-[1.7] text-cool">
                        {step.description}
                      </p>

                      <div className="mt-4 border-t border-[#dbe1e5] pt-3">
                        {step.highlights && step.highlights.length > 0 && (
                          <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {step.highlights.map((item) => (
                              <li
                                key={item}
                                className="flex items-center gap-1.5 text-[12px] font-medium text-cool"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.article>
                  </div>
                );
              })}
            </div>
          </div>
          {/* ================= CTA ================= */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay:
                pointDelay(steps.length - 1, steps.length, LINE_DURATION) + 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-[65px] flex flex-col justify-between gap-[35px] rounded-xl border-t-2 border-gold bg-navy p-[27px] text-white min-[721px]:flex-row min-[721px]:items-center min-[721px]:p-10"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[.13em] text-gold">
                ARCHITECTURAL ELEVATION REVIEW
              </span>
              <h2 className="my-2.5 font-manrope text-[30px] font-normal min-[721px]:text-[37px]">
                Have a room plan or drawing?
              </h2>
              <p className="max-w-[620px] text-[14px] leading-[1.7] text-[#e4e9ec]">
                Send us your room dimensions, floorplan, or photos. Our team
                will recommend the right rug size and weave within 24 hours.
              </p>
            </div>
            <button
              type="button"
              className="mt-[15px] inline-flex shrink-0 items-center justify-center gap-2 rounded-[8px] bg-gold px-6 py-3.5 text-xs font-bold uppercase tracking-[.1em] text-navy transition hover:bg-white min-[721px]:mt-0"
              onClick={onOpenInquiry}
            >
              Send Floorplan <ArrowUpRight size={16} />
            </button>
          </motion.div> */}
        </div>
      </section>
    </MotionConfig>
  );
}

export default ProcessSection;
