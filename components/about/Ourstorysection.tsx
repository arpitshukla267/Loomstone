"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const COMPANY = "Loomstone";
const carpetImage = "/carpet.jpeg";
const YEARS = "03";

/* shared look of the big number */
const digitBase: React.CSSProperties = {
  fontSize: "clamp(130px, 17vw, 250px)",
  lineHeight: 1,
  letterSpacing: "-0.04em",
};

export default function OurStorySection() {
  return (
    <section className="mx-auto grid max-w-[85vw] items-center gap-10 pb-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
      {/* ================= Big "03" filled with carpet image ================= */}
      <Reveal>
        <div className="flex min-h-[440px] flex-col items-center justify-center py-12 lg:min-h-[640px]">
          <div
            className="relative"
            style={{ filter: "drop-shadow(0 10px 22px rgba(42,42,107,0.18))" }}
          >
            {/* white outline layer (behind) */}
            <span
              aria-hidden
              className="font-manrope absolute left-0 top-0 select-none font-extrabold"
              style={{
                ...digitBase,
                color: "#ffffff",
                WebkitTextStroke: "12px #ffffff",
                strokeLinejoin: "round",
              }}
            >
              {YEARS}
            </span>

            {/* carpet image visible only through the digits */}
            <span
              className="font-manrope relative block select-none font-extrabold"
              style={{
                ...digitBase,
                color: "transparent",
                backgroundImage: `url(${carpetImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
              role="img"
              aria-label={`${YEARS} years of experience`}
            >
              {YEARS}
            </span>
          </div>

          <p className="relative z-10 mt-10 text-[11px] font-semibold tracking-[0.28em] text-[#2a2a6b] sm:text-xs">
            YEARS OF EXPERIENCE
          </p>
        </div>
      </Reveal>

      {/* ================= Story ================= */}
      <div>
        <Reveal>
          <span className="flex items-center gap-3.5 text-[10px] font-semibold tracking-[0.18em] text-[#e8a21c]">
            OUR STORY
            <i className="h-px w-14 shrink-0 bg-[#e8a21c]/50" />
          </span>
          <h2
            className="font-manrope mb-5 mt-4 text-[32px] font-semibold leading-[1.15] text-[#2a2a6b] md:text-[44px]"
          >
            Carpets Designed as the{" "}
            <span className="text-[#e8a21c]">Foundation of Every Room</span>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="space-y-4 text-[15px] leading-[1.8] text-slate-600">
            <p>
              {COMPANY} began with a clear purpose: every home, hotel and
              commercial space deserves a carpet that is luxurious, durable and
              made with care. Inspired by the Axminster tradition of woven
              craftsmanship, we bring together timeless carpet-weaving technique
              and modern innovation.
            </p>
            <p>
              Each carpet is crafted by weaving individual tufts of a wool and
              nylon blend through a backing, giving you rich textures, intricate
              patterns that stay beautiful and a finish that lasts for decades
              &mdash; whether you choose a traditional design, a contemporary
              style or a fully bespoke pattern.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2.5 rounded-lg bg-[#2a2a6b] px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#e8a21c] hover:text-[#2a2a6b]"
          >
            Get in touch <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
