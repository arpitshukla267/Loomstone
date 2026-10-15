"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
// @ts-ignore
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { feature } from "topojson-client";
import { geoMercator } from "d3-geo";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/* ------------------------------------------------------------------ */
/* Theme (matches GlobalReachSection: navy / gold / ash)               */
/* ------------------------------------------------------------------ */
const COLORS = {
  navy: "#2A2967",
  gold: "#C9A24B",
  land: "#d6dde3",
  landHover: "#c9d2d9",
  landStroke: "#eef2f5",
  labelText: "#2A2967",
  halo: "#ffffff",
};

export type LabelSide = "left" | "right" | "top" | "bottom";

export interface Destination {
  name: string;
  lon: number;
  lat: number;
  side: LabelSide;
  origin?: boolean;
}

export const defaultDestinations: Destination[] = [
  { name: "India", lon: 78.9, lat: 22, side: "left", origin: true },
  { name: "Nepal", lon: 84, lat: 28.4, side: "top" },
  { name: "Sri Lanka", lon: 80.7, lat: 7.9, side: "bottom" },
  { name: "Middle East", lon: 47, lat: 25, side: "left" },
  { name: "Australia", lon: 134, lat: -25, side: "top" },
  { name: "USA", lon: -98, lat: 39, side: "top" },
];

const PLANE_DURATION = "3.5s";
const PLANE_START_DELAY = 500; // ms after the map enters the viewport
const PLANE_STAGGER = 350; // ms between each plane departing

type WorldMapProps = {
  destinations?: Destination[];
  compact?: boolean;
  interactive?: boolean;
};

