"use client";

import { useEffect, useRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  ClipboardCheck,
  Gem,
  Globe,
  Handshake,
  Layers,
  Palette,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Theme colours (from your design)                                    */
/* ------------------------------------------------------------------ */
const HEADING = "#151f28"; // "What Sets Loomstone Apart"
const ACCENT = "#ab7b4d"; // "Thoughtful Design. Bespoke Craftsmanship. Seamless Execution."
const ICON = "#5b2a1d"; // icon stroke (deep brown)
const ICON_RING = "#d9c3b0"; // circle border around icons

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.15 } as const;

/**
 * Video file ke andar left/right black bars baked-in hain (left ~58px, right ~70px,
 * yaani right wali thodi badi hai). Isliye:
 *  - VIDEO_ZOOM    : bars ko bahar dhakelne ke liye zoom
 *  - VIDEO_SHIFT_X : (% mein) video ko RIGHT ki taraf kheenchta hai, taaki
 *                    dono side ke bars barabar cut hon
 *
 * Left side black dikhe  -> VIDEO_SHIFT_X kam karo (0.5, 0)
 * Right side black dikhe -> VIDEO_SHIFT_X badhao (1.5, 2)
 * Dono side dikhe        -> VIDEO_ZOOM badhao (1.3, 1.35)
 *
 * Best fix: video ko ffmpeg se crop karke re-export karo, phir
 * VIDEO_ZOOM = 1 aur VIDEO_SHIFT_X = 0 kar dena.
 */
const VIDEO_ZOOM = 1.28;
const VIDEO_SHIFT_X = 1.2;

/**
 * Badi screens (min-width: 1700px) par container ka shape badal jata hai,
 * isliye wahan zyada zoom chahiye. Sirf yahi values badlo.
 * Black patti dikhe -> XL_ZOOM badhao (1.5, 1.55)
 * Left/right ek taraf dikhe -> XL_SHIFT_X thoda badlo (left dikhe: kam, right dikhe: zyada)
 */
const XL_MIN_WIDTH = 1700; // px
const VIDEO_ZOOM_XL = 1.45;
const VIDEO_SHIFT_X_XL = 0.2;

const VIDEO_CSS = `
.loomstone-video{transform:translateX(${VIDEO_SHIFT_X}%) scale(${VIDEO_ZOOM});transform-origin:center}
@media (min-width:${XL_MIN_WIDTH}px){
  .loomstone-video{transform:translateX(${VIDEO_SHIFT_X_XL}%) scale(${VIDEO_ZOOM_XL})}
}
`;

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const FEATURES: Feature[] = [
  {
    icon: Layers,
    title: "Flooring Expertise",
    text: "Axminster carpets & Rugs, Handcrafted carpets & Rugs, Textile flooring, Resilient Flooring",
  },
  {
    icon: Palette,
    title: "Design Collaboration",
    text: "Working with architects and designers to translate their creative vision into distinctive flooring concepts.",
  },
  {
    icon: Gem,
    title: "Bespoke Flooring Solutions",
    text: "Custom patterns, colours, textures and specifications crafted to bring each project's unique design vision to life.",
  },
  {
    icon: Globe,
    title: "Global Manufacturing Partnerships",
    text: "Working with trusted manufacturing partners and specialist suppliers to deliver quality material, consistent standards & Bespoke flooring solutions.",
  },
  {
    icon: ClipboardCheck,
    title: "Technical Precision",
    text: "Meticulous attention to specification, accurate measurements, budget consideration and project requirements ensuring flooring solutions that balance design intent, performance and practicality.",
  },
  {
    icon: Handshake,
    title: "End to End Project Support",
    text: "Coordinated support from design development to supply and installation, ensuring a seamless product journey from concept to completion.",
  },
];

