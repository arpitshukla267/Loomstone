import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Loomstone collects, protects, and handles personal data and project inquiries in accordance with privacy best practices.",
  keywords: [
    "Loomstone privacy policy",
    "data privacy",
    "client confidentiality",
    "carpet inquiry privacy",
  ],
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Loomstone",
    description:
      "Learn how Loomstone protects client confidentiality and inquiry data.",
    url: `${siteUrl}/privacy`,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
