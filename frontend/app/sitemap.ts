import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface BlogPostItem {
  slug: string;
  updatedAt?: string;
  date?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/clientele`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/inspiration`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/brochure`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Dynamically load published blogs from API if reachable
  let dynamicBlogRoutes: MetadataRoute.Sitemap = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_URL}/api/blogs`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        dynamicBlogRoutes = data
          .filter((post: BlogPostItem) => Boolean(post?.slug))
          .map((post: BlogPostItem) => ({
            url: `${siteUrl}/blogs/${encodeURIComponent(post.slug)}`,
            lastModified: post.updatedAt ? new Date(post.updatedAt) : currentDate,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          }));
      }
    }
  } catch {
    // API not running during build / static export fallback
    dynamicBlogRoutes = [];
  }

  return [...staticRoutes, ...dynamicBlogRoutes];
}
