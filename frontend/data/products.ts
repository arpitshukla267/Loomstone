export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-01",
    slug: "bespoke-axminster-carpets-rugs",
    name: "Bespoke Axminster Carpets & Rugs",
    description:
      "High-performance flooring crafted for luxury hospitality and commercial environments, seamlessly blending enduring beauty, exceptional durability, and world-class craftsmanship.",
    images: ["/final-website/Ax.jpg"],
  },
  {
    id: "prod-02",
    slug: "bespoke-hand-crafted-carpets-rugs",
    name: "Bespoke Hand-crafted Carpets & Rugs",
    description:
      "Created by skilled artisans and tailored to the most demanding design visions, our bespoke carpets and rugs combine exquisite craftsmanship, unparalleled customization, and timeless luxury.",
    images: ["/final-website/hk.jpg", "/final-website/hand-tuffted.jpg"],
  },
  {
    id: "prod-03",
    slug: "textile-flooring",
    name: "Textile Flooring",
    description:
      "Architectural flooring solutions crafted for modern workplaces, hospitality spaces, and commercial interiors, combining sophisticated design, exceptional performance, and limitless creative possibilities.",
    images: ["/final-website/tile.jpg"],
  },
  {
    id: "prod-04",
    slug: "resilient-flooring",
    name: "Resilient Flooring",
    description:
      "Engineered for demanding commercial and hospitality interiors, our resilient flooring pairs lasting durability with comfort underfoot and refined architectural finishes. A low-maintenance surface that performs beautifully in high-traffic spaces without compromising on design.",
    images: ["/final-website/lvt.jpg"],
  },
];

// Helper functions for CMS & Store integration
// Key bumped to v5 because the product shape changed; older cached data is cleared.
const STORAGE_KEY = "loomstone_custom_products_v5";
const LEGACY_KEYS = [
  "loomstone_custom_products",
  "loomstone_custom_products_v2",
  "loomstone_custom_products_v3",
  "loomstone_custom_products_v4",
];

export function getAllProducts(): Product[] {
  if (typeof window === "undefined") {
    return INITIAL_PRODUCTS;
  }
  try {
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load products from localStorage", e);
  }
  return INITIAL_PRODUCTS;
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("loomstone_products_updated"));
  } catch (e) {
    console.error("Failed to save products", e);
  }
}

export function resetProducts(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    window.dispatchEvent(new Event("loomstone_products_updated"));
  } catch (e) {
    console.error("Failed to reset products", e);
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getAllProducts();
  return (
    products.find((p) => p.slug === slug) ||
    INITIAL_PRODUCTS.find((p) => p.slug === slug)
  );
}
