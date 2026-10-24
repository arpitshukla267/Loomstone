"use client";

import { PageFrame, siteImages } from "@/components/site/site-chrome";
import GalleryGrid from "@/components/ui/Gallerygrid";

const clients = [
  { name: "DLF Hospitality", logo: "/clients/dlf.webp" },
  { name: "Hilton Hotels & Resorts", logo: "/clients/hilton.webp" },
  { name: "Leela", logo: "/clients/leela.webp" },
  { name: "ITC Hotels", logo: "/clients/itc.svg" },
  { name: "Marriott Hotels", logo: "/clients/marriott.webp" },
  { name: "FCML India", logo: "/clients/fcml.png" },
  { name: "Hyatt Regancy", logo: "/clients/hyatt.png" },
  { name: "The Executive Centre", logo: "/clients/tec.jpeg" },
];

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
      {/* Trusted By */}
      <section className="bg-[#FFFCF4] pt-[130px] md:pt-[170px]">
        <div className="mx-auto max-w-[1310px] px-6 md:px-[5%] xl:px-0">
          <h1 className="font-manrope text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-navy md:text-[clamp(40px,5vw,60px)]">
            Trusted by{" "}
            <em className="not-italic text-gold">Industry Leaders</em>
          </h1>
          <p className="mt-5 max-w-[820px] text-[15px] leading-[1.8] text-cool md:text-[17px]">
            Loomstone works alongside architects, interior designers,
            developers, hospitality brands, and project consultants to deliver
            bespoke carpets and flooring for some of the most demanding spaces
            across international markets.
          </p>
          <p className="mt-4 max-w-[820px] text-[15px] leading-[1.8] text-cool md:text-[17px]">
            Our partnerships endure because of what happens behind the scenes:
            considered design collaboration, rigorous quality control, and
            dependable delivery to specification and schedule. When a project
            leaves no room for compromise, teams trust Loomstone to deliver.
          </p>
          <p className="mt-5 font-manrope text-[18px] font-semibold text-navy md:text-[20px]">
            Built on Craftsmanship. Earned Through Trust.
          </p>
        </div>

        <div className="mt-12 border-t border-line" />

        <div className="mx-auto max-w-[85vw] px-6 py-12 md:px-[5%] md:py-16 xl:px-0">
          <div className="grid grid-cols-2 gap-4 md:gap-x-12 md:gap-y-10 lg:grid-cols-4">
            {clients.map((client) => (
              <div
                key={client.name}
                className="flex h-[200px] flex-col items-center justify-between rounded-[20px] border border-line bg-white px-5 py-8 md:h-[260px]"
              >
                <div className="flex w-full flex-1 items-center justify-center">
                  <img
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    className="max-h-[70px] w-auto max-w-[75%] object-contain md:max-h-[90px]"
                  />
                </div>
                <span className="mt-4 text-center text-[13px] font-medium text-navy md:text-[15px]">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Collage */}
      <section className="bg-[#FFFCF4] px-6 pb-[70px] pt-[20px] md:px-[5%] md:pb-[100px]">
        <div className="mx-auto max-w-[1310px]">
          <h2 className="my-16 font-manrope text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-navy md:text-[44px]">
            Our <em className="not-italic text-gold">Inspirations</em>
          </h2>
          <GalleryGrid items={inspiration} />
        </div>
      </section>
    </PageFrame>
  );
}
