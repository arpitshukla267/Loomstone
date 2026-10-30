// "use client";

// import { motion, MotionConfig } from "framer-motion";

// /* ------------------------------------------------------------------ */
// /* Collage layout                                                      */
// /* Everything is positioned in `cqw` (1% of the collage width), so the */
// /* whole composition scales perfectly at any screen size.              */
// /* ------------------------------------------------------------------ */

// const CARD_W = 10; // cqw
// const CARD_H = 12.3; // cqw
// const COL_START = 1.5; // cqw, left edge of first column
// const COL_PITCH = 11; // cqw, distance between column left edges
// const COLLAGE_ASPECT = "100 / 40"; // collage width / height

// type Card = {
//   y: number; // top offset in cqw
//   featured?: boolean;
// };

// type Column = {
//   cards: Card[];
// };

// const COLUMNS: Column[] = [
//   { cards: [{ y: 11.1 }, { y: 24.4 }] },
//   { cards: [{ y: 6.4 }, { y: 19.6 }] },
//   { cards: [{ y: 12 }] },
//   { cards: [{ y: 7.1 }] },
//   { cards: [{ y: 10 }] },
//   { cards: [{ y: 6.8 }] },
//   { cards: [{ y: 12 }] },
//   { cards: [{ y: 6.4 }, { y: 20 }] },
//   { cards: [{ y: 11.1 }, { y: 24.2 }] },
// ];

// // Placeholder tints, built from the navy / gold theme.
// const TINTS = [
//   "from-[#e6e8f2] to-[#cfd3e8]",
//   "from-[#f1ead7] to-[#e3d5ae]",
//   "from-[#e1e7ee] to-[#c5ced6]",
//   "from-[#ebe8f3] to-[#d6d3ea]",
//   "from-[#f3eddc] to-[#e8dbb7]",
// ];

// const EASE = [0.22, 1, 0.36, 1] as const;

// // Scroll-reveal settings shared by every animated block.
// const VIEWPORT = { once: true, amount: 0.15 } as const;

// /* ------------------------------------------------------------------ */
// /* FLOATING CONTROLS: change these 3 numbers to tune the animation.    */
// /* ------------------------------------------------------------------ */
// const FLOAT_DURATION = 3.2; // seconds for one up-and-down cycle (smaller = faster)
// const FLOAT_AMPLITUDE = 10; // px, how far cards drift up (bigger = more movement)
// const FLOAT_COLUMN_DELAY = 0.35; // seconds between columns (0 = all columns in sync)
// // All cards in the same column always move together (same delay).

// /* ------------------------------------------------------------------ */
// /* Placeholder / image card                                            */
// /* ------------------------------------------------------------------ */

// function PersonPlaceholder() {
//   return (
//     <svg
//       viewBox="0 0 48 48"
//       className="h-[44%] w-[44%] text-navy/25"
//       fill="currentColor"
//       aria-hidden="true"
//     >
//       <circle cx="24" cy="17" r="8" />
//       <path d="M8 42c0-9 7-15 16-15s16 6 16 15v2H8v-2z" />
//     </svg>
//   );
// }

// function CardFace({
//   tint,
//   image,
//   featured,
//   label,
//   fit,
// }: {
//   tint: string;
//   image?: string;
//   featured?: boolean;
//   label: string;
//   fit: "cover" | "contain";
// }) {
//   if (image) {
//     return (
//       <div className="h-full w-full bg-white">
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={image}
//           alt={label}
//           className={
//             fit === "contain"
//               ? "h-full w-full object-contain p-[14%]"
//               : "h-full w-full object-cover"
//           }
//           draggable={false}
//         />
//       </div>
//     );
//   }
//   return (
//     <div
//       role="img"
//       aria-label={label}
//       className={
//         "flex h-full w-full items-center justify-center bg-gradient-to-br " +
//         (featured ? "from-[#dcdff2] to-[#a8aed8]" : tint)
//       }
//     >
//       <PersonPlaceholder />
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* Section                                                             */
// /* ------------------------------------------------------------------ */

// export interface TestimonialsSectionProps {
//   titleTop?: string;
//   titleBottom?: string;
//   description?: string;
//   ctaLabel?: string;
//   ctaHref?: string;
//   /**
//    * Optional photos. They fill the cards in reading order (left to right,
//    * top to bottom). Leave empty to show placeholders.
//    */
//   images?: string[];
//   /** "cover" for photos, "contain" for logos (no cropping). */
//   imageFit?: "cover" | "contain";
// }

// export function ClientsSection({
//   titleTop = "Trusted by leaders",
//   titleBottom = "from various industries",
//   description = "Learn why professionals trust our solutions to complete their customer journeys.",
//   ctaLabel = "Read Success Stories",
//   ctaHref = "about#our-story",
//   images = [],
//   imageFit = "cover",
// }: TestimonialsSectionProps) {
//   let imageIdx = 0;

