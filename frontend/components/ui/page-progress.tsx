"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { preloadRoute } from "@/lib/asset-preloader";

export function PageProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Show startup loader on initial mount
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(20);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const isNavigatingRef = useRef(false);
  const isInitialMountRef = useRef(true);

  // Helper to complete progress and smoothly fade out
  const completeAndHide = () => {
    setProgress(100);
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      const hideTimer = setTimeout(() => {
        setLoading(false);
        setIsFadingOut(false);
        setProgress(0);
        isNavigatingRef.current = false;
      }, 350);
      return () => clearTimeout(hideTimer);
    }, 200);
    return () => clearTimeout(fadeTimer);
  };

  // 1. Initial Startup Loader: Preload critical assets for current route
  useEffect(() => {
    if (!isInitialMountRef.current) return;
    isInitialMountRef.current = false;

    let cancelled = false;

    // Simulate initial responsive tick
    const tick = setTimeout(() => {
      if (!cancelled) setProgress((prev) => Math.max(prev, 35));
    }, 150);

    // Preload background assets for initial route (Hero images & Why Loomstone video on '/', etc.)
    preloadRoute(
      pathname,
      (pct) => {
        if (!cancelled) setProgress((prev) => Math.max(prev, pct));
      },
      3200
    ).finally(() => {
      if (!cancelled) {
        completeAndHide();
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(tick);
    };
  }, []);

  // 2. Route Change: When pathname or searchParams change after navigation
  useEffect(() => {
    // Skip initial mount since handled above
    if (isInitialMountRef.current) return;

    if (loading || isNavigatingRef.current) {
      let cancelled = false;

      // Keep loader on screen while preloading the new page's background assets
      preloadRoute(
        pathname,
        (pct) => {
          if (!cancelled) setProgress((prev) => Math.max(prev, pct));
        },
        2500
      ).finally(() => {
        if (!cancelled) {
          completeAndHide();
        }
      });

      return () => {
        cancelled = true;
      };
    }
  }, [pathname, searchParams]);

  // 3. Intercept in-app link clicks for immediate responsive feedback
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore anchor links, new tabs, external links, and tel/mailto
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) {
          if (
            url.pathname !== window.location.pathname ||
            url.search !== window.location.search
          ) {
            isNavigatingRef.current = true;
            setIsFadingOut(false);
            setLoading(true);
            setProgress(30);

            // Progressive increment while route transition is prepared
            setTimeout(() => {
              if (isNavigatingRef.current) {
                setProgress((prev) => Math.max(prev, 55));
              }
            }, 180);
          }
        }
      } catch {
        // invalid URL, ignore
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FFFCF4]/98 md:bg-[#FFFCF4]/95 backdrop-blur-sm transition-opacity duration-300 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Progressive Line */}
      <div className="fixed top-0 left-0 right-0 z-[100000] h-[3.5px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gold transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Center Blinking Vertical Logo */}
      <div className="relative flex flex-col items-center justify-center px-6">
        <div className="animate-pulse duration-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-vertical.png"
            alt="Loomstone"
            className="h-28 w-auto object-contain md:h-36 drop-shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
