"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface LensProps {
  src: string;
  alt?: string;
  /** Real magnification: 2 = the lens shows the image at 2x size */
  zoomFactor?: number;
  lensSize?: number;
  className?: string;
}

export function Lens({
  src,
  alt = "",
  zoomFactor = 3,
  lensSize = 180,
  className = "",
}: LensProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // null = pointer is not over the image
  const [pointer, setPointer] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  // Preload zoom image
  useEffect(() => {
    if (typeof window !== "undefined" && src) {
      const img = new window.Image();
      img.src = src;
    }
  }, [src]);

  const update = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPointer({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    });
  };

  const half = lensSize / 2;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ cursor: "zoom-in" }}
      onPointerEnter={update}
      onPointerMove={update}
      onPointerLeave={() => setPointer(null)}
    >
      {/* Main Image */}
      <Image
        src={src}
        alt={alt}
        draggable={false}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="block object-cover"
      />

      {/* Zoom Lens */}
      {pointer && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 30,
            width: lensSize,
            height: lensSize,
            transform: `translate(${pointer.x - half}px, ${pointer.y - half}px)`,
            borderRadius: "999px",
            overflow: "hidden",
            pointerEvents: "none",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
            backgroundColor: "#111",
            backgroundImage: `url("${src}")`,
            backgroundRepeat: "no-repeat",
            // The whole image scaled up by zoomFactor, in real pixels
            backgroundSize: `${pointer.w * zoomFactor}px ${
              pointer.h * zoomFactor
            }px`,
            // Shift so the point under the cursor sits at the lens centre
            backgroundPosition: `${half - pointer.x * zoomFactor}px ${
              half - pointer.y * zoomFactor
            }px`,
          }}
        />
      )}
    </div>
  );
}