//   return (
//     <MotionConfig reducedMotion="user">
//       <section
//         className="relative overflow-hidden bg-[#FFFCF4] ash"
//         id="testimonials"
//       >
//         {/* ================= COLLAGE ================= */}
//         {/* On mobile the collage is drawn 2.2x wider and centered, so the
//             cards stay a readable size and the edges are cropped. */}
//         <div className="overflow-x-clip">
//           <div
//             className="relative left-1/2 z-0 w-[220%] -translate-x-1/2 md:left-0 md:w-full md:translate-x-0"
//             style={{
//               containerType: "inline-size",
//               aspectRatio: COLLAGE_ASPECT,
//             }}
//           >
//             {COLUMNS.map((col, i) => {
//               const left = COL_START + i * COL_PITCH;
//               return (
//                 <div key={"col-" + i}>
//                   {col.cards.map((card, j) => {
//                     const idx = imageIdx++;
//                     const w = card.featured ? CARD_W + 0.4 : CARD_W;
//                     const h = card.featured ? 14.6 : CARD_H;
//                     const label = "Client " + (idx + 1);
//                     return (
//                       // 1) Scroll reveal: each card animates in when it
//                       //    enters the viewport.
//                       <motion.div
//                         key={"card-" + i + "-" + j}
//                         className="absolute"
//                         style={{
//                           left: left + "cqw",
//                           top: card.y + "cqw",
//                           width: w + "cqw",
//                           height: h + "cqw",
//                           zIndex: card.featured ? 5 : 1,
//                         }}
//                         initial={{ opacity: 0, y: 40, scale: 0.94 }}
//                         whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                         viewport={VIEWPORT}
//                         transition={{
//                           duration: 0.8,
//                           delay: i * 0.06 + j * 0.1,
//                           ease: EASE,
//                         }}
//                       >
//                         {/* 2) Floating: endless gentle up/down drift. */}
//                         <motion.div
//                           className="h-full w-full"
//                           animate={{ y: [0, -FLOAT_AMPLITUDE, 0] }}
//                           transition={{
//                             duration: FLOAT_DURATION,
//                             delay: i * FLOAT_COLUMN_DELAY,
//                             repeat: Infinity,
//                             ease: "easeInOut",
//                           }}
//                         >
//                           <div
//                             className={
//                               "h-full w-full overflow-hidden rounded-[1cqw] transition-transform duration-300 hover:-translate-y-1 " +
//                               (card.featured
//                                 ? "shadow-[0_28px_50px_-18px_rgba(42,41,103,0.5)] ring-1 ring-gold/50"
//                                 : "shadow-[0_8px_20px_-12px_rgba(42,41,103,0.35)] ring-1 ring-white/70")
//                             }
//                             style={
//                               card.featured
//                                 ? {
//                                     transform:
//                                       "perspective(900px) rotateY(-12deg) rotateX(3deg)",
//                                   }
//                                 : undefined
//                             }
//                           >
//                             <CardFace
//                               tint={TINTS[idx % TINTS.length]}
//                               image={images[idx]}
//                               featured={card.featured}
//                               label={label}
//                               fit={imageFit}
//                             />
//                           </div>
//                         </motion.div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ================= TEXT ================= */}
//         <div className="relative z-10 -mt-[24vw] px-6 pb-[70px] md:-mt-[min(10vw,160px)] 3xl:-mt-[180px] 4xl:-mt-[220px] md:pb-[110px] 3xl:pb-[150px] 4xl:pb-[180px]">
//           <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center">
//             <h2 className="font-manrope text-[34px] font-medium leading-[1.12] tracking-[-0.02em] text-navy sm:text-[44px] md:text-[clamp(40px,4.2vw,60px)] 3xl:text-[70px] 4xl:text-[80px]">
//               <motion.span
//                 className="block"
//                 initial={{ opacity: 0, y: 28 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={VIEWPORT}
//                 transition={{ duration: 0.8, ease: EASE }}
//               >
//                 {titleTop}
//               </motion.span>
//               <motion.span
//                 className="block text-[#E5A224]"
//                 initial={{ opacity: 0, y: 28 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={VIEWPORT}
//                 transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
//               >
//                 {titleBottom}
//               </motion.span>
//             </h2>

//             <motion.p
//               className="mt-6 max-w-[460px] 3xl:max-w-[580px] 4xl:max-w-[650px] text-[16px] leading-[1.7] text-navy/80 sm:text-[17px] 3xl:text-[20px] 4xl:text-[22px]"
//               initial={{ opacity: 0, y: 24 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={VIEWPORT}
//               transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
//             >
//               {description}
//             </motion.p>

