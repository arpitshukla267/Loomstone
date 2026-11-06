import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Contact Us | Bespoke Carpet Consultation & Inquiries",
  description:
    "Connect with Loomstone for custom carpet design consultations, hospitality project specifications, material samples, and bespoke quotes.",
  keywords: [
    "contact Loomstone",
    "custom carpet consultation",
    "hospitality carpet inquiry",
    "carpet manufacturer contact Gurgaon",
    "bespoke rug quote",
    "luxury carpet pricing",
    "carpet sample request",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Loomstone | Bespoke Carpet Consultation & Inquiries",
    description:
      "Connect with Loomstone for custom carpet design consultations, hospitality project specifications, material samples, and bespoke quotes.",
    url: `${siteUrl}/contact`,
    images: [
      {
        url: "/product.webp",
        width: 1200,
        height: 630,
        alt: "Contact Loomstone Carpets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Loomstone | Bespoke Carpet Consultation & Inquiries",
    description:
      "Connect with Loomstone for custom carpet design consultations and luxury hospitality project specifications.",
    images: ["/product.webp"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
