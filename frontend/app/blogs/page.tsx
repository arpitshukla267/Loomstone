import Link from "next/link";
import { PageFrame } from "@/components/site/site-chrome";
import { BLOG_POSTS } from "@/data/blogs";

export const metadata = {
  title: "Blogs & Stories | Loomstone",
  description: "Simple stories, craftsmanship notes, and material insights from our rug ateliers.",
};

export default function BlogsPage() {
  return (
    <PageFrame active="Blogs">
      <section className="bg-[#FFFCF4] px-6 pb-20 pt-[130px] md:px-[5%] md:pb-28 md:pt-[150px]">
        <div className="mx-auto max-w-[90vw] 3xl:max-w-[1700px] 4xl:max-w-[2100px]">
          {/* Header - Simple, no eyebrow, no icons, no decoratives */}
          <div className="max-w-[700px] 3xl:max-w-[850px]">
            <h1 className="font-manrope text-[36px] font-normal tracking-[-0.03em] text-navy md:text-[52px] 3xl:text-[64px] 4xl:text-[76px]">
              Blogs
            </h1>
            <p className="mt-3 text-[15px] 3xl:text-[18px] 4xl:text-[20px] leading-relaxed text-cool">
              Stories on traditional weaving techniques, natural fiber
              characteristics, and architectural proportions for contemporary
              spaces.
            </p>
          </div>

          {/* Blog Cards Grid */}
          <div className="mt-14 3xl:mt-18 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 lg:gap-12 3xl:gap-14">
            {BLOG_POSTS.map((post) => (
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
        </div>
      </section>
    </PageFrame>
  );
}
