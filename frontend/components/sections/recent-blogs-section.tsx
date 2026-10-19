"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogs";

export function RecentBlogsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 6);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85 * direction;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="bg-white px-6 py-16 md:px-[5%] md:py-24">
      <div className="mx-auto max-w-[1310px]">
        {/* Simple heading - No eyebrow, no decoratives */}
        <div className="text-center">
          <h2 className="font-manrope text-[30px] font-normal tracking-[-0.02em] text-navy md:text-[40px]">
            Stories & Journal
          </h2>
        </div>

        {/* Carousel / Grid container */}
        <div className="relative mt-12">
          {/* Mobile Arrows (Visible only on mobile/tablet) */}
          <button
            type="button"
            aria-label="Previous story"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className={`absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-md transition-opacity duration-200 md:hidden ${
              canPrev ? "opacity-100" : "pointer-events-none opacity-50"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            aria-label="Next story"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className={`absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-md transition-opacity duration-200 md:hidden ${
              canNext ? "opacity-100" : "pointer-events-none opacity-50"
            }`}
          >
            <ChevronRight size={20} />
          </button>

          {/* Cards: Horizontal snap scroll on mobile, 4-col grid on desktop */}
          <div
            ref={scrollerRef}
            className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 lg:grid-cols-4"
          >
            {BLOG_POSTS.slice(0, 4).map((post) => (
              <article
                key={post.slug}
                className="flex w-[82vw] shrink-0 snap-center flex-col md:w-auto md:shrink"
              >
                <Link
                  href={`/blogs/${post.slug}`}
                  className="group flex h-full flex-col"
                >
                  {/* Clean Image */}
                  <div className="aspect-[16/11] w-full overflow-hidden rounded-xl bg-ash">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Clean Content */}
                  <div className="mt-4 flex flex-1 flex-col">
                    <span className="text-[12px] text-cool/70">
                      {post.date} &middot; {post.readTime}
                    </span>

                    <h3 className="mt-2 font-manrope text-[18px] font-normal leading-snug text-navy transition-colors hover:text-gold sm:text-[20px]">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-cool">
                      {post.summary}
                    </p>
                    <button className="text-sm text-left mt-4 text-gold hover:underline">
                      Read More
                    </button>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* View More Button at Bottom */}
        <div className="mt-12 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center justify-center rounded-[8px] border border-navy bg-navy py-2 px-6 text-sm font-medium title tracking-[0.1em] text-white transition-colors hover:bg-gold hover:border-gold hover:text-navy"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}

export default RecentBlogsSection;
