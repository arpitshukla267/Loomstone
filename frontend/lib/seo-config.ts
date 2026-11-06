/**
 * Centralized SEO & Brand Configuration for Loomstone
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.URL ? `https://${process.env.URL.replace(/^https?:\/\//, "")}` : "https://loomstone.in");

export const defaultKeywords = [
  // Brand
  "Loomstone",
  "Loomstone Carpets",
  "Loomstone Rugs",
  // Core Products
  "bespoke carpets",
  "handcrafted carpets",
  "luxury carpets",
  "Axminster carpets",
  "hand tufted carpets",
  "hand knotted rugs",
  "custom luxury rugs",
  "textile flooring",
  "resilient flooring",
  "architectural carpets",
  "wool and silk rugs",
  "custom area rugs",
  // Hospitality & Commercial
  "hospitality carpets",
  "hotel carpet manufacturers",
  "commercial carpet suppliers",
  "hospitality flooring",
  "banquet carpets",
  "corridor carpets",
  "corporate office carpets",
  "luxury residential carpets",
  // Location & Craftsmanship
  "carpet manufacturer in India",
  "luxury carpets Gurgaon",
  "custom carpets Delhi NCR",
  "bespoke floor coverings India",
  "handwoven carpets manufacturer",
];

export const siteConfig = {
  name: "Loomstone",
  legalName: "Loomstone Carpets",
  url: siteUrl,
  description:
    "Loomstone crafts bespoke handwoven, hand-tufted, and precision Axminster carpets from fine natural wool, silk, and innovative fibers for luxury hospitality, corporate spaces, and fine residences.",
  tagline: "Handcrafted & Bespoke Luxury Carpets",
  defaultTitle: "Loomstone | Handcrafted & Bespoke Luxury Carpets",
  titleTemplate: "%s | Loomstone",
  email: "office@loomstone.in",
  phone: "+91 9916199988",
  address: {
    streetAddress: "Gurgaon",
    addressLocality: "Gurgaon",
    addressRegion: "Haryana",
    addressCountry: "IN",
  },
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    x: "https://x.com",
  },
  ogImage: "/product.webp",
};
