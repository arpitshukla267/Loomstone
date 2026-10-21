"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { defaultCategories } from "../../data/defaultCategories";
import type { CategoryItem } from "@/data/defaultCategories";
import { SectionIntro } from "./section-intro";
import { Reveal, FadeImage } from "../ui/reveal";

export interface CategoriesSectionProps {
  categories?: CategoryItem[];
  onOpenInquiry?: () => void;
  onShowToast?: (message: string) => void;
}

export function CategoriesSection({
  categories: initialCategories = defaultCategories,
}: CategoriesSectionProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Fetch categories from CMS API
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!base) return;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    fetch(`${base}/api/categories`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data;
        if (!Array.isArray(list) || list.length === 0) return;

        const mapped: CategoryItem[] = list
          .filter((c) => c?.name && c?.isActive !== false)
          .map((c) => {
            const fallback = defaultCategories.find(
              (dc) => dc.title.toLowerCase() === c.name.toLowerCase()
            );
            return {
              title: c.name,
              text: c.desc || c.text || fallback?.text || "",
              image: c.image || fallback?.image || "/carpet.jpeg",
            };
          });

        if (mapped.length > 0) {
          setCategories(mapped);
        }
      })
      .catch(() => {
        // Fallback to default categories
      })
      .finally(() => clearTimeout(timer));

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    updateArrows();
  }, [categories, updateArrows]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;

    const cards = Array.from(el.children) as HTMLElement[];
    if (!cards.length) return;

    const trackCenter = el.getBoundingClientRect().left + el.clientWidth / 2;

    const centerOf = (card: HTMLElement) => {
      const rect = card.getBoundingClientRect();
      return rect.left + rect.width / 2;
    };

    let current = 0;
    let best = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(centerOf(card) - trackCenter);

      if (distance < best) {
        best = distance;
        current = index;
      }
    });

    const targetIndex = Math.min(
      Math.max(current + direction, 0),
      cards.length - 1,
    );

    el.scrollBy({
      left: centerOf(cards[targetIndex]) - trackCenter,
      behavior: "smooth",
    });
  };

  const arrowClass =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-md transition-opacity duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:hidden";

  return (
    <section
      id="categories"
      className="bg-[#FFFCF4] px-6 py-[70px] md:px-[5%] md:py-[60px]"
    >
      <div className="mx-auto max-w-[1310px]">
        <Reveal>
          <SectionIntro
            eyebrow="Artisanal Categories"
            title="Find by Category"
            text="Explore distinctive rug-making techniques from our master ateliers, each designed to suit different spaces, styles, and needs."
          />
        </Reveal>

        <div className="relative">
          <button
            type="button"
            aria-label="Previous category"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className={`${arrowClass} left-2 ${
              canPrev ? "opacity-100" : "pointer-events-none opacity-50"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Next category"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className={`${arrowClass} right-2 ${
              canNext ? "opacity-100" : "pointer-events-none opacity-50"
            }`}
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={trackRef}
            className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain overflow-y-hidden px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:snap-none md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-5 md:overflow-visible md:px-0"
          >
            {categories.map((category, index) => {
              const targetUrl = `/products?category=${encodeURIComponent(category.title)}`;

              return (
                <Reveal
                  key={category.title}
                  delay={(index % 5) * 100}
                  className="h-full w-[calc(80vw-32px)] shrink-0 snap-center md:w-auto md:shrink"
                >
                  <Link
                    href={targetUrl}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#dbe1e5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_32px_rgba(42,41,103,0.09)]"
                  >
                    <div className="relative h-[190px] overflow-hidden bg-[#f1f2f3] md:h-[220px] xl:h-[240px]">
                      <FadeImage
                        src={category.image}
                        alt={category.title}
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 80vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-4 md:p-5">
                      <h3 className="m-0 min-h-[2.6em] text-[17px] font-normal leading-[1.3] text-navy transition-colors group-hover:text-gold xl:text-[19px]">
                        {category.title}
                      </h3>

                      <p className="mb-5 mt-2 line-clamp-4 text-[12px] leading-[1.7] text-cool md:text-[13px]">
                        {category.text}
                      </p>

                      <div className="mt-auto">
                        <span className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] border border-navy bg-navy py-3 text-xs font-medium title tracking-[.1em] text-white transition-all duration-200 group-hover:border-gold group-hover:bg-gold group-hover:text-navy">
                          View Products
                          <ArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
