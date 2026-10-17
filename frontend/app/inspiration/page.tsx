"use client";

import { useState } from "react";
import {
  PageFrame,
  SectionHeading,
  siteImages,
} from "@/components/site/site-chrome";
import GalleryGrid from "@/components/ui/Gallerygrid";

const inspiration = [
  {
    title: "Unbleached Highland Fleece",
    category: "Weave Textures",
    label: "Pure Mountain Wool",
    text: "Natural sheep wool washed with mountain water, soft and durable.",
    image: "/inspiration/1.jpeg",
  },
  {
    title: "Walnut Husks & Plant Roots",
    category: "Natural Dyes",
    label: "Natural Color",
    text: "Warm earthy tones made from boiled walnut husks and botanical extracts.",
    image: "/inspiration/2.png",
  },
  {
    title: "Warm Concrete & Soft Flax",
    category: "Living Rooms",
    label: "Spatial Study",
    text: "A custom rug bringing comfort to smooth board-formed concrete walls.",
    image: siteImages.hero,
  },
  {
    title: "Hand-Knotting on the Loom",
    category: "Artisan Workshops",
    label: "Knot Quality",
    text: "Artisans tying fine knots row by row on upright wooden looms.",
    image: "/inspiration/3.png",
  },
  {
    title: "Morning Light Across Wool Ribs",
    category: "Neutral Tones",
    label: "Shadow & Light",
    text: "Low morning sunlight showing the soft depth and texture of sculpted wool.",
    image: "/inspiration/2.png",
  },
  {
    title: "Milan Apartment Living Room",
    category: "Living Rooms",
    label: "Apartment Setting",
    text: "Soft textured rug cut with subtle geometric lines under warm evening light.",
    image: siteImages.projectOne,
  },
];

export default function InspirationPage() {
  const [filter, setFilter] = useState("All Inspiration");

  const visible =
    filter === "All Inspiration"
      ? inspiration
      : inspiration.filter((item) => item.category === filter);

  return (
    <PageFrame active="Inspiration">
      {/* Inner Hero */}
      <section className="bg-white flex flex-col md:flex-row md:items-end justify-between gap-10 md:gap-[60px] min-h-auto md:min-h-[420px] pt-[130px] md:pt-[170px] pb-[55px] md:pb-[70px] px-6 md:px-[5%]">
        <div className="max-w-[800px]">
          <h1 className="my-4 md:my-5 text-navy font-manrope font-semibold text-[45px] md:text-[clamp(42px,6vw,72px)] leading-[1.08] tracking-[-0.03em]">
            Inspiration &amp;{" "}
            <em className="text-gold not-italic">moodboard.</em>
          </h1>
          <p className="max-w-[650px] m-0 text-cool text-[15px] md:text-[17px] leading-[1.8]">
            A collection of raw wool, natural dye tests, cozy room settings, and
            artisan workshop details that inspire our custom rugs.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-white pt-[30px] pb-[70px] md:pb-[100px] px-6 md:px-[5%]">
        <div className="max-w-[1310px] mx-auto">
          {/* Filter Bar */}
          <div className="flex items-center flex-wrap gap-2 pt-3.5 pb-6 mb-[30px] border-t border-line">
            <span className="mr-2 text-cool text-[9px] font-bold tracking-[.13em] uppercase">
              VIEW BY
            </span>
            {[
              "All Inspiration",
              "Natural Dyes",
              "Weave Textures",
              "Living Rooms",
              "Artisan Workshops",
              "Neutral Tones",
            ].map((item) => (
              <button
                className={`py-2.5 px-3 text-[10px] font-bold tracking-[.08em] uppercase transition-colors cursor-pointer border ${
                  filter === item
                    ? "text-white bg-navy border-navy"
                    : "text-cool bg-white border-line hover:text-white hover:bg-navy hover:border-navy"
                }`}
                key={item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <GalleryGrid items={visible} />{" "}
        </div>
      </section>
    </PageFrame>
  );
}
