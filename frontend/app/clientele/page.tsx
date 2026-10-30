"use client";

import { Quote } from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";

const clients = [
  { name: "Leela", logo: "/clients/leela.webp" },
  { name: "Marriott Hotels", logo: "/clients/marriott.webp" },
  { name: "ITC Hotels", logo: "/clients/itc.png" },
  { name: "Hilton Hotels & Resorts", logo: "/clients/hilton.webp" },
  { name: "Hyatt Regency", logo: "/clients/hyatt.png" },
  { name: "DLF Hospitality", logo: "/clients/dlf.webp" },
  { name: "FCML India", logo: "/clients/fcml.png" },
  { name: "Airtel", logo: "/clients/airtel.webp" },
  //   { name: "The Executive Centre", logo: "/clients/tec.jpeg" },
];

// Placeholders – replace with real testimonials
const testimonials = [
  {
    text: "Testimonial text goes here.",
    name: "Client Name",
    designation: "Designation",
    company: "Company",
  },
  {
    text: "Testimonial text goes here.",
    name: "Client Name",
    designation: "Designation",
    company: "Company",
  },
  {
    text: "Testimonial text goes here.",
    name: "Client Name",
    designation: "Designation",
    company: "Company",
  },
  {
    text: "Testimonial text goes here.",
    name: "Client Name",
    designation: "Designation",
    company: "Company",
  },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <article className="flex min-h-[260px] w-[85vw] shrink-0 flex-col justify-between rounded-[20px] border border-line bg-white p-6 sm:w-[420px] md:p-8 lg:w-[400px] 3xl:min-h-[300px] 3xl:w-[480px] 3xl:p-10 4xl:min-h-[340px] 4xl:w-[560px] 4xl:p-12">
      <div>
        <Quote
          size={28}
          className="fill-gold text-gold 3xl:h-8 3xl:w-8 4xl:h-10 4xl:w-10"
        />
        <p className="mt-5 text-[15px] leading-[1.8] text-cool md:text-[16px] 3xl:text-[18px] 4xl:text-[20px]">
          {t.text}
        </p>
      </div>

      <div className="mt-8 border-t border-line pt-5">
        <p className="font-manrope text-[16px] font-semibold text-navy md:text-[17px] 3xl:text-[19px] 4xl:text-[22px]">
          ~ {t.name}
        </p>
        <p className="mt-1 text-[13px] text-cool md:text-[14px] 3xl:text-[16px] 4xl:text-[18px]">
          {t.designation}, {t.company}
        </p>
      </div>
    </article>
  );
}

export default function ClientelePage() {
  return (
    <PageFrame active="Clientele">
      <style>{`
        @keyframes testimonial-marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .testimonial-track {
          animation: testimonial-marquee 40s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .testimonial-viewport:hover .testimonial-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .testimonial-track { animation: none; }
        }
      `}</style>

      {/* Trusted By */}
      <section className="bg-[#FFFCF4] pb-[70px] pt-[130px] md:pb-[100px] md:pt-[170px]">
        <div className="mx-auto max-w-[100vw] lg:max-w-[85vw] 3xl:max-w-[88vw] 4xl:max-w-[82vw] px-6 md:px-[5%] xl:px-0">
          <h1 className="font-manrope text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-navy md:text-[clamp(40px,5vw,60px)] 3xl:text-[66px] 4xl:text-[76px]">
            Built on Expertise.{" "}
            <em className="not-italic text-gold">Defined by Trust.</em>
          </h1>

          <p className="mt-5 max-w-[95vw] lg:max-w-[57vw] 3xl:max-w-[52vw] 4xl:max-w-[47vw] text-[15px] leading-[1.8] text-cool md:text-[17px] 3xl:text-[19px] 4xl:text-[21px]">
            We partner with architects, designers, developers and hospitality
            groups to deliver tailored flooring solutions, backed by design
            collaboration, quality and dependable project coordination.
          </p>

          <p className="mt-5 font-manrope text-[18px] font-semibold text-navy md:text-[20px] 3xl:text-[24px] 4xl:text-[28px]">
            Thoughtful Collaboration. Lasting Partnerships.
          </p>
        </div>

        <div className="mt-12 border-t border-line" />
        <div className="mx-auto max-w-[100vw] lg:max-w-[85vw] 3xl:max-w-[88vw] 4xl:max-w-[82vw] px-6 py-12 md:px-[5%] md:py-16 3xl:py-20 xl:px-0">
          <div className="grid grid-cols-2 gap-4 md:gap-x-12 md:gap-y-10 lg:grid-cols-4 3xl:gap-x-16 3xl:gap-y-14">
            {clients.map((client) => (
              <div
                key={client.name}
                className="flex h-[200px] flex-col items-center justify-between rounded-[20px] border border-line bg-white px-5 py-8 md:h-[260px] 3xl:h-[300px] 4xl:h-[340px]"
              >
                <div className="flex w-full flex-1 items-center justify-center">
                  <img
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    className="max-h-[70px] w-auto max-w-[75%] object-contain md:max-h-[90px] 3xl:max-h-[110px] 4xl:max-h-[130px]"
                  />
                </div>
                <span className="mt-4 text-center text-[13px] font-medium text-navy md:text-[15px] 3xl:text-[17px] 4xl:text-[19px]">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="border-t border-line" />
        <div className="mx-auto max-w-[85vw] 3xl:max-w-[88vw] 4xl:max-w-[82vw] px-6 pt-12 md:px-[5%] md:pt-20 3xl:pt-24 xl:px-0 pb-12">
          <h2 className="font-manrope text-center text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-navy md:text-[40px] 3xl:text-[52px] 4xl:text-[60px]">
            What Our <span className="text-gold">Clients Says</span>
          </h2>
        </div>

        <div className="testimonial-viewport mt-8 overflow-hidden pb-4 md:mt-10">
          <div className="testimonial-track flex w-max gap-6">
            {/* two identical groups → -50% translate loops seamlessly */}
            {[0, 1].map((group) => (
              <div
                key={group}
                className="flex shrink-0 gap-6"
                aria-hidden={group === 1}
              >
                {testimonials.map((t, i) => (
                  <TestimonialCard key={`${group}-${i}`} t={t} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
