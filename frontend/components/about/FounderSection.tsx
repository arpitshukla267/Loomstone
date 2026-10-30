"use client";

import { Reveal, FadeImage } from "@/components/ui/reveal";

const COMPANY = "Loomstone";
const OWNER = "Pawan Yadav";
const founderImage = "/founder.jpeg";

const QUOTE = `At Loomstone, our vision is to bring together design excellence, skilled craftsmanship, and enduring quality to create flooring solutions that inspire, perform, and stand the test of time. Every project is an opportunity to transform a space with purpose, precision, and a lasting sense of distinction.`;

const dots =
  "bg-[radial-gradient(#e8a21c_1.4px,transparent_1.4px)] [background-size:14px_14px]";

export default function FounderSection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f9fc] py-12 sm:py-14 lg:py-24 3xl:py-32 4xl:py-40">
      {/* dotted decoration – top left */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -left-4 -top-4 h-40 w-52 opacity-40 [mask-image:linear-gradient(135deg,black,transparent_70%)] sm:h-56 sm:w-72 3xl:h-72 3xl:w-96 ${dots}`}
      />
      {/* dotted decoration – bottom */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -bottom-4 left-0 h-28 w-full opacity-30 [mask-image:linear-gradient(to_top,black,transparent_80%)] sm:h-40 3xl:h-52 ${dots}`}
      />

      {/* navy slanted panel behind the quote (desktop) */}
      <div
        aria-hidden
        className="absolute inset-y-10 left-[33.5%] right-0 hidden bg-[#2a2a6b] lg:block 3xl:inset-y-14 3xl:left-[calc(50%-520px)] 4xl:inset-y-16 4xl:left-[calc(50%-640px)] [clip-path:polygon(0_12%,100%_0,100%_100%,0_88%)]"
      />
      {/* small navy strip peeking on the left (desktop) */}
      <div
        aria-hidden
        className="absolute bottom-[20%] left-0 top-[22%] 2xl:bottom-[18%] 2xl:top-[18%] hidden w-24 bg-[#2a2a6b] lg:block 3xl:w-[max(6rem,calc(50%-640px))] 4xl:w-[max(6rem,calc(50%-780px))]"
      />

      <div className="relative mx-auto grid max-w-[90vw] items-center gap-0 sm:max-w-[85vw] lg:max-w-[1100px] 3xl:max-w-[1450px] 4xl:max-w-[1700px] lg:grid-cols-[400px_1fr] 3xl:grid-cols-[480px_1fr] 4xl:grid-cols-[540px_1fr] lg:gap-10 3xl:gap-16">
        {/* Founder photo card */}
        <Reveal
          y={32}
          className="relative z-10 mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:mx-0 lg:max-w-none lg:-ml-[107px] 3xl:-ml-[140px] 4xl:-ml-[160px]"
        >
          <div className="relative h-[320px] w-full overflow-hidden rounded-[28px] border-[5px] border-white bg-[#2a2a6b] shadow-[0_16px_40px_rgba(42,42,107,0.25)] sm:h-[380px] sm:rounded-[36px] sm:border-[6px] md:h-[460px] 3xl:h-[540px] 4xl:h-[620px]">
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
          className="-mt-10 rounded-2xl bg-[#2a2a6b] px-5 pb-8 pt-12 text-white sm:px-7 sm:pb-10 sm:pt-16 lg:mt-0 lg:-mr-[min(180px,7vw)] lg:rounded-none lg:bg-transparent lg:pl-10 lg:pr-6 lg:py-0 3xl:pl-14 3xl:pr-10"
        >
          <span
            aria-hidden
            className="font-manrope -ml-1 block h-10 text-[84px] font-bold leading-[0.9] text-[#e8a21c] sm:-ml-2 sm:h-14 sm:text-[120px] 3xl:h-16 3xl:text-[140px] 4xl:h-20 4xl:text-[170px]"
          >
            &ldquo;
          </span>

          <p className="font-manrope mt-4 max-w-none whitespace-pre-line text-[14px] font-medium leading-[1.6] sm:mt-6 sm:text-[16px] md:text-[19px] 3xl:text-[22px] 4xl:text-[25px]">
            {QUOTE}
          </p>

          <div className="my-6 h-[2px] w-20 bg-[#e8a21c] sm:my-8 sm:w-24 3xl:w-28 4xl:w-32" />

          <h3 className="font-manrope text-[20px] font-bold leading-tight sm:text-[22px] 3xl:text-[26px] 4xl:text-[30px]">
            Mr. {OWNER}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#e8a21c] sm:text-sm 4xl:text-base">
            Founder &amp; Owner, {COMPANY}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
