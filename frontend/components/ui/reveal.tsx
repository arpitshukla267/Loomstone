"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image, { type ImageProps } from "next/image";

// Soft ease-out: starts gently, settles slowly (no sudden "snap").
const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/**
 * Fades + slides its children in once they scroll into view (plays once).
 * Uses inline styles for the transition so it works regardless of Tailwind setup.
 *  - y: how far (px) the element travels up while appearing
 *  - duration: ms
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 900,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setReduceMotion(true);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
        transition: reduceMotion
          ? "none"
          : `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/**
 * next/image that fades in once it has loaded, so images don't pop in suddenly.
 */
export function FadeImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Handles images that finish loading before hydration.
  const setRef = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <Image
      {...props}
      ref={setRef}
      onLoad={(e) => {
        setLoaded(true);
        props.onLoad?.(e);
      }}
      style={{
        ...props.style,
        opacity: loaded ? 1 : 0,
        transition: `opacity 1000ms ${EASE}, transform 700ms ease`,
      }}
    />
  );
}

export default Reveal;
