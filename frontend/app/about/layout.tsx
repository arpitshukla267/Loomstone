import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Our Story & Craftsmanship",
  description:
    "Discover Loomstone's heritage, master carpet weavers, and artisanal techniques. Uniting timeless weaving traditions with modern architectural flooring design.",
  keywords: [
    "Loomstone story",
    "carpet craftsmanship",
    "master carpet weavers",
    "hand-tufted rug manufacturing",
    "custom carpet design process",
    "luxury carpet brand India",
    "bespoke carpet manufacturing",
    "artisan rug makers",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Our Story & Craftsmanship | Loomstone",
    description:
      "Discover Loomstone's heritage, master carpet weavers, and artisanal techniques. Uniting timeless weaving traditions with modern architectural flooring design.",
    url: `${siteUrl}/about`,
    images: [
      {
        url: "/about.webp",
        width: 1200,
        height: 630,
        alt: "Loomstone Craftsmanship and Weaving Heritage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story & Craftsmanship | Loomstone",
    description:
      "Discover Loomstone's heritage, master carpet weavers, and artisanal techniques.",
    images: ["/about.webp"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
