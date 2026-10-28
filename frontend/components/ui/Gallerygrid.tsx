"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Lens } from "@/components/ui/lens";

type GalleryItem = {
  title: string;
  image: string | { src: string };
};

type GalleryGridProps = {
  items: GalleryItem[];
  // kept optional so older call sites still compile; no longer used
  saved?: string[];
  onToggleSave?: (title: string) => void;
};

const srcOf = (image: GalleryItem["image"]) =>
  typeof image === "string" ? image : image.src;

// Natural aspect ratio of the opened image so the lens maps 1:1 onto it
function useRatio(src: string | null) {
  const [ratio, setRatio] = useState(1.5);
  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = src;
  }, [src]);
  return ratio;
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );
  const prev = useCallback(
    () =>
      setActive((i) =>
        i === null ? i : (i - 1 + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, next, prev]);

  // Close the viewer if the filtered list shrinks under it
  useEffect(() => {
    if (active !== null && active >= items.length) setActive(null);
  }, [items.length, active]);

  const current = active !== null ? items[active] : null;
  const currentSrc = current ? srcOf(current.image) : null;
  const ratio = useRatio(currentSrc);

  const navBtn: React.CSSProperties = {
    position: "absolute",
    zIndex: 2,
    width: 48,
    height: 48,
    borderRadius: "9999px",
    border: "1px solid rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <>
      {/* Masonry: every image keeps its own natural width/height ratio */}
      <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 3xl:columns-4 3xl:gap-4 4xl:columns-4 4xl:gap-6">
        {items.map((item, index) => (
          <motion.button
            key={item.title}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            onClick={() => setActive(index)}
            aria-label={`Open ${item.title}`}
            className="group mb-2 3xl:mb-4 block w-full break-inside-avoid cursor-zoom-in overflow-hidden bg-[#eee]"
          >
            <Image
              src={srcOf(item.image)}
              alt={item.title}
              width={0}
              height={0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.06]"
              style={{ width: "100%", height: "auto" }}
            />
          </motion.button>
        ))}
      </div>

      {/* Lightbox: black overlay, image only, rendered above the whole page */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {current && currentSrc && (
              <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={close}
                role="dialog"
                aria-modal="true"
                aria-label={current.title}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 9999,
                  background: "rgba(0,0,0,0.92)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  style={{ ...navBtn, top: 24, right: 24 }}
                >
                  <X size={22} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Previous image"
                  style={{ ...navBtn, left: 24, top: "50%", marginTop: -24 }}
                >
                  <ChevronLeft size={22} />
                </button>

                <motion.div
                  key={currentSrc}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "relative",
                    aspectRatio: String(ratio),
                    width: `min(88vw, calc(84vh * ${ratio}))`,
                  }}
                >
                  <Lens
                    src={currentSrc}
                    alt={current.title}
                    zoomFactor={2.5}
                    lensSize={200}
                    className="h-full w-full"
                  />
                </motion.div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Next image"
                  style={{ ...navBtn, right: 24, top: "50%", marginTop: -24 }}
                >
                  <ChevronRight size={22} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
