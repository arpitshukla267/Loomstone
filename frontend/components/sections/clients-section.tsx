"use client";

import { motion, MotionConfig } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Collage layout                                                      */
/* Everything is positioned in `cqw` (1% of the collage width), so the */
/* whole composition scales perfectly at any screen size.              */
/* ------------------------------------------------------------------ */

const CARD_W = 10; // cqw
const CARD_H = 12.3; // cqw
const COL_START = 1.5; // cqw, left edge of first column
const COL_PITCH = 11; // cqw, distance between column left edges
const COLLAGE_ASPECT = "100 / 40"; // collage width / height

type Card = {
  y: number; // top offset in cqw
  featured?: boolean;
};

type Column = {
  cards: Card[];
};

const COLUMNS: Column[] = [
  { cards: [{ y: 11.1 }, { y: 24.4 }] },
  { cards: [{ y: 6.4 }, { y: 19.6 }] },
  { cards: [{ y: 12 }] },
  { cards: [{ y: 7.1 }] },
  { cards: [{ y: 10 }] },
  { cards: [{ y: 6.8 }] },
  { cards: [{ y: 12 }] },
  { cards: [{ y: 6.4 }, { y: 20 }] },
  { cards: [{ y: 11.1 }, { y: 24.2 }] },
];

// Placeholder tints, built from the navy / gold theme.
const TINTS = [
  "from-[#e6e8f2] to-[#cfd3e8]",
  "from-[#f1ead7] to-[#e3d5ae]",
  "from-[#e1e7ee] to-[#c5ced6]",
  "from-[#ebe8f3] to-[#d6d3ea]",
  "from-[#f3eddc] to-[#e8dbb7]",
];

const EASE = [0.22, 1, 0.36, 1] as const;

// Scroll-reveal settings shared by every animated block.
const VIEWPORT = { once: true, amount: 0.15 } as const;

/* ------------------------------------------------------------------ */
/* FLOATING CONTROLS: change these 3 numbers to tune the animation.    */
/* ------------------------------------------------------------------ */
const FLOAT_DURATION = 3.2; // seconds for one up-and-down cycle (smaller = faster)
const FLOAT_AMPLITUDE = 10; // px, how far cards drift up (bigger = more movement)
const FLOAT_COLUMN_DELAY = 0.35; // seconds between columns (0 = all columns in sync)
// All cards in the same column always move together (same delay).

/* ------------------------------------------------------------------ */
/* Placeholder / image card                                            */
/* ------------------------------------------------------------------ */

function PersonPlaceholder() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-[44%] w-[44%] text-navy/25"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="24" cy="17" r="8" />
      <path d="M8 42c0-9 7-15 16-15s16 6 16 15v2H8v-2z" />
    </svg>
  );
}

