import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Download Luxury Carpet Brochure & Specifications",
  description:
    "Request and download Loomstone's comprehensive catalog featuring bespoke Axminster, handcrafted collections, material specifications, and project portfolios.",
  keywords: [
    "Loomstone brochure",
    "carpet catalog download",
    "bespoke carpet catalog",
    "luxury carpet specifications",
    "hospitality carpet brochure",
    "Axminster specifications",
    "custom carpet portfolio PDF",
  ],
  alternates: {
    canonical: "/brochure",
  },
  openGraph: {
    title: "Download Luxury Carpet Brochure & Specifications | Loomstone",
    description:
      "Request and download Loomstone's comprehensive catalog featuring bespoke Axminster, handcrafted collections, and architectural flooring specifications.",
    url: `${siteUrl}/brochure`,
    images: [
      {
        url: "/product.webp",
        width: 1200,
        height: 630,
        alt: "Loomstone Luxury Carpet Brochure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Luxury Carpet Brochure & Specifications | Loomstone",
    description:
      "Request and download Loomstone's comprehensive catalog featuring bespoke Axminster and handcrafted collections.",
    images: ["/product.webp"],
  },
};

export default function BrochureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
