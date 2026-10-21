"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

export const defaultFaqs: FaqItem[] = [
  {
    question: "How long does a custom rug take to make?",
    answer:
      "Standard artisanal lead times range between 10 and 18 weeks depending on knot density and overall square footage.",
  },
  {
    question: "Can you match custom colors or paint shades?",
    answer:
      "Yes. We formulate custom yarn poms against architectural material swatches, paint systems, and fabric samples.",
  },
  {
    question: "Can interior designers get free sample swatches?",
    answer:
      "Verified interior architects and trade studios receive a curated Trade Swatch Box with wool, silk, and sculptural loop samples.",
  },
  {
    question: "What is the largest rug size you can make?",
    answer:
      "Our extended vertical looms accommodate seamless continuous widths up to 12 meters and custom lengths beyond 25 meters.",
  },
  {
    question: "How are rugs shipped and delivered?",
    answer:
      "Every commission is inspected, protected in climate-controlled casing, and delivered with white-glove placement support.",
  },
];

export interface FaqSectionProps {
  faqs?: FaqItem[];
}

export function FaqSection({ faqs = defaultFaqs }: FaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  return (
    <section
      className="bg-[#FFFCF4] ash py-[70px] md:py-[100px] px-6 md:px-[5%]"
      id="contact"
    >
      <div className="mx-auto grid max-w-[1310px] grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
        {/* Left: 40% width, square corners, landscape (width > height), desktop par sticky */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#dbe1e5] md:sticky md:top-28 md:aspect-[10/11]">
          <Image
            src="/inventory.png"
            alt="Loomstone rug inventory"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Right: 60% width, heading + numbered FAQs with divider lines */}
        <div>
          <h2 className="m-0 mb-4 font-manrope text-[32px] font-normal leading-[1.15] text-navy md:mb-6 md:text-[40px]">
            Frequently Asked Questions
          </h2>

          <div>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div className="border-b border-[#dbe1e5]" key={faq.question}>
                  <button
                    className="flex w-full items-center justify-between gap-[18px] py-[18px] text-navy bg-transparent border-0 text-left font-manrope font-normal text-[16px] md:text-[17px] leading-[1.4] cursor-pointer"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>
                      {index + 1}. {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      strokeWidth={1.5}
                      className={`shrink-0 text-navy transition-transform duration-250 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="m-0 pb-[20px] pr-8 text-cool text-[14px] leading-[1.7]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
