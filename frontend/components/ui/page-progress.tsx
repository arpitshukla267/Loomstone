"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PageProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete and hide progress bar when navigation finishes
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept in-app link clicks for immediate feedback
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

      // Check if it's an internal link
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) {
          // If navigating to a different pathname or search
          if (
            url.pathname !== window.location.pathname ||
            url.search !== window.location.search
          ) {
            setLoading(true);
            setProgress(35);

            const timer = setTimeout(() => setProgress(80), 200);
            return () => clearTimeout(timer);
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
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
    >
      {/* Top Progressive Line (Without Shadow) */}
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
