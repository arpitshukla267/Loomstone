"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ClientItem {
  _id?: string;
  name: string;
  logo: string;
}

interface TestimonialItem {
  text: string;
  name: string;
  designation: string;
  company: string;
}

const STATIC_CLIENTS: ClientItem[] = [
  { name: "Marriott Hotels", logo: "/clients/marriott.webp" },
  { name: "Hilton Hotels & Resorts", logo: "/clients/hilton.webp" },
  { name: "Hyatt Regency", logo: "/clients/hyatt.png" },
  { name: "ITC Hotels", logo: "/clients/itc.png" },
  { name: "Leela", logo: "/clients/leela.webp" },
  { name: "DLF Hospitality", logo: "/clients/dlf.webp" },
  { name: "FCML India", logo: "/clients/fcml.png" },
  { name: "Airtel", logo: "/clients/airtel.webp" },
];

const STATIC_TESTIMONIALS: TestimonialItem[] = [
  {
    text: "Loomstone crafted bespoke carpets for our flagship property. The craftsmanship, texture consistency, and hand-sheared finish exceeded our architect's highest expectations.",
    name: "Vikramaditya Oberoi",
    designation: "Executive Director",
    company: "Luxury Hospitality Group",
  },
  {
    text: "The artisanal attention to natural fibers and exact color-matching made our collaboration seamless. They are our trusted source for bespoke hospitality flooring.",
    name: "Sunita Mehra",
    designation: "Principal Architect",
    company: "Studio Atelier Design",
  },
  {
    text: "From initial sample swatches to final installation across our suites, Loomstone delivered dependable project coordination and peerless quality.",
    name: "Marcus Vance",
    designation: "Managing Director",
    company: "Heritage Hotels & Resorts",
  },
  {
    text: "Their rugs ground our private residences with warmth, acoustic richness, and timeless geometric balance. Truly exceptional craftsmen.",
    name: "Ananya Singhania",
    designation: "Creative Director",
    company: "Bespoke Interiors",
  },
];

function TestimonialCard({ t }: { t: TestimonialItem }) {
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
          {t.designation ? `${t.designation}, ` : ""}
          {t.company}
        </p>
      </div>
    </article>
  );
}

export default function ClientelePage() {
  const [heading, setHeading] = useState("Built on Expertise.");
  const [headingHighlight, setHeadingHighlight] = useState("Defined by Trust.");
  const [description, setDescription] = useState(
    "We partner with architects, interior designers, developers and leading hospitality groups to deliver thoughtfully tailored flooring solutions. Combining design expertise, refined craftsmanship and meticulous project coordination, we bring every vision to life with quality, confidence and seamless execution.",
  );
  const [subheading, setSubheading] = useState(
    "Thoughtful Collaboration. Lasting Partnerships."
  );
  const [testimonialsHeading, setTestimonialsHeading] = useState(
    "What Our Clients Says"
  );
  const [clients, setClients] = useState<ClientItem[]>(STATIC_CLIENTS);
  const [testimonials, setTestimonials] =
    useState<TestimonialItem[]>(STATIC_TESTIMONIALS);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/api/clientele`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch clientele");
        return res.json();
      })
      .then((data) => {
        if (data.heading) setHeading(data.heading);
        if (data.headingHighlight) setHeadingHighlight(data.headingHighlight);
        if (data.description) setDescription(data.description);
        if (data.subheading) setSubheading(data.subheading);
        if (data.testimonialsHeading)
          setTestimonialsHeading(data.testimonialsHeading);
        if (Array.isArray(data.clients) && data.clients.length > 0) {
          setClients(data.clients);
        }
        if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {
        // Fallback to static values on network errors
      });

    return () => controller.abort();
  }, []);

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
            {heading}{" "}
            {headingHighlight && (
              <em className="not-italic text-gold">{headingHighlight}</em>
            )}
          </h1>

          {description && (
            <p className="mt-5 max-w-[95vw] lg:max-w-[57vw] 3xl:max-w-[52vw] 4xl:max-w-[47vw] text-[15px] leading-[1.8] text-cool md:text-[17px] 3xl:text-[19px] 4xl:text-[21px]">
              {description}
            </p>
          )}

          {subheading && (
            <p className="mt-5 font-manrope text-[18px] font-semibold text-navy md:text-[20px] 3xl:text-[24px] 4xl:text-[28px]">
              {subheading}
            </p>
          )}
        </div>

        <div className="mt-12 border-t border-line" />
        <div className="mx-auto max-w-[100vw] lg:max-w-[85vw] 3xl:max-w-[88vw] 4xl:max-w-[82vw] px-6 py-12 md:px-[5%] md:py-16 3xl:py-20 xl:px-0">
          <div className="grid grid-cols-2 gap-4 md:gap-x-12 md:gap-y-10 lg:grid-cols-4 3xl:gap-x-16 3xl:gap-y-14">
            {clients.map((client, index) => (
              <div
                key={client._id || `${client.name}-${index}`}
                className="flex h-[200px] flex-col items-center justify-between rounded-[20px] border border-line bg-white px-5 py-8 md:h-[260px] 3xl:h-[300px] 4xl:h-[340px]"
              >
                <div className="flex w-full flex-1 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.logo}
                    alt={client.name}
                    loading="eager"
                    decoding="async"
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
        {/* {testimonials.length > 0 && (
          <>
            <div className="border-t border-line" />
            <div className="mx-auto max-w-[85vw] 3xl:max-w-[88vw] 4xl:max-w-[82vw] px-6 pt-12 md:px-[5%] md:pt-20 3xl:pt-24 xl:px-0 pb-12">
              <h2 className="font-manrope text-center text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-navy md:text-[40px] 3xl:text-[52px] 4xl:text-[60px]">
                {testimonialsHeading}
              </h2>
            </div>

            <div className="testimonial-viewport mt-8 overflow-hidden pb-4 md:mt-10">
              <div className="testimonial-track flex w-max gap-6">
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
          </>
        )} */}
      </section>
    </PageFrame>
  );
}
