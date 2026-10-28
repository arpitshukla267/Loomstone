"use client";

import { PageFrame, siteImages } from "@/components/site/site-chrome";
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
  return (
    <PageFrame active="Inspiration">
      {/* Inspiration Collage */}
      <section className="bg-[#FFFCF4] px-6 pb-[70px] pt-[130px] md:px-[5%] md:pb-[100px] md:pt-[170px]">
        <div className="mx-auto max-w-[1310px] 3xl:max-w-[1700px] 4xl:max-w-[2100px]">
          <h1 className="mb-16 3xl:mb-20 font-manrope text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-navy md:text-[clamp(40px,5vw,60px)] 3xl:text-[66px] 4xl:text-[76px]">
            Our <em className="not-italic text-gold">Inspirations</em>
          </h1>
          <GalleryGrid items={inspiration} />
        </div>
      </section>
    </PageFrame>
  );
}
