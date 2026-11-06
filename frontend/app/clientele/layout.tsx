import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Prestigious Clientele & Hospitality Partners",
  description:
    "Trusted by world-renowned hospitality brands and enterprises including Marriott, Hilton, Hyatt, ITC Hotels, The Leela, DLF, and Airtel for luxury carpet installations.",
  keywords: [
    "Loomstone clientele",
    "hospitality carpet projects",
    "Marriott hotel carpets",
    "Hilton bespoke flooring",
    "Hyatt luxury carpets",
    "ITC Hotels carpets",
    "The Leela carpets",
    "commercial carpet installations",
    "hotel flooring partner",
  ],
  alternates: {
    canonical: "/clientele",
  },
  openGraph: {
    title: "Prestigious Clientele & Hospitality Partners | Loomstone",
    description:
      "Trusted by world-renowned hospitality brands including Marriott, Hilton, Hyatt, ITC Hotels, The Leela, and DLF for bespoke carpet installations.",
    url: `${siteUrl}/clientele`,
    images: [
      {
        url: "/product.webp",
        width: 1200,
        height: 630,
        alt: "Loomstone Prestigious Hospitality Clientele",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prestigious Clientele & Hospitality Partners | Loomstone",
    description:
      "Trusted by world-renowned hospitality brands including Marriott, Hilton, Hyatt, and ITC Hotels for bespoke carpets.",
    images: ["/product.webp"],
  },
};

export default function ClienteleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
