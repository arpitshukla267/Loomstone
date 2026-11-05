"use client";

import { useEffect, useRef, useState } from "react";
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
  /** Image URL (public folder se). Omit karne par icon panel fallback dikhega */
  media?: string;
  mediaAlt?: string;
}

export const defaultProcessSteps: ProcessStep[] = [
  {
    title: "Design Consultation",
    description:
      "Working closely with architects, designers and project teams, we translate creative visions into practical flooring solutions, balancing aesthetics, technical requirements and project objectives.",
    media: "/process/design-consultation.jpeg",
    mediaAlt: "Design consultation with architects and project teams",
  },
  {
    title: "Bespoke Design Development",
    description:
      "From patterns and colours to textures and materials, we develop bespoke flooring solutions that bring each project's architectural vision to life.",
    media: "/process/design-development.webp",
    mediaAlt: "Bespoke flooring design development",
  },
  {
    title: "Sampling & Prototyping",
    description:
      "Detailed samples and prototypes bring designs to life, allowing materials, colours and finishes to be evaluated and refined before production.",
    media: "/process/sampling-prototyping.webp",
    mediaAlt: "Flooring samples and prototypes under review",
  },
  {
    title: "Technical Planning & Specification",
    description:
      "We align design intent with material suitability, durability, performance requirements and project budgets to support informed decisions.",
    media: "/process/technical-planning.webp",
    mediaAlt: "Technical planning and specification of flooring",
  },
  {
    title: "Production & Quality Assurance",
    description:
      "Through careful coordination and quality checks, we focus on consistency, craftsmanship and adherence to agreed project specifications.",
    media: "/process/production-quality.webp",
    mediaAlt: "Flooring production and quality inspection",
  },
  {
    title: "Installation & Project Support",
    description:
      "From delivery coordination to installation guidance, we provide project support to help achieve a seamless finish and lasting performance.",
    media: "/process/installation-support.webp",
    mediaAlt: "Flooring installation and on-site project support",
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FETCH_TIMEOUT = 4000;

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
    <div
      ref={ref}
      className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12 3xl:gap-20 4xl:gap-24"
    >
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
            decoding="async"
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
        className={`flex flex-col items-start px-2 text-left ${
          mediaOnLeft ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <motion.h3
          variants={textItem}
          className="font-manrope text-[28px] font-normal leading-[1.2] text-navy sm:text-[34px] lg:text-[40px] 3xl:text-[48px] 4xl:text-[56px]"
        >
          {step.title}
        </motion.h3>

        <motion.p
          variants={textItem}
          className="mt-4 max-w-[620px] 3xl:max-w-[720px] text-[15px] leading-[1.75] text-cool sm:text-[17px] lg:text-[18px] 3xl:text-[20px] 4xl:text-[22px]"
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
  steps: propSteps,
  heading: propHeading,
  intro: propIntro,
  closingTitle = "Our Approach",
  closingText = "From luxury hospitality destinations and signature commercial developments to bespoke residential environments, Loomstone delivers flooring solutions that seamlessly unite design excellence, craftsmanship, technical precision, and enduring value.",
  firstMediaSide = "right",
}: ProcessSectionProps) {
  const [headingText, setHeadingText] = useState(
    propHeading || "From Vision to Exceptional Spaces"
  );
  const [introText, setIntroText] = useState(
    propIntro ||
      "At Loomstone, every exceptional space begins with a vision. From concept to completion, we bring together design expertise, technical precision and craftsmanship to create flooring solutions that define spaces.",
  );
  const [stepsList, setStepsList] = useState<ProcessStep[]>(
    propSteps || defaultProcessSteps
  );

  // Fetch dynamic process content from backend if not passed as props
  useEffect(() => {
    if (propSteps && propHeading && propIntro) return;
    if (!API_URL) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    fetch(`${API_URL}/api/process`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch process data");
        return res.json();
      })
      .then((data) => {
        if (!propHeading && data.heading) setHeadingText(data.heading);
        if (!propIntro && data.intro) setIntroText(data.intro);
        if (!propSteps && Array.isArray(data.steps) && data.steps.length > 0) {
          const sorted = [...data.steps].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
          );
          setStepsList(
            sorted.map((s) => ({
              title: s.title,
              description: s.description,
              media: s.media || undefined,
              mediaAlt: s.title,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [propSteps, propHeading, propIntro]);

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <MotionConfig reducedMotion="user">
      <section className="overflow-hidden bg-[#FFFCF4] mt-12 sm:mt-0" id="products">
        <div className="mx-auto max-w-[95vw] 3xl:max-w-[90vw] 4xl:max-w-[90vw] px-6 py-[20px] md:px-[5%] md:py-[50px] md:pb-[100px] 3xl:py-[80px] 3xl:pb-[140px]">
          {/* HEADER */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto mb-10 flex w-full flex-col items-center text-center md:mb-14"
          >
            <h2 className="mx-auto max-w-[900px] 3xl:max-w-[1100px] font-manrope text-[36px] font-normal leading-[1.15] text-navy sm:text-[46px] md:text-[clamp(42px,4.5vw,64px)] 3xl:text-[70px] 4xl:text-[80px]">
              {headingText}
            </h2>
            <p className="mx-auto mt-4 max-w-[760px] 3xl:max-w-[950px] text-[14px] leading-[1.8] text-cool sm:text-[16px] 3xl:text-[18px] 4xl:text-[20px]">
              {introText}
            </p>
          </motion.div>

          {/* ZIG-ZAG ROWS */}
          <div className="flex flex-col gap-8 md:gap-10 lg:gap-12 3xl:gap-16 4xl:gap-20">
            {stepsList.map((step, index) => {
              const firstOnLeft = firstMediaSide === "left";
              const mediaOnLeft = index % 2 === 0 ? firstOnLeft : !firstOnLeft;
              return (
                <ProcessRow
                  key={`${step.title}-${index}`}
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
