"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Horizontal swipe carousel for a product card.
 * - When the card enters the viewport (once) and has 2+ images, the first image
 *   slides ~70% to reveal the 2nd, then glides back.
 * - The user can swipe/scroll to the 2nd (and further) images manually.
 * - Dots show the total number of images and the active one.
 */
export function ProductImageCarousel({ images, alt }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  const hasMany = images.length > 1;

  /** Custom eased scroll (smoother than the browser's default smooth scroll) */
  const animateTo = useCallback(
    (to: number, duration: number, onDone?: () => void) => {
      const el = scrollerRef.current;
      if (!el) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const from = el.scrollLeft;
      const delta = to - from;
      const start = performance.now();
      el.style.scrollSnapType = "none"; // snap would fight the animation

      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        el.scrollLeft = from + delta * easeInOutCubic(t);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          rafRef.current = null;
          el.style.scrollSnapType = "";
          onDone?.();
        }
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [],
  );

  const cancelAnimation = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (scrollerRef.current) scrollerRef.current.style.scrollSnapType = "";
  }, []);

  useEffect(() => {
    if (!hasMany) return;
    const root = rootRef.current;
    const scroller = scrollerRef.current;
    if (!root || !scroller) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // If the user touches / scrolls themselves, stop the demo animation
    const stop = () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      cancelAnimation();
    };
    const userEvents = ["pointerdown", "touchstart", "wheel"] as const;
    userEvents.forEach((e) =>
      scroller.addEventListener(e, stop, { passive: true, once: true }),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || cancelled) return;
        observer.disconnect(); // play only once per card

        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            // glide forward to the 2nd image (full width)
            animateTo(scroller.clientWidth, 900, () => {
              if (cancelled) return;
              timers.push(
                setTimeout(() => {
                  if (cancelled) return;
                  // glide back to the first image
                  animateTo(0, 900);
                }, 600),
              );
            });
          }, 500),
        );
      },
      { threshold: 0.6 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      userEvents.forEach((e) => scroller.removeEventListener(e, stop));
      cancelAnimation();
    };
  }, [hasMany, animateTo, cancelAnimation]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  /* ---- Mouse drag support (touch swipe already works natively) ---- */
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !hasMany) return;
    const el = scrollerRef.current;
    if (!el) return;
    cancelAnimation();
    el.style.scrollSnapType = "none";
    drag.current = {
      down: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = scrollerRef.current;
    if (!d.down || !el) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5) d.moved = true;
    el.scrollLeft = d.startLeft - dx;
  };

  const endDrag = () => {
    const d = drag.current;
    const el = scrollerRef.current;
    if (!d.down || !el) return;
    d.down = false;
    const w = el.clientWidth;
    const startIndex = Math.round(d.startLeft / w);
    const delta = el.scrollLeft - d.startLeft;
    let target = startIndex;
    if (delta > w * 0.15) target = startIndex + 1;
    else if (delta < -w * 0.15) target = startIndex - 1;
    target = Math.max(0, Math.min(images.length - 1, target));
    animateTo(target * w, 450);
  };

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    animateTo(el.clientWidth * i, 600);
  };

  return (
    <div
      ref={rootRef}
      className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8e9e8]"
    >
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        className="flex h-full w-full select-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div
            key={src + i}
            className="relative h-full w-full shrink-0 snap-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {hasMany && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => goTo(i)}
              className={`pointer-events-auto h-1.5 rounded-full shadow-[0_0_4px_rgba(0,0,0,0.45)] transition-all duration-500 ease-out ${
                i === active ? "w-5 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
