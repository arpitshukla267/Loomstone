"use client";

import { Reveal, FadeImage } from "@/components/ui/reveal";

const COMPANY = "Loomstone";
const OWNER = "Pawan Yadav";
const founderImage = "/founder.jpeg";
const TAGLINE = "Crafted for Excellence";

const QUOTE = `We believe exceptional hospitality is shaped by thoughtful details. Flooring is more than a surface; it is a defining design element that enhances environments, enriches guest experiences, and contributes to the enduring identity of a space.`;

export default function FounderSection() {
  return (
    <section className="bg-[#FFFCF4] py-12 sm:py-14 lg:py-[6vw] 3xl:py-[5vw]">
      <div className="mx-auto grid max-w-[90vw] items-center gap-10 sm:max-w-[85vw] lg:max-w-[80vw] lg:grid-cols-[24vw_1fr] lg:gap-[6vw] 3xl:max-w-[76vw] 3xl:grid-cols-[22vw_1fr] 3xl:gap-[7vw]">
        {/* Left: Founder photo */}
        <Reveal
          y={32}
          className="mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:mx-0 lg:max-w-none"
        >
          <div className="relative h-[320px] w-full overflow-hidden rounded-[28px] border-[5px] border-white bg-[#2a2a6b] shadow-[0_16px_40px_rgba(42,42,107,0.25)] sm:h-[380px] sm:rounded-[36px] sm:border-[6px] lg:h-[27vw] 3xl:h-[25vw]">
            <FadeImage
              src={founderImage}
              alt={`${OWNER}, founder of ${COMPANY}`}
              fill
              sizes="(min-width: 1024px) 24vw, 380px"
              className="object-cover object-top"
            />
          </div>
        </Reveal>

        {/* Right: Quote, tagline, name, designation */}
        <Reveal delay={150} className="text-[#2a2a6b]">
          <span
            aria-hidden
            className="font-manrope -ml-1 block h-10 text-[84px] font-bold leading-[0.9] text-[#e8a21c] sm:-ml-2 sm:h-14 sm:text-[120px] lg:h-[4vw] lg:text-[7vw]"
          >
            &ldquo;
          </span>

          <p className="font-manrope mt-4 max-w-none whitespace-pre-line text-[14px] font-medium leading-[1.6] sm:mt-6 sm:text-[16px] md:text-[19px] lg:text-[1.3vw] 3xl:text-[1.2vw]">
            {QUOTE}
          </p>

          <p className="font-manrope mt-5 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#e8a21c] sm:text-sm lg:mt-[1.8vw] lg:text-[0.9vw]">
            {TAGLINE}
          </p>

          <div className="my-6 h-[2px] w-20 bg-[#e8a21c] sm:my-8 sm:w-24 lg:my-[2vw] lg:w-[6vw]" />

          <h3 className="font-manrope text-[20px] font-bold leading-tight sm:text-[22px] lg:text-[1.6vw]">
            Mr. {OWNER}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#e8a21c] sm:text-sm lg:text-[0.9vw]">
            Founder &amp; Owner, {COMPANY}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