//             <motion.a
//               href={ctaHref}
//               className="group mt-9 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 3xl:px-9 3xl:py-4 text-[14px] 3xl:text-[16px] 4xl:text-[18px] font-medium text-white shadow-[0_10px_24px_-10px_rgba(42,41,103,0.7)] transition-colors duration-300 hover:bg-gold hover:text-navy"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={VIEWPORT}
//               transition={{ duration: 0.8, delay: 0.38, ease: EASE }}
//             >
//               {ctaLabel}
//               <svg
//                 viewBox="0 0 16 16"
//                 className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 aria-hidden="true"
//               >
//                 <path d="M3 8h10M9 4l4 4-4 4" />
//               </svg>
//             </motion.a>
//           </div>
//         </div>
//       </section>
//     </MotionConfig>
//   );
// }

// export default ClientsSection;

"use client";

import { motion, MotionConfig } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Collage layout (8 clients) - DESKTOP / TABLET (md and up)           */
/* Everything is positioned in `cqw` (1% of the collage width), so the */
/* whole composition scales perfectly at any screen size.              */
/* One card per column, 8 columns, arranged in a soft symmetrical arc. */
/* ------------------------------------------------------------------ */

const CARD_W = 10.5; // cqw
const CARD_H = 13; // cqw
const COL_START = 1.35; // cqw, left edge of first column
const COL_PITCH = 12.4; // cqw, distance between column left edges
const COLLAGE_ASPECT = "100 / 40"; // collage width / height

type Card = {
  y: number; // top offset in cqw
};

type Column = {
  cards: Card[];
};

// 8 columns x 1 card = 8 clients. The two middle cards are highest,
// edges sit lower (symmetrical arc).
const COLUMNS: Column[] = [
  { cards: [{ y: 22 }] },
  { cards: [{ y: 16 }] },
  { cards: [{ y: 10.5 }] },
  { cards: [{ y: 7 }] },
  { cards: [{ y: 7 }] },
  { cards: [{ y: 10.5 }] },
  { cards: [{ y: 16 }] },
  { cards: [{ y: 22 }] },
];

// Placeholder tints, built from the navy / gold theme.
const TINTS = [
  "from-[#e6e8f2] to-[#cfd3e8]",
  "from-[#f1ead7] to-[#e3d5ae]",
  "from-[#e1e7ee] to-[#c5ced6]",
  "from-[#ebe8f3] to-[#d6d3ea]",
  "from-[#f3eddc] to-[#e8dbb7]",
];

const CLIENT_COUNT = 8;

const EASE = [0.22, 1, 0.36, 1] as const;

// Scroll-reveal settings shared by every animated block.
const VIEWPORT = { once: true, amount: 0.15 } as const;

/* ------------------------------------------------------------------ */
/* FLOATING CONTROLS (desktop): change these 3 numbers to tune it.     */
/* ------------------------------------------------------------------ */
const FLOAT_DURATION = 3.2; // seconds for one up-and-down cycle (smaller = faster)
const FLOAT_AMPLITUDE = 10; // px, how far cards drift up (bigger = more movement)
const FLOAT_COLUMN_DELAY = 0.35; // seconds between columns (0 = all columns in sync)

/* ------------------------------------------------------------------ */
/* MOBILE MARQUEE CONTROLS (below md)                                  */
/* ------------------------------------------------------------------ */
const MARQUEE_DURATION = 38; // seconds for one full loop (bigger = slower)

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
/* Mobile marquee: two rows of cards drifting in opposite directions.  */
/* Cards keep a fixed, readable size instead of shrinking with the     */
/* screen, and nothing is cropped awkwardly.                           */
/* ------------------------------------------------------------------ */

const FADE_MASK =
  "linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%)";

