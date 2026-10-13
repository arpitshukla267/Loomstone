'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionIntro } from './section-intro';

export interface FaqItem {
  question: string;
  answer: string;
}

export const defaultFaqs: FaqItem[] = [
  {
    question: 'How long does a custom rug take to make?',
    answer:
      'Standard artisanal lead times range between 10 and 18 weeks depending on knot density and overall square footage.',
  },
  {
    question: 'Can you match custom colors or paint shades?',
    answer:
      'Yes. We formulate custom yarn poms against architectural material swatches, paint systems, and fabric samples.',
  },
  {
    question: 'Can interior designers get free sample swatches?',
    answer:
      'Verified interior architects and trade studios receive a curated Trade Swatch Box with wool, silk, and sculptural loop samples.',
  },
  {
    question: 'What is the largest rug size you can make?',
    answer:
      'Our extended vertical looms accommodate seamless continuous widths up to 12 meters and custom lengths beyond 25 meters.',
  },
  {
    question: 'How are rugs shipped and delivered?',
    answer:
      'Every commission is inspected, protected in climate-controlled casing, and delivered with white-glove placement support.',
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
    <section className="bg-ash py-[70px] md:py-[100px] px-6 md:px-[5%]" id="contact">
      <div className="max-w-[1310px] mx-auto">
        <SectionIntro
          eyebrow="Trade Knowledge & Guidance"
          title="Frequently Asked Questions"
          text="Simple answers about custom sizing, sample swatches, production times, and delivery."
        />
        <div className="max-w-[950px]">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                className="mb-3.5 bg-white border border-[#dbe1e5]"
                key={faq.question}
              >
                <button
                  className="flex w-full items-center justify-between gap-[18px] p-[18px] md:p-6 text-navy bg-transparent border-0 text-left font-manrope font-normal text-[17px] md:text-[20px] cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={19}
                    className={`text-gold transition-transform duration-250 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="m-0 px-[18px] md:px-6 pb-[22px] text-cool text-[14px] leading-[1.7]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
