"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FadeImage } from "@/components/ui/reveal";

const COMPANY = "Loomstone";
const OWNER = "Pawan Yadav";
const founderImage = "/founder.jpeg";
const TAGLINE =
  "True craftsmanship lies in the details that turn spaces into experiences.";

const QUOTE = `We believe exceptional hospitality is shaped by thoughtful details. Flooring is more than a surface; it is a defining design element that enhances environments, enriches guest experiences, and contributes to the enduring identity of a space.`;

const QUOTE_WORDS = QUOTE.split(/\s+/);

/* Ek quote word: neeche se, slant banate hue aata hai */
function QuoteWord({
  word,
  index,
  total,
  progress,
  disabled,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  disabled: boolean;
}) {
  // words 0 se 0.75 progress ke beech ek-ek karke aate hain
  const start = (index / total) * 0.75;
  const end = Math.min(start + 0.25, 1);

  const y = useTransform(progress, [start, end], [40, 0]);
  const rotate = useTransform(progress, [start, end], [10, 0]);
  const skewX = useTransform(progress, [start, end], [-16, 0]);
  const opacity = useTransform(
    progress,
    [start, start + (end - start) * 0.6],
    [0, 1],
  );

  return (
    <motion.span
      className="inline-block"
      style={{
        transformOrigin: "0% 100%",
        ...(disabled ? {} : { y, rotate, skewX, opacity }),
      }}
    >
      {word}
    </motion.span>
  );
}

export default function FounderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  // Heading + image: section ke progress pe
  // 0 = section ka top viewport ke bottom pe, 1 = section ka center screen ke center pe
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  // Quote: jaise hi screen ke neeche se dikhna shuru ho, tab se start
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ["start 95%", "end 80%"],
  });

  // Heading + image: bottom se saath mein
  const headY = useTransform(scrollYProgress, [0, 0.6], [160, 0]);
  const headOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  const imgY = useTransform(scrollYProgress, [0, 0.6], [200, 0]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);

  // Quote mark, tagline, name: quote progress pe
  const quoteMarkOpacity = useTransform(quoteProgress, [0, 0.1], [0, 1]);
  const restY = useTransform(quoteProgress, [0.7, 1], [24, 0]);
  const restOpacity = useTransform(quoteProgress, [0.7, 1], [0, 1]);

  const restStyle = reduce ? undefined : { y: restY, opacity: restOpacity };

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#FFFCF4] py-12 sm:py-14 lg:py-[6vw] 3xl:py-[5vw]"
    >
      <motion.h2
        style={reduce ? undefined : { y: headY, opacity: headOpacity }}
        className="font-manrope mb-10 px-4 text-center text-[32px] font-bold leading-[1.1] tracking-[-0.02em] sm:mb-12 sm:text-[44px] lg:mb-[4vw] lg:text-[4vw] 3xl:text-[3.6vw]"
      >
        <span className="text-[#2a2a6b]">Meet Our</span>{" "}
        <span className="text-[#e8a21c]">Founder</span>
      </motion.h2>

      <div className="mx-auto grid max-w-[90vw] items-center gap-10 sm:max-w-[85vw] lg:max-w-[80vw] lg:grid-cols-[24vw_1fr] lg:gap-[6vw] 3xl:max-w-[76vw] 3xl:grid-cols-[22vw_1fr] 3xl:gap-[7vw]">
        {/* Left: Founder photo (neeche se aati hai) */}
        <motion.div
          style={reduce ? undefined : { y: imgY, opacity: imgOpacity }}
          className="mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:mx-0 lg:max-w-none"
        >
          <div className="relative h-[320px] w-full overflow-hidden rounded-[28px] border-[5px] border-white bg-[#2a2a6b] shadow-[0_16px_40px_rgba(42,42,107,0.25)] sm:h-[380px] sm:rounded-[36px] sm:border-[6px] lg:h-[27vw] 3xl:h-[25vw]">
            <FadeImage
              src={founderImage}
              alt={`${OWNER}, founder of ${COMPANY}`}
              fill
              sizes="(min-width: 1024px) 24vw, 380px"
              className="object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Right: Quote, tagline, name, designation */}
        <div ref={quoteRef} className="text-[#2a2a6b]">
          <motion.span
            aria-hidden
            style={reduce ? undefined : { opacity: quoteMarkOpacity }}
            className="font-manrope -ml-1 block h-10 text-[84px] font-bold leading-[0.9] text-[#e8a21c] sm:-ml-2 sm:h-14 sm:text-[120px] lg:h-[4vw] lg:text-[7vw]"
          >
            &ldquo;
          </motion.span>

          {/* Founder ke words: ek-ek karke slant banate hue */}
          <p className="font-manrope mt-4 max-w-none text-[14px] font-medium leading-[1.6] sm:mt-6 sm:text-[16px] md:text-[16px] lg:text-[1.3vw] 3xl:text-[1.2vw]">
            {QUOTE_WORDS.map((w, i) => (
              <span key={i}>
                <QuoteWord
                  word={w}
                  index={i}
                  total={QUOTE_WORDS.length}
                  progress={quoteProgress}
                  disabled={reduce}
                />
                {i < QUOTE_WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          <motion.p
            style={restStyle}
            className="font-manrope mt-5 text-[14px] font-bold leading-[1.6] sm:text-[16px] md:text-[19px] lg:mt-[1.8vw] lg:text-[1.3vw] 3xl:text-[1.2vw]"
          >
            {TAGLINE}
          </motion.p>

          <motion.div
            style={restStyle}
            className="my-6 h-[2px] w-20 bg-[#e8a21c] sm:my-8 sm:w-24 lg:my-[2vw] lg:w-[6vw]"
          />

          <motion.div style={restStyle}>
            <h3 className="font-manrope text-[20px] font-bold leading-tight sm:text-[22px] lg:text-[1.6vw]">
              Mr. {OWNER}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#e8a21c] sm:text-sm lg:text-[0.9vw]">
              Founder &amp; Owner, {COMPANY}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
