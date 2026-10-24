"use client";

import { useRef } from "react";
import { motion, MotionConfig, useInView, type Variants } from "framer-motion";
import {
  ClipboardCheck,
  Compass,
  Layers,
  PenTool,
  Ruler,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface ProcessStep {
  /** Main heading (client's point), e.g. "Design Consultation" */
  title: string;
  description: string;
  /** Optional image URL. Falls back to an icon panel when omitted */
  media?: string;
  mediaAlt?: string;
}

export const defaultProcessSteps: ProcessStep[] = [
  {
    title: "Design Consultation",
    description:
      "Every project begins with a deep understanding of the design narrative. Working closely with architects, interior designers, developers, and stakeholders, we align creative intent, operational requirements, technical specifications, and project objectives to establish a foundation for exceptional outcomes.",
  },
  {
    title: "Bespoke Design Development",
    description:
      "Drawing inspiration from the project’s vision, we develop custom flooring concepts tailored in pattern, texture, colour, material, and scale. Every design is thoughtfully curated to complement the architectural language and enhance the overall spatial experience.",
  },
  {
    title: "Sampling & Prototyping",
    description:
      "Through detailed samples and bespoke prototypes, concepts are translated into tangible experiences. This process allows every element to be reviewed, refined, and perfected, ensuring complete confidence before production begins.",
  },
  {
    title: "Technical & Value Engineering",
    description:
      "Our expertise ensures that aesthetic aspirations are seamlessly balanced with durability, functionality, specification requirements, and commercial considerations. The result is a flooring solution that delivers both visual impact and long-term performance without compromise.",
  },
  {
    title: "Production & Project Coordination",
    description:
      "We oversee every stage of production, quality assurance, logistics, and project coordination. Our disciplined approach ensures exceptional craftsmanship, consistency, and reliable delivery at every stage.",
  },
  {
    title: "Installation & Continued Support",
    description:
      "Our commitment extends beyond delivery. From installation guidance and site coordination to ongoing support, we remain an engaged partner throughout the lifecycle of the project, ensuring enduring quality, performance, and client satisfaction.",
  },
];

const STEP_ICONS: LucideIcon[] = [
  Compass,
  PenTool,
  Layers,
  Ruler,
  ClipboardCheck,
  Wrench,
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Single row                                                          */
/* ------------------------------------------------------------------ */

interface ProcessRowProps {
  step: ProcessStep;
  index: number;
  mediaOnLeft: boolean;
}

function ProcessRow({ step, index, mediaOnLeft }: ProcessRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const Icon = STEP_ICONS[index % STEP_ICONS.length];
  const dir = mediaOnLeft ? -1 : 1;

  const mediaVariants: Variants = {
    hidden: { opacity: 0, x: 60 * dir },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
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
    <div ref={ref} className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
      {/* MEDIA */}
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

      {/* CONTENT: heading + description only */}
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
          className="mt-4 max-w-[620px] text-[15px] leading-[1.75] text-cool sm:text-[17px] lg:text-[18px]"
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
  heading?: string;
  intro?: string;
  closingTitle?: string;
  closingText?: string;
  /** Which side the media sits on for the FIRST row (desktop). */
  firstMediaSide?: "left" | "right";
}

export function ProcessSection({
  steps = defaultProcessSteps,
  heading = "From Vision to Exceptional Spaces",
  intro = "At Loomstone, we believe exceptional flooring begins with a clear vision and is realised through meticulous execution. Combining design intelligence, technical expertise, and project management excellence, we guide each project through a seamless journey, transforming concepts into distinctive flooring experiences that elevate the character, performance, and identity of a space.",
  closingTitle = "Our Approach",
  closingText = "From luxury hospitality destinations and signature commercial developments to bespoke residential environments, Loomstone delivers flooring solutions that seamlessly unite design excellence, craftsmanship, technical precision, and enduring value.",
  firstMediaSide = "right",
}: ProcessSectionProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  const closingRef = useRef<HTMLDivElement>(null);
  const closingInView = useInView(closingRef, { once: true, amount: 0.5 });

  return (
    <MotionConfig reducedMotion="user">
      <section className="overflow-hidden bg-[#FFFCF4] ash" id="products">
        <div className="mx-auto max-w-[85vw] px-6 py-[20px] md:px-[5%] md:py-[50px] md:pb-[100px]">
          {/* HEADER */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto mb-10 flex w-full flex-col items-center text-center md:mb-14"
          >
            <h2 className="mx-auto max-w-[900px] font-manrope text-[36px] font-normal leading-[1.15] text-navy sm:text-[46px] md:text-[clamp(42px,4.5vw,64px)]">
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-[760px] text-[14px] leading-[1.8] text-cool sm:text-[16px]">
              {intro}
            </p>
          </motion.div>

          {/* ZIG-ZAG ROWS */}
          <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
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

          {/* CLOSING: heading + description */}
          <motion.div
            ref={closingRef}
            initial={{ opacity: 0, y: 20 }}
            animate={closingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto mt-16 flex max-w-[760px] flex-col items-center text-center md:mt-24"
          >
            <h2 className="font-manrope text-[32px] font-normal leading-[1.15] text-navy sm:text-[40px] md:text-[48px]">
              {closingTitle}
            </h2>
            <p className="mt-4 font-manrope text-[18px] font-normal leading-[1.7] text-navy sm:text-[22px]">
              {closingText}
            </p>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default ProcessSection;
