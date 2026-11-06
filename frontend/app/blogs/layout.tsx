import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "The Loomstone Journal | Carpet Design, Trends & Craft",
  description:
    "Curated stories, craftsmanship insights, and contemporary trends in luxury carpets, architectural flooring, and interior design.",
  keywords: [
    "carpet design blog",
    "luxury flooring trends",
    "interior design carpets",
    "Axminster weaving process",
    "hand-tufted rugs guide",
    "hospitality carpet trends",
    "commercial flooring insights",
    "Loomstone journal",
  ],
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "The Loomstone Journal | Carpet Design, Trends & Craft",
    description:
      "Curated stories, craftsmanship insights, and contemporary trends in luxury carpets, architectural flooring, and interior design.",
    url: `${siteUrl}/blogs`,
    images: [
      {
        url: "/product.webp",
        width: 1200,
        height: 630,
        alt: "The Loomstone Journal - Stories of Craft and Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Loomstone Journal | Carpet Design, Trends & Craft",
    description:
      "Curated stories, craftsmanship insights, and contemporary trends in luxury carpets and architectural flooring.",
    images: ["/product.webp"],
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