function CardFace({
  tint,
  image,
  featured,
  label,
  fit,
}: {
  tint: string;
  image?: string;
  featured?: boolean;
  label: string;
  fit: "cover" | "contain";
}) {
  if (image) {
    return (
      <div className="h-full w-full bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={label}
          className={
            fit === "contain"
              ? "h-full w-full object-contain p-[14%]"
              : "h-full w-full object-cover"
          }
          draggable={false}
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={label}
      className={
        "flex h-full w-full items-center justify-center bg-gradient-to-br " +
        (featured ? "from-[#dcdff2] to-[#a8aed8]" : tint)
      }
    >
      <PersonPlaceholder />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export interface TestimonialsSectionProps {
  titleTop?: string;
  titleBottom?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /**
   * Optional photos. They fill the cards in reading order (left to right,
   * top to bottom). Leave empty to show placeholders.
   */
  images?: string[];
  /** "cover" for photos, "contain" for logos (no cropping). */
  imageFit?: "cover" | "contain";
}

export function ClientsSection({
  titleTop = "Trusted by leaders",
  titleBottom = "from various industries",
  description = "Learn why professionals trust our solutions to complete their customer journeys.",
  ctaLabel = "Read Success Stories",
  ctaHref = "about#our-story",
  images = [],
  imageFit = "cover",
}: TestimonialsSectionProps) {
  let imageIdx = 0;

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="relative overflow-hidden bg-[#FFFCF4] ash"
        id="testimonials"
      >
        {/* ================= COLLAGE ================= */}
        {/* On mobile the collage is drawn 2.2x wider and centered, so the
            cards stay a readable size and the edges are cropped. */}
        <div className="overflow-x-clip">
          <div
            className="relative left-1/2 z-0 w-[220%] -translate-x-1/2 md:left-0 md:w-full md:translate-x-0"
            style={{
              containerType: "inline-size",
              aspectRatio: COLLAGE_ASPECT,
            }}
          >
            {COLUMNS.map((col, i) => {
              const left = COL_START + i * COL_PITCH;
              return (
                <div key={"col-" + i}>
                  {col.cards.map((card, j) => {
                    const idx = imageIdx++;
                    const w = card.featured ? CARD_W + 0.4 : CARD_W;
                    const h = card.featured ? 14.6 : CARD_H;
                    const label = "Client " + (idx + 1);
                    return (
                      // 1) Scroll reveal: each card animates in when it
                      //    enters the viewport.
                      <motion.div
                        key={"card-" + i + "-" + j}
                        className="absolute"
                        style={{
                          left: left + "cqw",
                          top: card.y + "cqw",
                          width: w + "cqw",
                          height: h + "cqw",
                          zIndex: card.featured ? 5 : 1,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.94 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={VIEWPORT}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.06 + j * 0.1,
                          ease: EASE,
                        }}
                      >
                        {/* 2) Floating: endless gentle up/down drift. */}
                        <motion.div
                          className="h-full w-full"
                          animate={{ y: [0, -FLOAT_AMPLITUDE, 0] }}
                          transition={{
                            duration: FLOAT_DURATION,
                            delay: i * FLOAT_COLUMN_DELAY,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <div
                            className={
                              "h-full w-full overflow-hidden rounded-[1cqw] transition-transform duration-300 hover:-translate-y-1 " +
                              (card.featured
                                ? "shadow-[0_28px_50px_-18px_rgba(42,41,103,0.5)] ring-1 ring-gold/50"
                                : "shadow-[0_8px_20px_-12px_rgba(42,41,103,0.35)] ring-1 ring-white/70")
                            }
                            style={
                              card.featured
                                ? {
                                    transform:
                                      "perspective(900px) rotateY(-12deg) rotateX(3deg)",
                                  }
                                : undefined
                            }
                          >
                            <CardFace
                              tint={TINTS[idx % TINTS.length]}
                              image={images[idx]}
                              featured={card.featured}
                              label={label}
                              fit={imageFit}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= TEXT ================= */}
        <div className="relative z-10 -mt-[24vw] px-6 pb-[70px] md:-mt-[min(10vw,160px)] md:pb-[110px]">
          <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center">
            <h2 className="font-manrope text-[34px] font-medium leading-[1.12] tracking-[-0.02em] text-navy sm:text-[44px] md:text-[clamp(40px,4.2vw,60px)]">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {titleTop}
              </motion.span>
              <motion.span
                className="block text-[#E5A224]"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
              >
                {titleBottom}
              </motion.span>
            </h2>

            <motion.p
              className="mt-6 max-w-[460px] text-[16px] leading-[1.7] text-navy/80 sm:text-[17px]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            >
              {description}
            </motion.p>

            <motion.a
              href={ctaHref}
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 text-[14px] font-medium text-white shadow-[0_10px_24px_-10px_rgba(42,41,103,0.7)] transition-colors duration-300 hover:bg-gold hover:text-navy"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
            >
              {ctaLabel}
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </motion.a>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default ClientsSection;