// begin="indefinite" -> does NOT auto-play on mount. Started manually via
// beginElement() once the map is in the viewport.
function PlaneMarker({
  pathD,
  scale,
  onMotionRef,
  onFadeRef,
}: {
  pathD: string;
  scale: number;
  onMotionRef: (el: SVGAnimateMotionElement | null) => void;
  onFadeRef: (el: SVGAnimateElement | null) => void;
}) {
  return (
    <g opacity={0}>
      <animateMotion
        ref={onMotionRef}
        dur={PLANE_DURATION}
        begin="indefinite"
        fill="freeze"
        rotate="auto"
        path={pathD}
      />
      <animate
        ref={onFadeRef}
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.08;0.85;1"
        dur={PLANE_DURATION}
        begin="indefinite"
        fill="freeze"
      />
      <g transform={`scale(${scale})`}>
        <path
          d="M 10 0 L 2 -2 L -5 -7 L -7 -6 L -3 -1.5 L -11 -2.5 L -13 -1 L -4 0 L -13 1 L -11 2.5 L -3 1.5 L -7 6 L -5 7 L 2 2 Z"
          fill={COLORS.navy}
          stroke="#ffffff"
          strokeWidth={0.8}
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

export function WorldMap({
  destinations = defaultDestinations,
  compact = false,
  interactive = true,
}: WorldMapProps) {
  const [geographies, setGeographies] =
    useState<FeatureCollection<Geometry> | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const motionRefs = useRef<(SVGAnimateMotionElement | null)[]>([]);
  const fadeRefs = useRef<(SVGAnimateElement | null)[]>([]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((topology: Topology) => {
        if (cancelled) return;
        const objectName = Object.keys(topology.objects)[0];
        const geo = feature(
          topology,
          topology.objects[objectName] as GeometryCollection,
        ) as unknown as FeatureCollection<Geometry>;
        setGeographies(geo);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // The data now spans USA (-98°) to Australia (134°), so the view is
  // wider than before. Centered around lon 18° to fit both edges.
  // Extra margin around the continents so the edge fade has room to work
  // (no land gets chopped by the viewBox before it has faded out).
  const WIDTH = isDesktop ? 1000 : 680;
  const HEIGHT = isDesktop ? 560 : 400;
  const center: [number, number] = isDesktop ? [18, 14] : [18, 12];
  const scale = compact ? (isDesktop ? 130 : 100) : isDesktop ? 166 : 116;
  const uiScale = isDesktop ? 1 : 1.35;

  const projection = useMemo(
    () =>
      geoMercator()
        .scale(scale)
        .center(center)
        .translate([WIDTH / 2, HEIGHT / 2]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scale, center[0], center[1], WIDTH, HEIGHT],
  );

  const origin = destinations.find((d) => d.origin) ?? destinations[0];
  const originXY = projection([origin.lon, origin.lat])!;

  const routes = useMemo(() => {
    return destinations
      .filter((d) => d !== origin)
      .map((dest) => {
        const [x2, y2] = projection([dest.lon, dest.lat])!;
        const [x1, y1] = originXY;
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - Math.min(dist * 0.28, 120);
        return {
          ...dest,
          x: x2,
          y: y2,
          d: `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`,
        };
      });
  }, [destinations, origin, projection, originXY]);

  useEffect(() => {
    if (!isInView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        routes.forEach((_, idx) => {
          timers.push(
            setTimeout(() => {
              motionRefs.current[idx]?.beginElement();
              fadeRefs.current[idx]?.beginElement();
            }, idx * PLANE_STAGGER),
          );
        });
      }, PLANE_START_DELAY),
    );

    return () => timers.forEach(clearTimeout);
  }, [isInView, routes]);

  // Label placement relative to a pin, per side
  const labelProps = (side: LabelSide, x: number, y: number, r: number) => {
    const gap = r + 6 * uiScale;
    switch (side) {
      case "left":
        return { x: x - gap, y: y + 3.5 * uiScale, anchor: "end" as const };
      case "right":
        return { x: x + gap, y: y + 3.5 * uiScale, anchor: "start" as const };
      case "top":
        return { x, y: y - gap, anchor: "middle" as const };
      case "bottom":
        return { x, y: y + gap + 8 * uiScale, anchor: "middle" as const };
    }
  };

  const renderLabel = (d: Destination, x: number, y: number, r: number) => {
    const p = labelProps(d.side, x, y, r);
    const isActive = active === d.name;
    return (
      <text
        x={p.x}
        y={p.y}
        textAnchor={p.anchor}
        fontSize={(d.origin ? 11.5 : 10.5) * uiScale}
        fontWeight={d.origin ? 700 : 600}
        letterSpacing="0.02em"
        fill={isActive ? COLORS.gold : COLORS.labelText}
        stroke={COLORS.halo}
        strokeWidth={3 * uiScale}
        strokeLinejoin="round"
        paintOrder="stroke"
        style={{ transition: "fill 0.3s", pointerEvents: "none" }}
      >
        {d.name}
      </text>
    );
  };

  return (
    <div
      ref={containerRef}
      className="h-full w-full min-h-[300px] select-none outline-none [&_*]:outline-none [&_svg]:select-none"
      style={{
        // Soft fade on all four edges: land dissolves into the background
        // instead of ending in a hard line.
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, #000 22%, #000 78%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 24%, #000 80%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, #000 22%, #000 78%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 24%, #000 80%, transparent 100%)",
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <ComposableMap
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        projection="geoMercator"
        projectionConfig={{ scale, center }}
        className="h-full w-full"
      >
        {geographies && (
          <Geographies geography={geographies}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  tabIndex={-1}
                  fill={COLORS.land}
                  stroke={COLORS.landStroke}
                  strokeWidth={0.6}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      outline: "none",
                      fill: interactive ? COLORS.landHover : COLORS.land,
                    },
                    pressed: { outline: "none" },
                    // This was missing: double-click focuses the path and
                    // the browser drew its default black focus box.
                    focus: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        )}

        {/* Dashed routes — dashes flow continuously once in view */}
        <g>
          {routes.map((route) => {
            const isActive = active === route.name;
            return (
              <path
                key={`line-${route.name}`}
                d={route.d}
                fill="none"
                stroke={isActive ? COLORS.gold : COLORS.navy}
                strokeWidth={(isActive ? 1.8 : 1.3) * uiScale}
                strokeDasharray={`${4 * uiScale} ${3 * uiScale}`}
                strokeLinecap="round"
                opacity={0.85}
                suppressHydrationWarning
              >
                {isInView && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from={`${14 * uiScale}`}
                    to="0"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
            );
          })}
        </g>

        {/* Planes */}
        {isInView && (
          <g>
            {routes.map((route, idx) => (
              <PlaneMarker
                key={`plane-${route.name}`}
                pathD={route.d}
                scale={uiScale * 0.9}
                onMotionRef={(el) => {
                  motionRefs.current[idx] = el;
                }}
                onFadeRef={(el) => {
                  fadeRefs.current[idx] = el;
                }}
              />
            ))}
          </g>
        )}

        {/* Destination pins + labels */}
        {routes.map((dest) => {
          const r = 4.5 * uiScale;
          const isActive = active === dest.name;
          return (
            <g
              key={dest.name}
              onMouseEnter={
                interactive ? () => setActive(dest.name) : undefined
              }
              onMouseLeave={interactive ? () => setActive(null) : undefined}
              style={{ cursor: interactive ? "pointer" : "default" }}
            >
              <Marker coordinates={[dest.lon, dest.lat]}>
                <circle
                  r={r}
                  fill={isActive ? COLORS.gold : COLORS.navy}
                  stroke="#ffffff"
                  strokeWidth={1.5 * uiScale}
                  style={{ transition: "fill 0.3s" }}
                />
              </Marker>
              {renderLabel(dest, dest.x, dest.y, r)}
            </g>
          );
        })}

        {/* Origin */}
        <Marker coordinates={[origin.lon, origin.lat]}>
          <circle
            r={6.5 * uiScale}
            fill={COLORS.navy}
            stroke="#ffffff"
            strokeWidth={2 * uiScale}
          />
          <circle r={2.2 * uiScale} />
        </Marker>
        {renderLabel(origin, originXY[0], originXY[1], 6.5 * uiScale)}
      </ComposableMap>
    </div>
  );
}

export default WorldMap;
