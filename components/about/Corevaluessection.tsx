"use client";

import { Hammer, Leaf, Lightbulb, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const NAVY = "#2a2a6b";
const GOLD = "#e8a21c";

interface CoreValue {
  title: string[];
  lines: string[];
  text: string;
  Icon: LucideIcon;
}

const coreValues: CoreValue[] = [
  {
    title: ["TIMELESS", "CRAFTSMANSHIP"],
    lines: [
      "Every tuft is woven by",
      "hand into patterns built",
      "to stay beautiful",
      "for years.",
    ],
    text: "Every tuft is woven by hand into patterns built to stay beautiful for years.",
    Icon: Hammer,
  },
  {
    title: ["INNOVATIVE", "APPROACH"],
    lines: [
      "We blend wool with modern",
      "fibers and fresh designs,",
      "made to fit your",
      "space perfectly.",
    ],
    text: "We blend wool with modern fibers and fresh designs, made to fit your space perfectly.",
    Icon: Lightbulb,
  },
  {
    title: ["SUSTAINABLE", "PRACTICES"],
    lines: [
      "We source materials with",
      "care and weave in ways",
      "that cut waste and",
      "respect the planet.",
    ],
    text: "We source materials with care and weave in ways that cut waste and respect the planet.",
    Icon: Leaf,
  },
];

/* ---------------- geometry ---------------- */

const CENTER = { x: 450, y: 440 };
const DIST = 300; // centre -> node
const R = 118; // white circle radius
const RING_ANGLES = [-90, 30, 150]; // top, bottom-right, bottom-left

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (cx: number, cy: number, r: number, a: number) => ({
  x: cx + r * Math.cos(rad(a)),
  y: cy + r * Math.sin(rad(a)),
});
const arc = (cx: number, cy: number, r: number, a1: number, a2: number) => {
  const s = pt(cx, cy, r, a1);
  const e = pt(cx, cy, r, a2);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
};

function ValueNode({ value, angle }: { value: CoreValue; angle: number }) {
  const node = pt(CENTER.x, CENTER.y, DIST, angle);
  // direction from the node towards the centre
  const theta =
    (Math.atan2(CENTER.y - node.y, CENTER.x - node.x) * 180) / Math.PI;
  const dir = { x: Math.cos(rad(theta)), y: Math.sin(rad(theta)) };
  const perp = { x: -dir.y, y: dir.x };

  const base = { x: node.x + dir.x * 124, y: node.y + dir.y * 124 };
  const tip = { x: node.x + dir.x * 152, y: node.y + dir.y * 152 };
  const pointer = `${base.x + perp.x * 32},${base.y + perp.y * 32} ${tip.x},${tip.y} ${base.x - perp.x * 32},${base.y - perp.y * 32}`;

  const { Icon } = value;
  const titleStart = node.y - 12;

  return (
    <g>
      {/* thin outer arc (far side) */}
      <path
        d={arc(node.x, node.y, 138, theta + 105, theta + 255)}
        fill="none"
        stroke={NAVY}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* thick crescent (centre side) + pointer */}
      <path
        d={arc(node.x, node.y, 128, theta - 58, theta + 58)}
        fill="none"
        stroke={GOLD}
        strokeWidth={22}
      />
      <polygon points={pointer} fill={GOLD} />

      {/* white circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={R}
        fill="#ffffff"
        filter="url(#cvShadow)"
      />

      {/* icon */}
      <Icon
        x={node.x - 20}
        y={node.y - 84}
        width={40}
        height={40}
        stroke={NAVY}
        strokeWidth={1.4}
      />

      {/* title */}
      {value.title.map((t, i) => (
        <text
          key={t}
          x={node.x}
          y={titleStart + i * 19}
          textAnchor="middle"
          fontSize={16}
          fontWeight={800}
          letterSpacing={0.5}
          fill={NAVY}
          className="font-manrope"
        >
          {t}
        </text>
      ))}

      {/* description */}
      {value.lines.map((l, i) => (
        <text
          key={l}
          x={node.x}
          y={titleStart + 18 + 22 + i * 15}
          textAnchor="middle"
          fontSize={11.5}
          fill="#475569"
          className="font-poppins"
        >
          {l}
        </text>
      ))}
    </g>
  );
}

export default function CoreValuesSection() {
  return (
    <section className="mx-auto max-w-[90vw] py-16">

      {/* ---------- Desktop / tablet diagram ---------- */}
      <Reveal>
        <div className="mx-auto hidden max-w-[820px] md:block">
          <svg
            viewBox="0 0 900 760"
            className="h-auto w-full"
            role="img"
            aria-label="Core values: timeless craftsmanship, innovative approach, sustainable practices"
          >
            <defs>
              <filter
                id="cvShadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="10"
                  floodColor={NAVY}
                  floodOpacity="0.18"
                />
              </filter>
            </defs>

            {/* centre dotted ring */}
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={108}
              fill="none"
              stroke="#94a3b8"
              strokeWidth={4}
              strokeDasharray="0 9"
              strokeLinecap="round"
            />
            <text
              x={CENTER.x}
              y={CENTER.y - 4}
              textAnchor="middle"
              fontSize={36}
              fontWeight={800}
              fill={NAVY}
              className="font-manrope"
            >
              CORE
            </text>
            <text
              x={CENTER.x}
              y={CENTER.y + 38}
              textAnchor="middle"
              fontSize={36}
              fontWeight={800}
              fill={NAVY}
              className="font-manrope"
            >
              VALUES
            </text>

            {/* small connector markers on the dotted ring */}
            {RING_ANGLES.map((a) => {
              const node = pt(CENTER.x, CENTER.y, DIST, a);
              const toNode =
                (Math.atan2(node.y - CENTER.y, node.x - CENTER.x) * 180) /
                Math.PI;
              const m = pt(CENTER.x, CENTER.y, 108, toNode);
              return (
                <g key={a}>
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={10}
                    fill="#ffffff"
                    stroke={NAVY}
                    strokeWidth={2}
                  />
                  <circle cx={m.x} cy={m.y} r={4} fill={GOLD} />
                </g>
              );
            })}

            {coreValues.map((v, i) => (
              <ValueNode
                key={v.title.join(" ")}
                value={v}
                angle={RING_ANGLES[i]}
              />
            ))}
          </svg>
        </div>
      </Reveal>

      {/* ---------- Mobile fallback ---------- */}
      <div className="mx-auto grid max-w-[420px] gap-5 md:hidden">
        {coreValues.map((v, i) => (
          <Reveal key={v.title.join(" ")} delay={i * 100}>
            <article className="relative rounded-3xl border-l-4 border-[#e8a21c] bg-white px-6 py-7 text-center shadow-[0_10px_30px_rgba(42,42,107,0.12)]">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f9fc]">
                <v.Icon className="h-7 w-7 text-[#2a2a6b]" strokeWidth={1.5} />
              </div>
              <h3 className="font-manrope mb-2 text-lg font-extrabold uppercase tracking-wide text-[#2a2a6b]">
                {v.title.join(" ")}
              </h3>
              <p className="text-[13px] leading-relaxed">{v.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
