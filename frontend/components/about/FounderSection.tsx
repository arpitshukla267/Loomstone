"use client";

import { Reveal, FadeImage } from "@/components/ui/reveal";

const COMPANY = "Loomstone";
const OWNER = "Pawan Yadav";
const founderImage = "/founder.jpeg";

const QUOTE = `Loomstone began with a clear purpose: every home, hotel and
                  commercial space deserves a carpet that is luxurious, durable
                  and made with care. Inspired by the Axminster tradition of
                  woven craftsmanship, we combine high-quality wool with
                  resilient fibers, offer bespoke designs, and build every
                  carpet with sustainability in mind.`;

const dots =
  "bg-[radial-gradient(#e8a21c_1.4px,transparent_1.4px)] [background-size:14px_14px]";

export default function FounderSection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f9fc] py-16 lg:py-24">
      {/* dotted decoration – top left */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -left-4 -top-4 h-56 w-72 opacity-40 [mask-image:linear-gradient(135deg,black,transparent_70%)] ${dots}`}
      />
      {/* dotted decoration – bottom */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -bottom-4 left-0 h-40 w-full opacity-30 [mask-image:linear-gradient(to_top,black,transparent_80%)] ${dots}`}
      />

      {/* navy slanted panel behind the quote (desktop) */}
      <div
        aria-hidden
        className="absolute inset-y-10 left-[34%] right-0 hidden bg-[#2a2a6b] lg:block [clip-path:polygon(0_12%,100%_0,100%_100%,0_88%)]"
      />
      {/* small navy strip peeking on the left (desktop) */}
      <div
        aria-hidden
        className="absolute bottom-[22%] left-0 top-[20%] hidden w-24 bg-[#2a2a6b] lg:block"
      />

      <div className="relative mx-auto grid max-w-[85vw] items-center gap-0 lg:max-w-[1100px] lg:grid-cols-[400px_1fr] lg:gap-10">
        {/* Founder photo card */}
        <Reveal
          y={32}
          className="relative z-10 mx-auto w-full max-w-[380px] lg:mx-0 lg:max-w-none lg:-ml-[106px]"
        >
          <div className="relative h-[460px] w-full overflow-hidden rounded-[36px] border-[6px] border-white bg-[#2a2a6b] shadow-[0_16px_40px_rgba(42,42,107,0.25)] md:h-[560px]">
            <FadeImage
              src={founderImage}
              alt={`${OWNER}, founder of ${COMPANY}`}
              fill
              sizes="(min-width: 1024px) 400px, 380px"
              className="object-cover object-top"
            />
          </div>
        </Reveal>

        {/* Quote */}
        <Reveal
          delay={150}
          className="-mt-10 rounded-2xl bg-[#2a2a6b] px-7 pb-10 pt-16 text-white lg:mt-0 lg:rounded-none lg:bg-transparent lg:px-10 lg:py-20"
        >
          <span
            aria-hidden
            className="font-manrope block h-14 -ml-2 text-[120px] font-bold leading-[0.9] text-[#e8a21c]"
          >
            &ldquo;
          </span>

          <p
            className="font-manrope mt-6 max-w-[780px] text-[15px] font-medium leading-[1.6] md:text-[19px]"
          >
            {QUOTE}
          </p>

          <div className="my-8 h-[2px] w-24 bg-[#e8a21c]" />

          <h3
            className="font-manrope text-[22px] font-bold leading-tight"
          >
            Mr. {OWNER}
          </h3>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-[#e8a21c]">
            Founder &amp; Owner, {COMPANY}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
