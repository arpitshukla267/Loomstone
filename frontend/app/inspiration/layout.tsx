import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Design Inspiration & Architectural Gallery",
  description:
    "Explore bespoke carpet design concepts, tactile material palettes, and architectural flooring installations curated for distinct luxury interiors.",
  keywords: [
    "carpet design inspiration",
    "luxury interior carpets",
    "bespoke rug patterns",
    "hospitality carpet concepts",
    "architectural flooring gallery",
    "custom carpet portfolio",
    "interior designer flooring ideas",
  ],
  alternates: {
    canonical: "/inspiration",
  },
  openGraph: {
    title: "Design Inspiration & Architectural Gallery | Loomstone",
    description:
      "Explore bespoke carpet design concepts, tactile material palettes, and architectural flooring installations curated for distinct luxury interiors.",
    url: `${siteUrl}/inspiration`,
    images: [
      {
        url: "/product.webp",
        width: 1200,
        height: 630,
        alt: "Loomstone Design Inspiration and Carpet Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Inspiration & Architectural Gallery | Loomstone",
    description:
      "Explore bespoke carpet design concepts, tactile material palettes, and architectural flooring installations.",
    images: ["/product.webp"],
  },
};

export default function InspirationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
