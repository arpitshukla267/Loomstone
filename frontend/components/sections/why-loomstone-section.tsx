"use client";

import { useEffect, useRef, useState } from "react";
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
const ACCENT = "#5b2a1d"; // "Thoughtful Design. Bespoke Craftsmanship. Seamless Execution."
const ICON = "#5b2a1d"; // icon stroke (deep brown)
const ICON_RING = "#d9c3b0"; // circle border around icons

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.15 } as const;

/* ------------------------------------------------------------------ */
/* Video scaling (the video file has black bars baked into left/right) */
/* Zoom pushes the bars out of the `overflow-hidden` container.        */
/*                                                                     */
/* Tuning: black bar visible  -> increase ZOOM                         */
/*         bar only on left   -> decrease SHIFT_X                      */
/*         bar only on right  -> increase SHIFT_X                      */
/*         move video down    -> increase SHIFT_Y (up -> decrease)     */
/* Best long-term fix: crop the bars out of the file with ffmpeg,      */
/* then set every ZOOM to 1 and every SHIFT_X to 0.                    */
/* ------------------------------------------------------------------ */

// Tablet + small laptop (sm up to < 1500px)
const VIDEO_ZOOM = 1.28;
const VIDEO_SHIFT_X = 1.2;
const VIDEO_SHIFT_Y = 7;

// Mobile (< 640px) -> video box is 4:6 (portrait)
const MOBILE_MAX_WIDTH = 639; // px
const VIDEO_ZOOM_MOBILE = 1.3;
const VIDEO_SHIFT_X_MOBILE = 1.2;
const VIDEO_SHIFT_Y_MOBILE = 6;

// Tablet (640px - 1023px) -> video box is 4:5 (portrait)
const TABLET_MIN_WIDTH = 640; // px
const TABLET_MAX_WIDTH = 1023; // px
const VIDEO_ZOOM_TABLET = 1.5;
const VIDEO_SHIFT_X_TABLET = 1.2;
const VIDEO_SHIFT_Y_TABLET = 6;

// Large laptop (>= 1500px and < 1700px)
const LG_MIN_WIDTH = 1500; // px
const VIDEO_ZOOM_LG = 1.38;
const VIDEO_SHIFT_X_LG = 0.6;
const VIDEO_SHIFT_Y_LG = 6;

// Large screens (>= 1700px)
const XL_MIN_WIDTH = 1700; // px
const VIDEO_ZOOM_XL = 1.55;
const VIDEO_SHIFT_X_XL = 0.2;
const VIDEO_SHIFT_Y_XL = 6;

// NOTE: order matters — the 1500px block must come before the 1700px block
// so that >= 1700px screens are overridden by the XL rule.
const VIDEO_CSS = `
.loomstone-video{transform:translate(${VIDEO_SHIFT_X}%,${VIDEO_SHIFT_Y}%) scale(${VIDEO_ZOOM});transform-origin:center}
@media (max-width:${MOBILE_MAX_WIDTH}px){
  .loomstone-video{transform:translate(${VIDEO_SHIFT_X_MOBILE}%,${VIDEO_SHIFT_Y_MOBILE}%) scale(${VIDEO_ZOOM_MOBILE})}
}
@media (min-width:${TABLET_MIN_WIDTH}px) and (max-width:${TABLET_MAX_WIDTH}px){
  .loomstone-video{transform:translate(${VIDEO_SHIFT_X_TABLET}%,${VIDEO_SHIFT_Y_TABLET}%) scale(${VIDEO_ZOOM_TABLET})}
}
@media (min-width:${LG_MIN_WIDTH}px){
  .loomstone-video{transform:translate(${VIDEO_SHIFT_X_LG}%,${VIDEO_SHIFT_Y_LG}%) scale(${VIDEO_ZOOM_LG})}
}
@media (min-width:${XL_MIN_WIDTH}px){
  .loomstone-video{transform:translate(${VIDEO_SHIFT_X_XL}%,${VIDEO_SHIFT_Y_XL}%) scale(${VIDEO_ZOOM_XL})}
}
`;

