"use client";

import { Reveal, FadeImage } from "@/components/ui/reveal";

const COMPANY = "Loomstone";
const OWNER = "Pawan Yadav";
const founderImage = "/founder.jpeg";

const QUOTE = `I believe that exceptional spaces are created through thoughtful design and an uncompromising attention to detail. Flooring is far more than a surface beneath our feet; it shapes the atmosphere, influences how people experience a space, and contributes to its lasting identity.

At Loomstone, our vision is to bring together design excellence, skilled craftsmanship, and enduring quality to create flooring solutions that inspire, perform, and stand the test of time. Every project is an opportunity to transform a space with purpose, precision, and a lasting sense of distinction.`;

const dots =
  "bg-[radial-gradient(#e8a21c_1.4px,transparent_1.4px)] [background-size:14px_14px]";

export default function FounderSection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f9fc] py-16 lg:py-24 3xl:py-32 4xl:py-40">
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
        className="absolute inset-y-10 left-[33.5%] right-0 hidden bg-[#2a2a6b] lg:block [clip-path:polygon(0_12%,100%_0,100%_100%,0_88%)]"
      />
      {/* small navy strip peeking on the left (desktop) */}
      <div
        aria-hidden
        className="absolute bottom-[22%] left-0 top-[20%] hidden w-24 bg-[#2a2a6b] lg:block"
      />

      <div className="relative mx-auto grid max-w-[85vw] items-center gap-0 lg:max-w-[1100px] 3xl:max-w-[1450px] 4xl:max-w-[1700px] lg:grid-cols-[400px_1fr] 3xl:grid-cols-[480px_1fr] 4xl:grid-cols-[540px_1fr] lg:gap-10 3xl:gap-16">
        {/* Founder photo card */}
        <Reveal
          y={32}
          className="relative z-10 mx-auto w-full max-w-[380px] lg:mx-0 lg:max-w-none lg:-ml-[107px]"
        >
          <div className="relative h-[460px] w-full overflow-hidden rounded-[36px] border-[6px] border-white bg-[#2a2a6b] shadow-[0_16px_40px_rgba(42,42,107,0.25)] md:h-[560px] 3xl:h-[660px] 4xl:h-[760px]">
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
          className="-mt-10 rounded-2xl bg-[#2a2a6b] px-7 pb-10 pt-16 text-white lg:mt-0 lg:-mr-[min(180px,7vw)] lg:rounded-none lg:bg-transparent lg:pl-10 lg:pr-6 lg:py-20"
        >
          <span
            aria-hidden
            className="font-manrope block h-14 -ml-2 text-[120px] font-bold leading-[0.9] text-[#e8a21c]"
          >
            &ldquo;
          </span>

          <p className="font-manrope mt-6 max-w-none whitespace-pre-line text-[15px] font-medium leading-[1.6] md:text-[19px] 3xl:text-[22px] 4xl:text-[25px]">
            {QUOTE}
          </p>

          <div className="my-8 h-[2px] w-24 bg-[#e8a21c]" />

          <h3 className="font-manrope text-[22px] 3xl:text-[26px] 4xl:text-[30px] font-bold leading-tight">
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
