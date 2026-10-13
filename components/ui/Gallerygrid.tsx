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

/**
 * Mosaic layouts on a 12-column grid. Each tile is [col, colSpan, row, rowSpan].
 * Every layout fills a full rectangle with no gaps, like a photo collage.
 */
type Tile = [number, number, number, number];
const LAYOUTS: Record<number, { rows: number; tiles: Tile[] }> = {
  1: { rows: 3, tiles: [[1, 12, 1, 3]] },
  2: {
    rows: 3,
    tiles: [
      [1, 7, 1, 3],
      [8, 5, 1, 3],
    ],
  },
  3: {
    rows: 3,
    tiles: [
      [1, 6, 1, 3],
      [7, 6, 1, 1],
      [7, 6, 2, 2],
    ],
  },
  4: {
    rows: 2,
    tiles: [
      [1, 6, 1, 2],
      [7, 6, 1, 1],
      [7, 3, 2, 1],
      [10, 3, 2, 1],
    ],
  },
  5: {
    rows: 3,
    tiles: [
      [1, 7, 1, 1],
      [8, 5, 1, 2],
      [1, 4, 2, 1],
      [5, 3, 2, 1],
      [1, 12, 3, 1],
    ],
  },
  6: {
    rows: 4,
    tiles: [
      [1, 7, 1, 1],
      [8, 5, 1, 2],
      [1, 4, 2, 1],
      [5, 3, 2, 1],
      [1, 6, 3, 2],
      [7, 6, 3, 2],
    ],
  },
};

function buildTiles(count: number) {
  const placed: { index: number; tile: Tile }[] = [];
  let rowOffset = 0;
  let index = 0;
  while (index < count) {
    const chunk = Math.min(6, count - index);
    const layout = LAYOUTS[chunk];
    layout.tiles.forEach((t, i) => {
      placed.push({
        index: index + i,
        tile: [t[0], t[1], t[2] + rowOffset, t[3]],
      });
    });
    rowOffset += layout.rows;
    index += chunk;
  }
  return { placed, totalRows: rowOffset };
}

// Row height follows the screen height, so the collage length adapts to the screen.
function useRowHeight() {
  const [rowHeight, setRowHeight] = useState(190);
  useEffect(() => {
    const update = () =>
      setRowHeight(
        Math.max(110, Math.min(240, Math.round(window.innerHeight * 0.17))),
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return rowHeight;
}

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

const GAP = 8;

export default function GalleryGrid({ items }: GalleryGridProps) {
  const rowHeight = useRowHeight();
  const [active, setActive] = useState<number | null>(null);

  const { placed, totalRows } = buildTiles(items.length);

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
      {/* Mosaic collage */}
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gridTemplateRows: `repeat(${totalRows}, ${rowHeight}px)`,
          gap: GAP,
        }}
      >
        {placed.map(({ index, tile }) => {
          const item = items[index];
          return (
            <motion.button
              key={item.title}
              type="button"
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              onClick={() => setActive(index)}
              aria-label={`Open ${item.title}`}
              className="group relative min-w-0 cursor-zoom-in overflow-hidden"
              style={{
                gridColumn: `${tile[0]} / span ${tile[1]}`,
                gridRow: `${tile[2]} / span ${tile[3]}`,
                background: "#eee",
              }}
            >
              <Image
                src={srcOf(item.image)}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 60vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
            </motion.button>
          );
        })}
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
