"use client";

import { useEffect, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { FadeImage } from "@/components/ui/reveal";

// Tagline font.
const taglineFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  display: "swap",
});

const DEFAULT_COMPANY = "Loomstone";
const DEFAULT_OWNER = "Pawan Yadav";
const DEFAULT_FOUNDER_IMAGE = "/founder.webp";
const DEFAULT_TAGLINE = "Perfection is the foundation beneath every great space.";
const DEFAULT_QUOTE = `We believe exceptional hospitality is shaped by thoughtful details. Flooring is more than a surface; it is a defining design element that enhances environments, enriches guest experiences, and contributes to the enduring identity of a space.`;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FETCH_TIMEOUT = 4000;

const ICON_DELAY = 0;
const TAG_BASE = 0.2;
const TAG_STEP = 0.2;
const TAG_DUR = 0.45;

const EASE = [0.22, 1, 0.36, 1] as const;

const CLIP_HIDDEN = "inset(-30% 115% -40% -15%)";
const CLIP_SHOWN = "inset(-30% -15% -40% -15%)";

/* Tagline word */
function TaglineWord({
  word,
  index,
  show,
  disabled,
}: {
  word: string;
  index: number;
  show: boolean;
  disabled: boolean;
}) {
  return (
    <motion.span
      className="inline-block"
      initial={disabled ? false : { clipPath: CLIP_HIDDEN }}
      animate={
        disabled ? undefined : { clipPath: show ? CLIP_SHOWN : CLIP_HIDDEN }
      }
      transition={{
        duration: TAG_DUR,
        delay: TAG_BASE + index * TAG_STEP,
        ease: "easeInOut",
      }}
    >
      {word}
    </motion.span>
  );
}

