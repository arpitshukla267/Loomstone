"use client";

import Image from "next/image";
import { Check, Eye, Flag } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const carpetImage = "/inventory.png";

const visionPoints = [
  "Pairing the richness of wool with the resilience of modern fibers",
  "Making bespoke, high-performance carpets the first choice for every space",
];
const missionPoints = [
  "Offering traditional and contemporary designs, or fully bespoke patterns",
  "Using responsibly sourced materials and low-waste manufacturing",
];

const vision = {
  title: "Our Vision",
  text: "To be the most trusted name in custom carpets, bringing luxury, comfort and lasting design to every space.",
  points: visionPoints,
};
const mission = {
  title: "Our Mission",
  text: "To create durable, beautiful and sustainable carpets tailored to every client’s interiors.",
  points: missionPoints,
};

function Points({
  points,
  iconClass,
}: {
  points: string[];
  iconClass: string;
}) {
  return (
    <ul className="mt-4 space-y-2">
      {points.map((t) => (
        <li
          key={t}
          className="flex items-start gap-2.5 text-[13px] leading-snug"
        >
          <Check size={14} className={`mt-[2px] shrink-0 ${iconClass}`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Badge({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={style}
      className={`absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[7px] border-white shadow-[0_10px_28px_rgba(42,42,107,0.25)] ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

export default function VisionMissionSection() {
  return (
    <section className="bg-[#f4f9fc] py-16 px-4 md:px-0">
      <div className="mx-auto max-w-full">
        {/* ================= Desktop ================= */}
        <Reveal>
          <div className="relative hidden h-[780px] overflow-hidden bg-white shadow-[0_12px_32px_rgba(42,42,107,0.08)] lg:block">
            {/* Title */}
            <div className="absolute left-[7%] top-[5%] z-10">
              <h2
                className="font-manrope text-[52px] font-bold leading-[1.1] text-[#2a2a6b]"
              >
                Our Vision And Mission
              </h2>
              <div className="mt-4 flex items-center gap-1.5">
                <i className="h-[3px] w-6 bg-[#e8a21c]" />
                <i className="h-[3px] w-[260px] bg-[#2a2a6b]" />
              </div>
            </div>

            {/* Right image with diagonal left edge */}
            <div className="absolute inset-0 z-[1] [clip-path:polygon(77%_0,100%_0,100%_100%,46%_100%)]">
              <Image
                src={carpetImage}
                alt="Loomstone carpet in an elegant interior"
                fill
                sizes="(min-width: 1024px) 55vw, 90vw"
                className="object-cover"
              />
            </div>

            {/* Vision band */}
            <div className="absolute inset-x-0 top-[22%] h-[34%] bg-[#2a2a6b] text-white [clip-path:polygon(0_0,71.7%_0,61.1%_100%,0_100%)]">
              <div className="flex h-full max-w-[46%] flex-col justify-center pl-[7%]">
                <h3
                  className="font-manrope text-[38px] font-bold leading-tight"
                >
                  {vision.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/90">
                  {vision.text}
                </p>
                <Points points={vision.points} iconClass="text-[#e8a21c]" />
              </div>
            </div>

            {/* Mission band */}
            <div className="absolute inset-x-0 bottom-0 top-[64%] bg-[#e8a21c] text-[#2a2a6b] [clip-path:polygon(0_0,58.7%_0,47.5%_100%,0_100%)]">
              <div className="flex h-full max-w-[40%] flex-col justify-center pl-[4%]">
                <h3
                  className="font-manrope text-[34px] font-bold leading-tight"
                >
                  {mission.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed">
                  {mission.text}
                </p>
                <Points points={mission.points} iconClass="text-[#2a2a6b]" />
              </div>
            </div>

            {/* Round badges on the diagonal */}
            <Badge
              className="h-[130px] w-[130px] bg-[#2a2a6b] text-white"
              style={{ left: "65.5%", top: "40%" }}
            >
              <Eye size={52} strokeWidth={1.5} />
            </Badge>
            <Badge
              className="h-[118px] w-[118px] bg-[#e8a21c] text-[#2a2a6b]"
              style={{ left: "51.5%", top: "86%" }}
            >
              <Flag size={46} strokeWidth={1.5} />
            </Badge>
          </div>
        </Reveal>

        {/* ================= Mobile / Tablet ================= */}
        <div className="lg:hidden">
          <Reveal>
            <h2
              className="font-manrope text-[34px] font-bold leading-tight text-[#2a2a6b] md:text-5xl"
            >
              Our Vision And Mission
            </h2>
            <div className="mb-8 mt-3 flex items-center gap-1.5">
              <i className="h-[3px] w-6 bg-[#e8a21c]" />
              <i className="h-[3px] w-40 bg-[#2a2a6b]" />
            </div>
          </Reveal>

          <div className="relative mb-6 h-[260px] overflow-hidden rounded-2xl md:h-[340px]">
            <Image
              src={carpetImage}
              alt="Loomstone carpet in an elegant interior"
              fill
              sizes="90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#2a2a6b]/25" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Reveal className="h-full">
              <article className="relative h-full rounded-2xl bg-[#2a2a6b] p-7 text-white">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#2a2a6b]">
                  <Eye size={26} strokeWidth={1.6} />
                </span>
                <h3 className="font-manrope text-[28px] font-bold">
                  {vision.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/90">
                  {vision.text}
                </p>
                <Points points={vision.points} iconClass="text-[#e8a21c]" />
              </article>
            </Reveal>
            <Reveal delay={120} className="h-full">
              <article className="relative h-full rounded-2xl bg-[#e8a21c] p-7 text-[#2a2a6b]">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#e8a21c]">
                  <Flag size={26} strokeWidth={1.6} />
                </span>
                <h3 className="font-manrope text-[28px] font-bold">
                  {mission.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed">
                  {mission.text}
                </p>
                <Points points={mission.points} iconClass="text-[#2a2a6b]" />
              </article>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
