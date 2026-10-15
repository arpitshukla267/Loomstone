"use client";

import { useRef } from "react";
import { motion, MotionConfig, useInView } from "framer-motion";
import { WorldMap, defaultDestinations, type Destination } from "../ui/world-map";
import { SectionIntro } from "./section-intro";

const EASE = [0.22, 1, 0.36, 1] as const;

export { defaultDestinations };

export interface GlobalReachSectionProps {
  title?: string;
  description?: string;
  destinations?: Destination[];
}

export function GlobalReachSection({
  destinations = defaultDestinations,
}: GlobalReachSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <MotionConfig reducedMotion="user">
      <section className="overflow-hidden bg-ash" id="global-reach">
        <div
          ref={ref}
          className="mx-auto max-w-[90vw] px-0 py-[20px] md:px-[5%] md:py-[100px]"
        >
          {/* ================= HEADER ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative z-10 mx-auto flex w-full flex-col items-center text-center"
          >
            <SectionIntro
              eyebrow="Artisanal Categories"
              title="Delivered across the world"
              text="From our looms in India, every rug travels to homes, hotels, and studios across continents, handled with the same care from first knot to final doorstep."
            />
          </motion.div>

          {/* ================= MAP ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            // Negative top margin pulls the map up *behind* the heading,
            // so the faded land surrounds the title like a background.
            className="relative z-0 mx-auto w-full md:mt-4"
          >
            <WorldMap destinations={destinations} />
          </motion.div>

          {/* ================= MOBILE LIST ================= */}
          {/* <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
            className="mt-8 flex flex-wrap justify-center gap-2 md:hidden"
          >
            {destinations.map((d) => (
              <li
                key={d.name}
                className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-navy shadow-sm"
              >
                {d.name}
              </li>
            ))}
          </motion.ul> */}
        </div>
      </section>
    </MotionConfig>
  );
}

export default GlobalReachSection;
