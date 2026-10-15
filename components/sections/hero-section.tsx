"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { siteImages } from "@/components/site/site-images";

interface MetricProps {
  number: string;
  title: string;
  detail: string;
}

export function Metric({ number, title, detail }: MetricProps) {
  return (
    <div className="flex items-center gap-3.5 py-1 md:py-[5px] px-0 md:px-[22px] border-b md:border-b-0 md:border-r last:border-b-0 md:last:border-r-0 border-line">
      <span className="text-gold font-manrope italic font-semibold text-[26px]">
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
  primaryText: string;
  secondaryText: string;
}

export interface HeroSectionProps {
  onOpenInquiry?: () => void;
  heroImage?: string;
  slides?: HeroSlide[];
}

const SLIDE_DURATION = 5000;

const defaultSlides = (heroImage: string): HeroSlide[] => [
  {
    image: "hero/hero-1.png",
    heading: (
      <>
        Handmade rugs for <em className="text-gold not-italic">beautiful</em>{" "}
        spaces.
      </>
    ),
    description:
      "Carefully woven by hand using natural wool and silk. Designed to fit your home, hotel, or office perfectly.",
    primaryText: "Explore Collections",
    secondaryText: "Inquire About a Custom Rug",
  },
  {
    image: "hero/hero-5.jpeg",
    heading: (
      <>
        Thoughtful design. <em className="text-gold not-italic">Timeless</em>{" "}
        interiors.
      </>
    ),
    description:
      "Discover handcrafted rugs that bring warmth, texture, and understated elegance to every room.",
    primaryText: "Discover Our Rugs",
    secondaryText: "Create Your Custom Rug",
  },
  {
    image: "hero/hero-2.png",
    heading: (
      <>
        Made by hand. <em className="text-gold not-italic">Made for you.</em>
      </>
    ),
    description:
      "From carefully chosen materials to refined finishes, find a rug that feels uniquely yours.",
    primaryText: "View Collections",
    secondaryText: "Design Your Own Rug",
  },
];

const arrowClassName =
  "absolute z-20 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-0 bg-white/25 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/45 cursor-pointer bottom-3 md:bottom-auto md:top-1/2 md:-translate-y-1/2";

export function HeroSection({
  onOpenInquiry,
  heroImage = siteImages.hero,
  slides,
}: HeroSectionProps) {
  const heroSlides = slides?.length ? slides : defaultSlides(heroImage);
  const [activeSlide, setActiveSlide] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

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

  const goPrev = () =>
    goToSlide((activeSlide - 1 + heroSlides.length) % heroSlides.length);
  const goNext = () => goToSlide((activeSlide + 1) % heroSlides.length);

  const currentSlide = heroSlides[activeSlide];

  return (
    <motion.section
      id="top"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative min-h-screen flex items-center justify-start overflow-hidden pl-0 pr-6 md:pl-[max(5%,72px)] md:pr-[5%] pt-24 pb-28 md:pt-36 md:pb-28"
    >
      {/* Smooth Background Image Slider */}
      <AnimatePresence initial={false}>
        <motion.img
          key={currentSlide.image}
          src={currentSlide.image}
          alt="Handcrafted rugs in an elegant interior"
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

      {/* Left Side Overlay: text ke peeche dark, right ki taraf fade */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.42)_45%,rgba(0,0,0,0)_80%)]" />

      {/* Left-aligned Animated Content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSlide}
          className="relative z-10 w-full max-w-[1400px] mx-auto pl-6 flex flex-col items-start text-left [text-shadow:0_2px_18px_rgba(0,0,0,0.4)]"
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
            className="max-w-[700px] my-4 md:my-5 text-white font-manrope font-light text-4xl leading-[1.2] tracking-[-0.02em]"
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
            className="max-w-[480px] m-0 text-white/70 font-light text-sm leading-[1.7]"
          >
            {currentSlide.description}
          </motion.p>

          {/* Buttons */}
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
            className="flex flex-wrap justify-start items-center gap-3 mt-6 md:mt-[26px]"
          >
            <a
              href="#products"
              className="inline-flex items-center justify-center min-h-[44px] px-5 text-white bg-navy text-[10px] font-normal tracking-[.13em] uppercase no-underline transition-all duration-200 hover:-translate-y-0.5 cursor-pointer rounded-[8px] [text-shadow:none]"
            >
              {currentSlide.primaryText}
            </a>

            <button
              type="button"
              onClick={onOpenInquiry}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 text-white bg-white/10 backdrop-blur-sm border border-white/40 text-[10px] font-normal tracking-[.13em] uppercase no-underline transition-all duration-200 hover:border-gold hover:text-gold cursor-pointer rounded-[8px] [text-shadow:none]"
            >
              {currentSlide.secondaryText}
              <ArrowUpRight size={15} />
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Side Arrows (mobile par neeche, dots ke dono taraf) */}
      {heroSlides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className={`${arrowClassName} left-3 md:left-6`}
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className={`${arrowClassName} right-3 md:right-6`}
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </>
      )}

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
