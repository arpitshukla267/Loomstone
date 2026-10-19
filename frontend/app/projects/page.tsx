"use client";

import { ArrowRight, ArrowUpRight, Check, MapPin, Ruler } from "lucide-react";
import {
  PageFrame,
  SectionHeading,
  siteImages,
} from "@/components/site/site-chrome";

const projects = [
  {
    title: "Villa Amanpuri, Phuket",
    type: "Private Residence",
    location: "Phuket, Thailand",
    image: siteImages.projectOne,
    size: "9.5m × 6.2m",
    text: "A seamless raw silk rug designed to harmonise with tropical humidity, softened daylight, and the villa’s natural stone palette.",
  },
  {
    title: "The Bellerive Penthouse",
    type: "Alpine Penthouse",
    location: "Geneva, Switzerland",
    image: siteImages.relief,
    size: "6.8m × 4.4m",
    text: "A sculpted relief installation tuned to absorb acoustic flutter across floor-to-ceiling glass envelopes and pale oak floors.",
  },
  {
    title: "Studio Luca Bellini",
    type: "Architecture Studio",
    location: "Milan, Italy",
    image: siteImages.projectOne,
    size: "Custom contour",
    text: "A precision-notched rug collaboration integrating brass floor channels with the geometry of an 18th-century palazzo restoration.",
  },
  {
    title: "Maison des Pins",
    type: "Private Residence",
    location: "Provence, France",
    image: siteImages.flat,
    size: "5.2m × 3.8m",
    text: "A warm flatweave in hand-spun flax and undyed wool, commissioned to ground a sunlit salon beside original limestone walls.",
  },
  {
    title: "Aman Kyoto Guest Salon",
    type: "Boutique Hospitality",
    location: "Kyoto, Japan",
    image: siteImages.wool,
    size: "7.4m × 5.1m",
    text: "A low-contrast botanical dye study balancing quiet wayfinding with the tactile calm of a private guest salon.",
  },
  {
    title: "Galerie No. 8",
    type: "Cultural Commission",
    location: "New York, USA",
    image: siteImages.mono,
    size: "12m seamless width",
    text: "A monochrome wool and flax field engineered for gallery circulation, flexible exhibitions, and long-term daily use.",
  },
];

// Stats are computed from the data above, so they stay correct when projects change
const stats = [
  { value: projects.length, label: "Featured commissions" },
  {
    value: new Set(projects.map((p) => p.location.split(",").pop()?.trim()))
      .size,
    label: "Countries",
  },
  { value: new Set(projects.map((p) => p.type)).size, label: "Space types" },
];

const steps = [
  {
    title: "Read the room",
    text: "We study plans, light, circulation, and the emotional rhythm of the space.",
  },
  {
    title: "Calibrate the material",
    text: "We develop fiber, color, density, and scale through physical and digital samples.",
  },
  {
    title: "Build the piece",
    text: "Master artisans weave, carve, wash, and finish the commission by hand.",
  },
  {
    title: "Place with care",
    text: "Our team coordinates delivery, placement, and final care notes for the room.",
  },
];

export default function ProjectsPage() {
  return (
    <PageFrame active="Projects">
      {/* Inner Hero */}
      <section className="bg-white flex flex-col lg:flex-row lg:items-end justify-between gap-10 lg:gap-[60px] min-h-auto md:min-h-[420px] pt-[130px] md:pt-[170px] pb-[55px] md:pb-[70px] px-6 md:px-[5%]">
        <div className="max-w-[800px]">
          <h1 className="my-4 md:my-5 text-navy font-manrope font-semibold text-[45px] md:text-[clamp(42px,6vw,72px)] leading-[1.08] tracking-[-0.03em]">
            Rugs made for{" "}
            <em className="text-gold not-italic">the life of a room.</em>
          </h1>
          <p className="max-w-[650px] m-0 text-cool text-[15px] md:text-[17px] leading-[1.8]">
            From private residences to hospitality spaces and cultural
            interiors, every Loomstone Terroir commission begins with the
            architecture around it.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-ash py-[70px] md:py-[100px] px-6 md:px-[5%]">
        <div className="max-w-[1310px] mx-auto">
          <SectionHeading
            title="Material, scale, and atmosphere"
            text="A selection of custom installations shaped by the rooms, people, and rituals they were made to hold."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {projects.map((project) => (
              <article
                className="group flex flex-col overflow-hidden rounded-xl bg-white border border-[#dbe1e5] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_18px_34px_rgba(42,41,103,0.10)]"
                key={project.title}
              >
                {/* Image */}
                <div className="relative h-[190px] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-white text-[11px] font-medium">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="m-0 mb-1.5 text-navy font-manrope font-medium text-[18px] leading-[1.25]">
                    {project.title}
                  </h3>
                  <p className="m-0 mb-4 line-clamp-3 text-cool text-[12px] leading-[1.7]">
                    {project.text}
                  </p>

                  <a
                    className="mt-4 inline-flex items-center gap-1.5 text-navy text-[10px] font-bold tracking-[.1em] uppercase no-underline transition-colors hover:text-gold"
                    href="/contact"
                  >
                    Inquire similar design
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Project Process */}
      <section className="bg-white py-[70px] md:py-[85px] px-6 md:px-[5%]">
        <div className="max-w-[1310px] mx-auto">
          <SectionHeading
            eyebrow="FROM BRIEF TO INSTALLATION"
            title="A considered collaboration"
            text="The strongest rooms are built through conversation. Our design directors work alongside architects, homeowners, and curators at every stage."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {steps.map((step, index) => (
              <div
                className="group flex min-h-[230px] flex-col justify-between rounded-xl border border-[#dbe1e5] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_14px_28px_rgba(42,41,103,0.07)]"
                key={step.title}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ash text-gold font-manrope italic text-[20px] transition-colors group-hover:bg-navy">
                  0{index + 1}
                </span>
                <div className="mt-6">
                  <h3 className="m-0 mb-2 text-navy font-manrope font-normal text-[20px] leading-[1.3]">
                    {step.title}
                  </h3>
                  <p className="m-0 text-cool text-[13px] leading-[1.7]">
                    {step.text}
                  </p>
                </div>
                {/* <small className="mt-5 flex items-center justify-between border-t border-[#dbe1e5] pt-4 text-gold text-[9px] font-bold tracking-[.12em]">
                  ATELIER PHASE {index + 1} <Check size={12} />
                </small> */}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="relative mt-[65px] flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-[35px] overflow-hidden rounded-2xl bg-navy p-7 md:p-10 text-white">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 text-gold text-[10px] font-bold tracking-[.13em] uppercase">
                <i className="w-2 h-2 inline-block rounded-full bg-gold not-italic" />
                YOUR SPACE IS THE STARTING POINT
              </span>
              <h2 className="my-2.5 text-white font-manrope font-normal text-[30px] md:text-[37px]">
                Bring us your room plan.
              </h2>
              <p className="max-w-[620px] m-0 text-[#e4e9ec] text-[14px] leading-[1.7]">
                Our design team will recommend a rug size, fiber story, and
                weave approach within 24 hours.
              </p>
            </div>
            <a
              className="relative inline-flex shrink-0 items-center justify-center gap-2 min-h-[50px] rounded-lg bg-gold px-6 text-navy text-[10px] font-bold tracking-[.13em] uppercase no-underline transition-all duration-200 hover:bg-white"
              href="/contact"
            >
              Start a Project <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
