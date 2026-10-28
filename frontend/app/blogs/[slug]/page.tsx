import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site/site-chrome";
import { BLOG_POSTS, getBlogBySlug } from "@/data/blogs";

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: BlogDetailPageProps) {
  const post = getBlogBySlug(params.slug);
  if (!post) return { title: "Blog Not Found | Loomstone" };
  return {
    title: `${post.title} | Loomstone Blog`,
    description: post.summary,
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = getBlogBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <PageFrame active="Blogs">
      <article className="bg-white px-6 pb-24 pt-[130px] md:px-[5%] md:pb-32 md:pt-[150px]">
        <div className="mx-auto max-w-[820px] 3xl:max-w-[1000px] 4xl:max-w-[1150px]">
          {/* Simple Back Link */}
          <div>
            <Link
              href="/blogs"
              className="text-[13px] text-cool/70 hover:text-navy transition-colors"
            >
              &larr; Back to all stories
            </Link>
          </div>

          {/* Date & Read Time */}
          <div className="mt-6 text-[13px] text-cool/70">
            {post.date} &middot; {post.readTime}
          </div>

          {/* Title - No eyebrow, no icons, no decoratives */}
          <h1 className="mt-3 font-manrope text-[32px] font-normal leading-[1.2] tracking-[-0.025em] text-navy sm:text-[42px] md:text-[48px] 3xl:text-[56px] 4xl:text-[64px]">
            {post.title}
          </h1>

          {/* Featured Image */}
          <div className="mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ash shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Simple Story Content */}
          <div className="mt-10 space-y-6 text-[15px] leading-[1.85] text-cool sm:text-[16px] md:text-[17px] 3xl:text-[19px] 4xl:text-[21px]">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Bottom Back Link */}
          <div className="mt-14 border-t border-line/60 pt-8">
            <Link
              href="/blogs"
              className="text-[13px] text-navy hover:text-gold transition-colors font-medium"
            >
              &larr; Back to all stories
            </Link>
          </div>
        </div>
      </article>
    </PageFrame>
  );
}