function MarqueeRow({
  order,
  images,
  fit,
  reverse = false,
  duration,
}: {
  order: number[];
  images: string[];
  fit: "cover" | "contain";
  reverse?: boolean;
  duration: number;
}) {
  // Two identical copies; sliding by -50% loops seamlessly.
  const copies = [0, 1];

  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
    >
      <motion.div
        className="flex w-max will-change-transform"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {copies.map((copy) => (
          <div
            key={"copy-" + copy}
            className="flex gap-3 pr-3 sm:gap-4 sm:pr-4"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {[...order, ...order].map((idx, k) => {
              const label = "Client " + (idx + 1);
              return (
                <div
                  key={"m-" + copy + "-" + k}
                  className="aspect-[10.5/13] w-[104px] shrink-0 overflow-hidden rounded-xl shadow-[0_8px_20px_-12px_rgba(42,41,103,0.35)] ring-1 ring-white/70 min-[420px]:w-[116px] sm:w-[132px]"
                >
                  <CardFace
                    tint={TINTS[idx % TINTS.length]}
                    image={images[idx]}
                    label={label}
                    fit={fit}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function MobileMarquee({
  images,
  fit,
}: {
  images: string[];
  fit: "cover" | "contain";
}) {
  const all = Array.from({ length: CLIENT_COUNT }, (_, i) => i);
  // Row 1 = first 4 logos, row 2 = last 4 logos, so the same logo
  // never shows in both rows at the same moment.
  const half = CLIENT_COUNT / 2;
  const forward = all.slice(0, half);
  const shifted = all.slice(half);

  return (
    <motion.div
      className="flex flex-col gap-3 px-0 pb-8 pt-10 sm:gap-4 sm:pb-10 sm:pt-12 md:hidden"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <MarqueeRow
        order={forward}
        images={images}
        fit={fit}
        duration={MARQUEE_DURATION}
      />
      <MarqueeRow
        order={shifted}
        images={images}
        fit={fit}
        reverse
        duration={MARQUEE_DURATION + 6}
      />
    </motion.div>
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
   * Optional photos / logos for the 8 clients. They fill the cards in
   * reading order (left to right). Leave empty to show placeholders.
   */
  images?: string[];
  /** "cover" for photos, "contain" for logos (no cropping). */
  imageFit?: "cover" | "contain";
}

export function ClientsSection({
  titleTop = "Trusted by leaders",
  titleBottom = "from various sectors",
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
        {/* ================= COLLAGE (md and up, unchanged) ================= */}
        <div className="hidden overflow-x-clip md:block">
          <div
            className="relative z-0 w-full"
            style={{
              containerType: "inline-size",
              aspectRatio: COLLAGE_ASPECT,
            }}
          >
            {COLUMNS.map((col, i) => {
              const colLeft = COL_START + i * COL_PITCH;
              return (
                <div key={"col-" + i}>
                  {col.cards.map((card, j) => {
                    const idx = imageIdx++;
                    const w = CARD_W;
                    const h = CARD_H;
                    const left = colLeft;
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
                          zIndex: 1,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.94 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={VIEWPORT}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.08 + j * 0.1,
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
                              "h-full w-full overflow-hidden rounded-[1cqw] shadow-[0_8px_20px_-12px_rgba(42,41,103,0.35)] ring-1 ring-white/70 transition-transform duration-300 hover:-translate-y-1"
                            }
                          >
                            <CardFace
                              tint={TINTS[idx % TINTS.length]}
                              image={images[idx]}
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
        {/* Mobile: normal flow below the marquee (no overlap).
            md and up: same negative-margin overlap as before. */}
        <div className="relative z-10 px-5 pb-0 pt-12 sm:px-6 sm:pt-14 md:-mt-[min(10vw,160px)] md:pb-[110px] md:pt-0 3xl:-mt-[180px] 3xl:pb-[150px] 4xl:-mt-[220px] 4xl:pb-[180px]">
          <div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center">
            <h2 className="font-manrope text-[30px] font-medium leading-[1.15] tracking-[-0.02em] text-navy min-[420px]:text-[34px] sm:text-[44px] md:text-[clamp(40px,4.2vw,60px)] 3xl:text-[70px] 4xl:text-[80px]">
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
              className="mt-4 max-w-[340px] text-[15px] leading-[1.65] text-navy/80 sm:mt-6 sm:max-w-[460px] sm:text-[17px] sm:leading-[1.7] 3xl:max-w-[580px] 3xl:text-[20px] 4xl:max-w-[650px] 4xl:text-[22px]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            >
              {description}
            </motion.p>

            {/* CTA for md and up (unchanged). On mobile it is shown below the carousel. */}
            <div className="hidden md:contents">
              <motion.a
                href={ctaHref}
                className="group mt-9 inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3.5 3xl:px-9 3xl:py-4 text-[14px] 3xl:text-[16px] 4xl:text-[18px] font-medium text-white shadow-[0_10px_24px_-10px_rgba(42,41,103,0.7)] transition-colors duration-300 hover:bg-gold hover:text-navy"
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
        </div>

        {/* ================= MOBILE MARQUEE (below md, after text) ================= */}
        <MobileMarquee images={images} fit={imageFit} />
        {/* ================= MOBILE CTA (below md, after carousel) ================= */}
        <div className="flex justify-center px-5 pb-14 sm:pb-16 md:hidden">
          <motion.a
            href={ctaHref}
            className="group inline-flex w-full max-w-[300px] items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-[14px] font-medium text-white shadow-[0_10px_24px_-10px_rgba(42,41,103,0.7)] transition-colors duration-300 hover:bg-gold hover:text-navy sm:w-auto sm:max-w-none"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.8, ease: EASE }}
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
      </section>
    </MotionConfig>
  );
}

export default ClientsSection;