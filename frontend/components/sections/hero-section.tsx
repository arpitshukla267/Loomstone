"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { preloadImage } from "@/lib/asset-preloader";

interface MetricProps {
  number: string;
  title: string;
  detail: string;
}

export function Metric({ number, title, detail }: MetricProps) {
  return (
    <div className="flex items-center gap-3.5 py-1 md:py-[5px] px-0 md:px-[22px] 3xl:px-8 border-b md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 border-line">
      <span className="text-gold font-manrope italic font-semibold text-[26px] 3xl:text-[32px] 4xl:text-[36px]">
        {number}
      </span>
      <div>
        <b className="block text-navy text-[10px] tracking-[.1em] uppercase font-bold">
          {title}
        </b>
        <small className="block mt-1 text-[#8a9298] text-[11px]">
          {detail}
        </small>
      </div>
    </div>
  );
}

export interface HeroSlide {
  image: string;
  heading: React.ReactNode;
  description: string;
  primaryText?: string;
  secondaryText?: string;
}

export interface HeroSectionProps {
  onOpenInquiry?: () => void;
  /**
   * @deprecated Ab use nahi hota. Slides ki images array se hi aati hain.
   * Sirf isliye rakha hai taaki parent me `heroImage={...}` pass ho to TS error na aaye.
   */
  heroImage?: string;
  slides?: HeroSlide[];
}

// Backend se jo data aata hai uska shape
interface HeroSectionApiItem {
  _id: string;
  image: string;
  heading: string;
  description: string;
  primaryText?: string;
  secondaryText?: string;
}

const SLIDE_DURATION = 5000;
const FETCH_TIMEOUT = 4000; // 4 sec mein backend na bole to fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ---------- Backend integration ---------- */