export default function FounderSection() {
  const quoteRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;

  const [sectionTitle, setSectionTitle] = useState("Meet Our Visionary");
  const [founderName, setFounderName] = useState(DEFAULT_OWNER);
  const [designation, setDesignation] = useState(`Managing Partner`);
  const [tagline, setTagline] = useState(DEFAULT_TAGLINE);
  const [quote, setQuote] = useState(DEFAULT_QUOTE);
  const [image, setImage] = useState(DEFAULT_FOUNDER_IMAGE);

  // Fetch from backend
  useEffect(() => {
    if (!API_URL) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    fetch(`${API_URL}/api/founder`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch founder info");
        return res.json();
      })
      .then((data) => {
        if (data.sectionTitle) setSectionTitle(data.sectionTitle);
        if (data.founderName) setFounderName(data.founderName);
        if (data.designation) setDesignation(data.designation);
        if (data.tagline) setTagline(data.tagline);
        if (data.quote) setQuote(data.quote);
        if (data.image) setImage(data.image);
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  const taglineWords = tagline.split(/\s+/);
  const quoteBase = TAG_BASE + (taglineWords.length - 1) * TAG_STEP;
  const restBase = quoteBase + 0.25;

  // Right column in-view
  const show = useInView(quoteRef, { once: true, amount: 0.25 });

  const fadeUp = (y: number, delay = 0) =>
    reduce
      ? {}
      : {
          initial: { y, opacity: 0 },
          whileInView: { y: 0, opacity: 1 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  const revealAfter = (delay: number, y = 20) =>
    reduce
      ? {}
      : {
          initial: { y, opacity: 0 },
          animate: show ? { y: 0, opacity: 1 } : { y, opacity: 0 },
          transition: { duration: 0.6, delay, ease: EASE },
        };

  // Split title if it has spaces, e.g. "Meet Our" and "Visionary"
  const titleParts = sectionTitle.split(" ");
  const titlePrefix = titleParts.slice(0, -1).join(" ") || "Meet Our";
  const titleHighlight = titleParts[titleParts.length - 1] || "Visionary";

  return (
    <section className="overflow-hidden bg-[#FFFCF4] py-12 sm:py-14 lg:py-[6vw] 3xl:py-[5vw]">
      <motion.h2
        {...fadeUp(60)}
        className="font-manrope mb-10 px-4 text-center text-[32px] font-bold leading-[1.1] tracking-[-0.02em] sm:mb-12 sm:text-[44px] lg:mb-[4vw] lg:text-[4vw] 3xl:text-[3.6vw]"
      >
        <span className="text-[#2a2a6b]">{titlePrefix}</span>{" "}
        <span className="text-[#e8a21c]">{titleHighlight}</span>
      </motion.h2>

      <div className="mx-auto grid max-w-[90vw] items-center gap-10 sm:max-w-[85vw] lg:max-w-[80vw] lg:grid-cols-[24vw_1fr] lg:gap-[6vw] 3xl:max-w-[76vw] 3xl:grid-cols-[22vw_1fr] 3xl:gap-[7vw]">
        {/* Left: Founder photo */}
        <motion.div
          {...fadeUp(80, 0.15)}
          className="mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:mx-0 lg:max-w-none"
        >
          <div className="relative h-[320px] w-full overflow-hidden rounded-[28px] border-[5px] border-white bg-[#2a2a6b] shadow-[0_16px_40px_rgba(42,42,107,0.25)] sm:h-[380px] sm:rounded-[36px] sm:border-[6px] lg:h-[27vw] 3xl:h-[25vw]">
            <FadeImage
              src={image}
              alt={`${founderName}, ${designation}`}
              fill
              priority
              sizes="(min-width: 1024px) 24vw, 380px"
              className="object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Right: icon -> tagline -> quote -> divider -> name & designation */}
        <div ref={quoteRef} className="text-[#2a2a6b]">
          {/* 1. Quote icon */}
          <motion.span
            aria-hidden
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.8 },
                  animate: show
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 },
                  transition: { duration: 0.5, delay: ICON_DELAY, ease: EASE },
                })}
            style={{ transformOrigin: "0% 100%" }}
            className="font-manrope -ml-1 block h-10 text-[84px] font-bold leading-[0.9] text-[#e8a21c] sm:-ml-2 sm:h-14 sm:text-[120px] lg:h-[4vw] lg:text-[7vw]"
          >
            &ldquo;
          </motion.span>

          {/* 2. Tagline: likhte hue reveal */}
          <p
            className={`${taglineFont.className} mt-4 text-[26px] font-semibold leading-[1.3] sm:mt-6 sm:text-[32px] lg:mt-[1.2vw] lg:text-[2.4vw] 3xl:text-[2.1vw]`}
          >
            {taglineWords.map((w, i) => (
              <span key={`${w}-${i}`}>
                <TaglineWord word={w} index={i} show={show} disabled={reduce} />
                {i < taglineWords.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          {/* 3. Founder quote: simple fade-up */}
          <motion.p
            {...revealAfter(quoteBase)}
            className="font-manrope mt-5 max-w-none text-[14px] font-medium leading-[1.6] sm:mt-6 sm:text-[16px] md:text-[16px] lg:mt-[1.6vw] lg:text-[1.3vw] 3xl:text-[1.2vw]"
          >
            {quote}
          </motion.p>

          {/* 4. Divider */}
          <motion.div
            {...revealAfter(restBase)}
            className="my-6 h-[2px] w-20 bg-[#e8a21c] sm:my-8 sm:w-24 lg:my-[2vw] lg:w-[6vw]"
          />

          {/* 5. Name + designation */}
          <motion.div {...revealAfter(restBase + 0.1)}>
            <h3 className="font-manrope text-[16px] font-bold leading-tight sm:text-[17px] lg:text-[1.3vw] 3xl:text-[1.4vw]">
              {founderName.startsWith("Mr.") ? founderName : `Mr. ${founderName}`}
            </h3>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[#e8a21c] sm:text-sm lg:text-[0.9vw]">
              {designation}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
