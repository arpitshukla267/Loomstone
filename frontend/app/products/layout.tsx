import type { Metadata } from "next";
import { siteConfig, siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Bespoke Carpets & Luxury Flooring Collections",
  description:
    "Explore Loomstone's bespoke flooring collections: precision-woven Axminster carpets, handcrafted artisan rugs, acoustic textile flooring, and resilient flooring engineered for luxury spaces.",
  keywords: [
    "Axminster carpets",
    "handcrafted carpets",
    "bespoke rugs",
    "textile flooring",
    "resilient flooring",
    "luxury hotel carpets",
    "commercial carpet tiles",
    "custom area rugs",
    "hand-tufted rugs India",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Bespoke Carpets & Luxury Flooring Collections | Loomstone",
    description:
      "Explore Loomstone's bespoke flooring collections: precision-woven Axminster carpets, handcrafted artisan rugs, acoustic textile flooring, and resilient flooring.",
    url: `${siteUrl}/products`,
    images: [
      {
        url: "/product.webp",
        width: 1200,
        height: 630,
        alt: "Loomstone Carpets & Flooring Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bespoke Carpets & Luxury Flooring Collections | Loomstone",
    description:
      "Explore Loomstone's bespoke flooring collections: precision-woven Axminster carpets, handcrafted artisan rugs, acoustic textile flooring, and resilient flooring.",
    images: ["/product.webp"],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