// "Handmade rugs for *beautiful* spaces." -> JSX (gold word + line breaks)
function renderHeading(text: string): React.ReactNode {
  return text.split("\n").map((line, lineIndex, lines) => (
    <span key={lineIndex}>
      {line
        .split(/(\*[^*]+\*)/g)
        .filter(Boolean)
        .map((part, i) =>
          part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
            <em key={i} className="text-gold not-italic">
              {part.slice(1, -1)}
            </em>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      {lineIndex < lines.length - 1 && <br />}
    </span>
  ));
}

async function fetchHeroSlides(signal: AbortSignal): Promise<HeroSlide[]> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL set nahi hai");

  const res = await fetch(`${API_URL}/api/hero-section`, { signal });
  if (!res.ok) throw new Error(`Backend error: ${res.status}`);

  const data: HeroSectionApiItem[] = await res.json();

  return data.map((item) => ({
    image: item.image,
    heading: renderHeading(item.heading),
    description: item.description,
    primaryText: item.primaryText,
    secondaryText: item.secondaryText,
  }));
}

/* ---------- Fallback (hardcoded) slides: buttons nahi ---------- */

const defaultSlides: HeroSlide[] = [
  {
    image: "/hero-backup/axminster-2.webp",
    heading: (
      <>
        Bespoke Fashionable Flooring{" "}
        <em className="text-gold not-italic"> </em>
      </>
    ),
    description:
      "Crafted for exceptional interiors, Designed around your vision.",
  },
  {
    image: "/hero-backup/handmade.webp",
    heading: (
      <>
        Beyond Flooring, An Art of Living.{""}{" "}
        <em className="text-gold not-italic"></em>
      </>
    ),
    description:
      "Expertly handcrafted to bring timeless elegance, refined textures, and exceptional character to every space.",
  },
  {
    image: "/hero-backup/carpet-tiles.webp",
    heading: (
      <>
        Soft on the Surface. Strong at the Core.
        <em className="text-gold not-italic"> </em>
      </>
    ),
    description: "Where every floor tells a story.",
  },
  {
    image: "/hero-backup/resilient-flooring.webp",
    heading: (
      <>
        Where Performance Meets Perfection.
        <em className="text-gold not-italic"></em>
      </>
    ),
    description:
      "Resilient flooring made for high-traffic spaces without compromising on style. Strong, easy to maintain, and designed to look flawless for years.",
  },
];

export function HeroSection({ onOpenInquiry, slides }: HeroSectionProps) {
  const hasPropSlides = Boolean(slides?.length);

  // null = backend se abhi kuch nahi aaya (ya backend down hai)
  const [remoteSlides, setRemoteSlides] = useState<HeroSlide[] | null>(null);

  // Priority: props > backend > hardcoded
  const heroSlides: HeroSlide[] = hasPropSlides
    ? slides!
    : (remoteSlides ?? defaultSlides);

  const [activeSlide, setActiveSlide] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  // Preload all slides in background
  useEffect(() => {
    heroSlides.forEach((s) => {
      if (s.image) preloadImage(s.image);
    });
  }, [heroSlides]);

  // Backend se slides fetch karo (fail hua to hardcoded hi chalte rahenge)
  useEffect(() => {
    if (hasPropSlides) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      FETCH_TIMEOUT,
    );

    fetchHeroSlides(controller.signal)
      .then((data) => {
        if (!data.length) return; // backend khali hai -> fallback
        setRemoteSlides(data);
        setActiveSlide(0);
        setProgressKey((current) => current + 1);
      })
      .catch(() => {
        // backend down / timeout / env missing -> fallback, kuch karna nahi
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [hasPropSlides]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
      setProgressKey((current) => current + 1);
    }, SLIDE_DURATION);

    return () => window.clearInterval(interval);
  }, [heroSlides.length, progressKey]);

  const goToSlide = (index: number) => {
    if (index === activeSlide) {
      setProgressKey((current) => current + 1);
      return;
    }

    setActiveSlide(index);
    setProgressKey((current) => current + 1);
  };

  const currentSlide = heroSlides[activeSlide] ?? heroSlides[0];
  const hasButtons = Boolean(
    currentSlide.primaryText || currentSlide.secondaryText,
  );

  return (
    <motion.section
      id="top"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 md:px-[5%] pt-24 pb-28 md:pt-36 md:pb-28 3xl:px-[7%] 3xl:pt-44 3xl:pb-36 4xl:px-[9%]"
    >
      {/* Smooth Background Image Slider */}
      <AnimatePresence initial={false}>
        <motion.img
          key={currentSlide.image}
          src={currentSlide.image}
          alt="Handcrafted rugs in an elegant interior"
          loading="eager"
          decoding="async"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.9, ease: "easeInOut" },
            scale: { duration: 3.2, ease: "linear" },
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-[5] bg-black/20" />

      {/* Center-aligned Animated Content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSlide}
          className="relative z-10 w-full max-w-[1000px] 3xl:max-w-[1200px] 4xl:max-w-[1400px] mx-auto flex flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              },
            },
            exit: {
              transition: { duration: 0.15 },
            },
          }}
        >
          {/* Heading */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 35, filter: "blur(5px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              exit: { opacity: 0, y: -12, filter: "blur(3px)" },
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-[900px] 3xl:max-w-[1100px] 4xl:max-w-[1300px] my-4 md:my-5 text-white font-manrope font-medium text-4xl md:text-5xl 3xl:text-6xl 4xl:text-7xl leading-[1.2] tracking-[-0.02em]"
          >
            {currentSlide.heading}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -8 },
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              color: "#ffffff",
              textShadow: "0 1px 12px rgba(0,0,0,0.45)",
            }}
            className="max-w-[660px] 3xl:max-w-[760px] mx-auto font-light text-sm md:text-[20px] 3xl:text-lg 4xl:text-xl leading-[1.5]"
          >
            {currentSlide.description}
          </motion.p>

          {/* Buttons (optional: sirf tab dikhenge jab text ho) */}
          {hasButtons && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -6 },
              }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap justify-center items-center gap-3 mt-6 md:mt-[26px] 3xl:mt-9 3xl:gap-4"
            >
              {currentSlide.primaryText && (
                <a
                  href="#products"
                  className="inline-flex items-center justify-center min-h-[44px] 3xl:min-h-[52px] px-5 3xl:px-7 text-navy bg-white text-[10px] 3xl:text-xs 4xl:text-sm font-normal tracking-[.13em] uppercase no-underline transition-all duration-200 hover:-translate-y-0.5 cursor-pointer rounded-[8px]"
                >
                  {currentSlide.primaryText}
                </a>
              )}

              {currentSlide.secondaryText && (
                <button
                  type="button"
                  onClick={onOpenInquiry}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] 3xl:min-h-[52px] px-5 3xl:px-7 text-white bg-white/10 backdrop-blur-sm border border-white/50 text-[10px] 3xl:text-xs 4xl:text-sm font-normal tracking-[.13em] uppercase no-underline transition-all duration-200 hover:border-gold hover:text-gold cursor-pointer rounded-[8px]"
                >
                  {currentSlide.secondaryText}
                  <ArrowUpRight size={20} />
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progressive Slide Indicators */}
      {heroSlides.length > 1 && (
        <div className="absolute bottom-7 md:bottom-9 left-0 right-0 z-20 flex items-center justify-center gap-2.5 px-6">
          {heroSlides.map((slide, index) => (
            <button
              key={`${slide.image}-${index}`}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden cursor-pointer transition-all duration-500 rounded-full ${
                activeSlide === index
                  ? "h-[4px] w-12 md:w-16 bg-white/30"
                  : "h-2 w-2 bg-white/60 hover:bg-white"
              }`}
            >
              {activeSlide === index && (
                <motion.span
                  key={progressKey}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: SLIDE_DURATION / 1000,
                    ease: "linear",
                  }}
                  className="absolute inset-0 origin-left rounded-full bg-white"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </motion.section>
  );
}

export default HeroSection;