type Feature = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const DEFAULT_ICONS: LucideIcon[] = [
  Layers,
  Palette,
  Gem,
  Globe,
  ClipboardCheck,
  Handshake,
];

const ICON_MAP: Record<string, LucideIcon> = {
  Layers,
  Palette,
  Gem,
  Globe,
  ClipboardCheck,
  Handshake,
};

const DEFAULT_FEATURES: Feature[] = [
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
    text: "Working with trusted manufacturing partners to deliver quality material, consistent standards & Bespoke flooring solutions.",
  },
  {
    icon: ClipboardCheck,
    title: "Technical Precision",
    text: "Precision in every detail, creating flooring solutions that unite design, quality and performance.",
  },
  {
    icon: Handshake,
    title: "End to End Project Support",
    text: "Coordinated support from design development to supply & installation, ensuring a seamless product journey from concept to completion.",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FETCH_TIMEOUT = 4000;

// Video freezes (pauses) once it reaches this many seconds.
const STOP_AT_SECONDS = 10;

function FeatureItem({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const row = Math.floor(index / 3); // desktop row
  const col = index % 3; // desktop col
  const mobOdd = index % 2 === 1; // mobile: right column
  const mobRow2Plus = index >= 2; // mobile: not first row

  return (
    <motion.div
      className={
        // Subgrid: each item spans 3 parent rows (icon / heading / text),
        // so the heading + description of every item in the same row line
        // up automatically, whatever the screen size or title length.
        "relative row-span-3 grid [grid-template-rows:subgrid] " +
        (mobRow2Plus ? "pt-6 " : "") +
        (mobRow2Plus ? "pb-0 " : "pb-6 ") +
        (mobOdd ? "pl-4 " : "pr-4 ") +
        "sm:pb-0 " +
        (row === 0 ? "sm:pt-0 sm:pb-8 " : "sm:pt-8 ") +
        (col > 0 ? "sm:pl-6 lg:pl-8 " : "sm:pl-0 ") +
        // right gap so the description never touches the next column's divider
        (col < 2 ? "sm:pr-5" : "sm:pr-0")
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
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center justify-self-start rounded-full border bg-white/40 sm:h-[52px] sm:w-[52px]"
        style={{ borderColor: ICON_RING }}
      >
        <Icon size={20} strokeWidth={1.6} style={{ color: ICON }} />
      </span>

      <h3
        className={
          "mb-0 mt-3 text-[12px] font-semibold leading-[1.25] sm:mt-4 sm:max-w-[200px] sm:text-[13px] 3xl:max-w-[220px] 3xl:text-[15px] 4xl:text-[17px] " +
          (index === 3 ? "!max-w-none whitespace-nowrap" : "")
        }
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

  const [headingText, setHeadingText] = useState("What Sets Loomstone Apart");
  const [subheadingText, setSubheadingText] = useState(
    "Thoughtful Design. Bespoke Craftsmanship. Seamless Execution.",
  );
  const [featuresList, setFeaturesList] = useState<Feature[]>(DEFAULT_FEATURES);

  // Fetch dynamic Why Loomstone content from backend
  useEffect(() => {
    if (!API_URL) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      FETCH_TIMEOUT,
    );

    fetch(`${API_URL}/api/why-loomstone`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch why-loomstone");
        return res.json();
      })
      .then((data) => {
        if (data.heading) setHeadingText(data.heading);
        if (data.subheading) setSubheadingText(data.subheading);

        if (Array.isArray(data.features) && data.features.length > 0) {
          const sorted = [...data.features]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .slice(0, 6);

          setFeaturesList(
            sorted.map((item, i) => {
              const matchedIcon =
                (item.icon && ICON_MAP[item.icon]) ||
                DEFAULT_ICONS[i % DEFAULT_ICONS.length];
              return {
                icon: matchedIcon,
                title: item.title || "",
                text: item.text || "",
              };
            }),
          );
        }
      })
      .catch(() => {
        // Fallback silently to defaults
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.loop = false;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");

    let visible = false;
    let finished = false; // reached STOP_AT_SECONDS -> never play again

    const play = () => {
      if (finished) return;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const freeze = () => {
      finished = true;
      v.pause(); // freeze on this frame
    };

    // Check every 100ms (more precise + reliable than `timeupdate`).
    // If the file is shorter than STOP_AT_SECONDS, stop just before its end.
    const stopTimer = window.setInterval(() => {
      if (finished) return;
      const limit =
        Number.isFinite(v.duration) && v.duration > 0
          ? Math.min(STOP_AT_SECONDS, v.duration - 0.1)
          : STOP_AT_SECONDS;
      if (v.currentTime >= limit) freeze();
    }, 100);

    // Safety net: if the video ends by itself, never restart it.
    const onEnded = () => {
      finished = true;
    };
    v.addEventListener("ended", onEnded);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else v.pause();
      },
      { threshold: 0 },
    );
    io.observe(v);

    const onReady = () => {
      if (visible) play();
    };
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);

    const onVisibility = () => {
      if (!document.hidden && visible) play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      window.clearInterval(stopTimer);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative left-1/2 flex w-screen max-w-[100vw] -translate-x-1/2 flex-col bg-[#fdfbf7] lg:grid lg:grid-cols-[35%_65%] 3xl:grid-cols-[30%_70%]">
        {/* ================= VIDEO =================
            Mobile order: heading -> description -> VIDEO -> points.
            Mobile (< sm): 4:6 (portrait) box with light side padding (px-4).
            sm to < lg: same as before (fixed 400px height).
            lg and up: unchanged. */}
        <div className="order-2 mt-6 flex aspect-[4/6] w-full px-8 py-6 sm:mt-6 sm:aspect-[4/5] sm:h-auto sm:px-8 sm:py-6 lg:order-none lg:mt-0 lg:px-0 lg:aspect-auto lg:h-auto lg:min-h-[540px] lg:py-8 3xl:min-h-[780px] 4xl:min-h-[900px]">
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
            <div
              aria-hidden="true"
              className="absolute inset-0 z-10"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="contents lg:flex lg:items-center lg:px-[6%] lg:py-20 xl:px-[7%] 3xl:px-[8%] 3xl:py-28 4xl:px-[10%] 4xl:py-32">
          <div className="contents lg:mx-auto lg:block lg:w-full lg:max-w-[900px] 3xl:max-w-[1100px] 4xl:max-w-[1300px]">
            <motion.h2
              className="order-1 m-0 px-4 pt-12 text-center font-manrope text-[28px] font-medium leading-[1.1] tracking-[-0.02em] sm:text-left sm:text-[46px] lg:text-[clamp(44px,3.9vw,58px)] 3xl:text-[64px] 4xl:text-[76px] sm:px-10 md:px-14 lg:order-none lg:px-0 lg:pt-0"
              style={{ color: HEADING }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {headingText}
            </motion.h2>

            <motion.p
              className="order-1 m-0 mt-2 px-4 text-center font-manrope text-[16px] font-medium leading-[1.25] tracking-[-0.005em] sm:text-left sm:text-[26px] lg:text-[clamp(24px,2.3vw,34px)] 3xl:text-[38px] 4xl:text-[44px] sm:px-10 md:px-14 lg:order-none lg:px-0"
              style={{ color: ACCENT }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            >
              {subheadingText}
            </motion.p>

            {/* Feature grid: 2 columns on mobile, 3 columns x 2 rows on sm+ (shown after the video on mobile).
                Each FeatureItem uses subgrid (row-span-3) so headings/descriptions align per row. */}
            <div className="order-3 mt-10 grid grid-cols-2 gap-0 px-4 pb-12 sm:grid-cols-3 sm:px-10 md:px-14 lg:order-none lg:px-0 lg:pb-0 3xl:mt-14 4xl:mt-16">
              {featuresList.map((feature, i) => (
                <FeatureItem
                  key={`${feature.title}-${i}`}
                  feature={feature}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default WhyLoomstoneSection;
