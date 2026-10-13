"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { siteImages } from "@/components/site/site-images";
import { Reveal, FadeImage } from "../ui/reveal";
import { SectionIntro } from "./section-intro";

export interface ProjectItem {
  title: string;
  type: string;
  image: string;
  text: string;
}

export const defaultProjects: ProjectItem[] = [
  {
    title: "Villa Amanpuri, Phuket",
    type: "Private Residence",
    image: siteImages.projectOne,
    text: "A seamless 9.5m × 6.2m hand-knotted raw silk rug customized to harmonise with regional humidity.",
  },
  {
    title: "The Bellerive Penthouse, Geneva",
    type: "Alpine Penthouse",
    image: siteImages.projectTwo,
    text: "Curated relief textures designed to absorb acoustic flutter echo across floor-to-ceiling glass envelopes.",
  },
  {
    title: "Studio Luca Bellini, Milan",
    type: "Architecture Studio",
    image: siteImages.projectThree,
    text: "A bespoke collaboration integrating floor brass channels with precision-notched rug contours.",
  },
];

export interface ProjectsSectionProps {
  projects?: ProjectItem[];
  onOpenInquiry?: () => void;
}

export function ProjectsSection({
  projects = defaultProjects,
  onOpenInquiry,
}: ProjectsSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, projects.length]);

  // Card ko screen ke horizontal center mein laata hai
  const scrollByCard = (dir: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = Array.from(scroller.children) as HTMLElement[];
    if (!cards.length) return;

    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let current = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < best) {
        best = distance;
        current = i;
      }
    });

    const target =
      cards[Math.min(Math.max(current + dir, 0), cards.length - 1)];
    const left =
      target.offsetLeft - (scroller.clientWidth - target.offsetWidth) / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
  };

  return (
    <section
      className="mx-auto max-w-[1500px] bg-white px-6 py-[70px] md:px-[5%] md:py-[100px]"
      id="projects"
    >
      <Reveal>
        <SectionIntro
          eyebrow="Spatial Provenance"
          title="Recent Projects"
          text="Custom rugs installed in private homes, penthouses, and hotels around the world."
        />
      </Reveal>

      <div className="relative -mx-6 min-[721px]:mx-0">
        {/* Mobile arrows: carousel ki height ke vertical center par */}
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => scrollByCard(-1)}
          className={`absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition min-[721px]:hidden ${
            canPrev ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next project"
          onClick={() => scrollByCard(1)}
          className={`absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition min-[721px]:hidden ${
            canNext ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollerRef}
          onScroll={updateArrows}
          className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[721px]:grid min-[721px]:grid-cols-3 min-[721px]:gap-6 min-[721px]:overflow-visible min-[721px]:px-0"
        >
          {projects.map((project, index) => {
            const base = (index % 3) * 160;

            return (
              <Reveal
                key={project.title}
                delay={base}
                className="h-full w-[calc(80vw-32px)] shrink-0 snap-center min-[721px]:w-auto"
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#dbe1e5] bg-white transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_16px_30px_rgba(42,41,103,0.07)]">
                  <Reveal delay={base + 150} y={14}>
                    <div className="relative h-[190px] overflow-hidden bg-[#dbe1e5] min-[721px]:h-[200px]">
                      <FadeImage
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 721px) 33vw, 80vw"
                        className="object-cover group-hover:scale-[1.06]"
                      />
                    </div>
                  </Reveal>

                  <div className="flex flex-1 flex-col p-4 min-[721px]:p-6">
                    <Reveal delay={base + 250} y={14}>
                      <span className="text-[10px] font-bold uppercase tracking-[.12em] text-gold">
                        {project.type}
                      </span>
                      <h3 className="mt-2 line-clamp-2 min-h-[2.6em] font-manrope text-[20px] font-normal leading-[1.3] text-navy min-[721px]:text-[24px]">
                        {project.title}
                      </h3>
                    </Reveal>

                    <Reveal delay={base + 350} y={14} className="flex-1">
                      <p className="line-clamp-3 min-h-[5.1em] text-[13px] leading-[1.7] text-cool">
                        {project.text}
                      </p>
                    </Reveal>

                    <Reveal delay={base + 450} y={14} className="mt-auto">
                      <button
                        type="button"
                        className="inline-flex w-auto items-center justify-center gap-1.5 border-0 bg-transparent pt-2.5 text-[10px] font-bold uppercase tracking-[.1em] text-navy transition hover:text-gold"
                        onClick={onOpenInquiry}
                      >
                        Inquire About Similar Design <ArrowRight size={14} />
                      </button>
                    </Reveal>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
