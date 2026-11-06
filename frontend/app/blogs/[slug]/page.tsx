import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/site/site-chrome";

import { Metadata } from "next";
import { siteUrl } from "@/lib/seo-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

async function fetchBlog(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/blogs/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const post = await fetchBlog(params.slug);
  if (!post) {
    return {
      title: "Story Not Found",
      description: "The requested blog story could not be found.",
    };
  }

  const title = post.title;
  const description =
    post.summary ||
    "Explore luxury carpet craftsmanship, design insights and trends from Loomstone.";
  const ogImageUrl = post.image || "/product.webp";

  return {
    title,
    description,
    keywords: [
      post.title,
      "Loomstone blog",
      "luxury carpets",
      "bespoke rugs",
      "hospitality flooring",
      "carpet design insights",
    ],
    alternates: {
      canonical: `/blogs/${params.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${title} | Loomstone`,
      description,
      url: `${siteUrl}/blogs/${params.slug}`,
      publishedTime: post.date,
      authors: ["Loomstone"],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Loomstone`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await fetchBlog(params.slug);

  if (!post) {
    notFound();
  }

  const contentParagraphs: string[] = Array.isArray(post.content)
    ? post.content
    : typeof post.content === "string"
    ? [post.content]
    : [];

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
          {post.image && (
            <div className="mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ash shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Simple Story Content */}
          <div className="mt-10 space-y-6 text-[15px] leading-[1.85] text-cool sm:text-[16px] md:text-[17px] 3xl:text-[19px] 4xl:text-[21px]">
            {contentParagraphs.map((paragraph, index) => (
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
