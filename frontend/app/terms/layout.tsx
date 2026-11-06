import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review Loomstone's terms and conditions regarding custom carpet orders, bespoke manufacturing, specifications, warranties, and services.",
  keywords: [
    "Loomstone terms and conditions",
    "custom carpet terms",
    "bespoke carpet manufacturing warranty",
    "hospitality flooring conditions",
  ],
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Loomstone",
    description:
      "Review Loomstone's terms and conditions regarding bespoke carpet manufacturing, specifications, and client services.",
    url: `${siteUrl}/terms`,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
