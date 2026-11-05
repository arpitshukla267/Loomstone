"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/site/site-chrome";
import type { BlogPost } from "@/data/blogs";
import { BookOpen } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/api/blogs`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch blogs");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        }
      })
      .catch(() => {
        setBlogs([]);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <PageFrame active="Blogs">
      <section className="bg-[#FFFCF4] px-6 pb-20 pt-[130px] md:px-[5%] md:pb-28 md:pt-[150px]">
        <div className="mx-auto max-w-[90vw] 3xl:max-w-[1700px] 4xl:max-w-[2100px]">
          {/* Header - Simple, no eyebrow, no icons, no decoratives */}
          <div className="max-w-[700px] 3xl:max-w-[850px]">
            <h1 className="font-manrope text-[36px] font-normal tracking-[-0.03em] text-navy md:text-[52px] 3xl:text-[64px] 4xl:text-[76px]">
              The Loomstone Journal
            </h1>
            <p className="mt-3 text-[15px] 3xl:text-[18px] 4xl:text-[20px] leading-relaxed text-cool">
              A curated space for design inspiration, craftsmanship stories, emerging trends and insights into the evolving world of carpets and contemporary flooring
            </p>
          </div>

          {/* Loading or Empty or Blog Cards Grid */}
          {loading ? (
            <div className="mt-16 flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-line bg-white/60 p-12 text-center md:p-16">
              <BookOpen className="mx-auto h-12 w-12 text-gold/60" />
              <h2 className="mt-4 font-manrope text-xl font-normal text-navy">
                Something inspiring is taking shape. Stay tuned.
              </h2>
              <p className="mt-2 text-sm text-cool max-w-md mx-auto">
                We are crafting thoughtful journals on artisanal weaving and interior architecture. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="mt-14 3xl:mt-18 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 lg:gap-12 3xl:gap-14">
              {blogs.map((post) => (
                <article key={post.slug} className="flex flex-col">
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="group flex flex-col"
                  >
                    {/* Clean Image */}
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-ash">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Clean Content */}
                    <div className="mt-5">
                      <span className="text-[12px] text-cool/70">
                        {post.date}
                      </span>

                      <h2 className="mt-2 font-manrope text-[22px] font-normal leading-snug text-navy transition-colors group-hover:text-gold sm:text-[24px] 3xl:text-[28px]">
                        {post.title}
                      </h2>

                      <p className="mt-3 text-[14px] 3xl:text-[16px] leading-relaxed text-cool">
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
          )}
        </div>
      </section>
    </PageFrame>
  );
}