function FeatureItem({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const row = Math.floor(index / 3); // desktop row
  const col = index % 3; // desktop col
  const mobOdd = index % 2 === 1; // mobile: right column
  const mobRow2Plus = index >= 2; // mobile: not first row

  return (
    <motion.div
      className={
        "relative flex flex-col " +
        // mobile spacing (2 columns)
        (mobRow2Plus ? "pt-6 " : "") +
        (mobRow2Plus ? "pb-0 " : "pb-6 ") +
        (mobOdd ? "pl-4 " : "pr-4 ") +
        // desktop spacing (original 3 columns)
        "sm:pb-0 " +
        (row === 0 ? "sm:pt-0 sm:pb-8 " : "sm:pt-8 ") +
        (col > 0 ? "sm:pl-6 sm:pr-0 lg:pl-8" : "sm:pl-0 sm:pr-2")
      }
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.08, ease: EASE }}
    >
      {/* ---------- MOBILE lines (2 columns) ---------- */}
      {mobRow2Plus && (
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 h-px bg-[#eeeae4] sm:hidden"
        />
      )}
      {mobOdd && (
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-0 top-3 w-px bg-[#eeeae4] sm:hidden"
        />
      )}

      {/* ---------- DESKTOP lines (original) ---------- */}
      {index > 0 && row > 0 && (
        <span
          aria-hidden="true"
          className={
            "absolute left-0 right-0 top-0 hidden h-px bg-[#eeeae4] sm:block " +
            (col === 0 ? "sm:left-0 sm:right-10" : "sm:left-10 sm:right-10")
          }
        />
      )}
      {col > 0 && (
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-0 top-6 hidden w-px bg-[#eeeae4] sm:block"
        />
      )}

      <span
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border bg-white/40 sm:h-[52px] sm:w-[52px]"
        style={{ borderColor: ICON_RING }}
      >
        <Icon size={20} strokeWidth={1.6} style={{ color: ICON }} />
      </span>

      <h3
        className="mb-0 mt-3 text-[14px] font-semibold leading-[1.25] sm:mt-4 sm:max-w-[170px] sm:text-[15px] 3xl:max-w-[220px] 3xl:text-[17px] 4xl:text-[19px]"
        style={{ color: HEADING }}
      >
        {feature.title}
      </h3>
      <p className="mb-0 mt-2 text-[12px] leading-[1.5] text-[#808486] sm:mt-3 sm:max-w-[240px] sm:text-[12.5px] 3xl:max-w-[300px] 3xl:text-[14px] 4xl:text-[15px]">
        {feature.text}
      </p>
    </motion.div>
  );
}

export interface WhyLoomstoneSectionProps {
  /** Put your left-side video in /public and pass its path here. */
  video?: string;
  /** Optional poster image shown until the video loads. */
  poster?: string;
  /** Optional image for backwards compatibility */
  image?: string;
}

export function WhyLoomstoneSection({
  video = "/why_loomstone.mp4",
  poster = "/why_loomstone.png",
  image,
}: WhyLoomstoneSectionProps) {
  const activePoster = poster || image;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Muted is required, otherwise browsers block autoplay
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");

    let visible = false;

    const play = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    // threshold 0 = starts as soon as even 1px of the video is visible
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else v.pause();
      },
      { threshold: 0 },
    );
    io.observe(v);

    // If the video finishes loading while it's already on screen, start it
    const onReady = () => {
      if (visible) play();
    };
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);

    // Resume when the tab becomes active again
    const onVisibility = () => {
      if (!document.hidden && visible) play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {/* 35 / 65 split. */}
      <section className="relative left-1/2 grid w-screen max-w-[100vw] -translate-x-1/2 grid-cols-1 bg-[#fdfbf7] lg:grid-cols-[35%_65%] 3xl:grid-cols-[30%_70%]">
        {/* ================= VIDEO (left edge se start, sirf upar/neeche padding) ================= */}
        <div className="flex h-[300px] py-4 sm:h-[400px] sm:py-6 lg:h-auto lg:min-h-[540px] lg:py-8 3xl:min-h-[780px] 4xl:min-h-[900px]">
          {/* overflow-hidden: zoomed video ke black bars yahin cut hote hain */}
          <div
            className="relative flex-1 overflow-hidden bg-[#fdfbf7] select-none"
            onContextMenu={(e) => e.preventDefault()}
          >
            <style>{VIDEO_CSS}</style>
            <video
              ref={videoRef}
              className="loomstone-video pointer-events-none absolute inset-0 h-full w-full object-cover"
              src={video}
              poster={activePoster}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              controls={false}
              controlsList="nodownload noremoteplayback nofullscreen"
              disablePictureInPicture
              disableRemotePlayback
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* transparent overlay: right-click / long-press video tak pahunchne hi nahi dega */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-10"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex items-center px-4 py-12 sm:px-10 md:px-14 lg:px-[6%] lg:py-20 xl:px-[7%] 3xl:px-[8%] 3xl:py-28 4xl:px-[10%] 4xl:py-32">
          <div className="mx-auto w-full max-w-[100vw] sm:max-w-[900px] 3xl:max-w-[1100px] 4xl:max-w-[1300px]">
            <motion.h2
              className="m-0 text-center font-manrope text-[28px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-left sm:text-[46px] lg:text-[clamp(44px,3.9vw,58px)] 3xl:text-[64px] 4xl:text-[76px]"
              style={{ color: HEADING }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, ease: EASE }}
            >
              What Sets Loomstone Apart
            </motion.h2>

            <motion.p
              className="m-0 mt-2 text-center font-manrope text-[16px] font-medium leading-[1.25] tracking-[-0.005em] sm:text-left sm:text-[26px] lg:text-[clamp(24px,2.3vw,34px)] 3xl:text-[38px] 4xl:text-[44px]"
              style={{ color: ACCENT }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              Thoughtful Design. Bespoke Craftsmanship. Seamless Execution.
            </motion.p>

            {/* Feature grid: 2 columns on mobile, 3 columns x 2 rows on sm+ */}
            <div className="mt-10 grid grid-cols-2 gap-0 sm:grid-cols-3 3xl:mt-14 4xl:mt-16">
              {FEATURES.map((feature, i) => (
                <FeatureItem key={feature.title} feature={feature} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default WhyLoomstoneSection;
