export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  weave: string;
  style: string;
  rooms: string[];
  sizes: string[];
  materials: string;
  colorPalette: string;
  priceDisplay: string;
  image: string;
  roomImage: string;
  description: string;
  craftDetails: string;
  knotDensity?: string;
  pileHeight?: string;
  leadTime: string;
  isFeatured?: boolean;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-01",
    slug: "bespoke-axminster-carpets-rugs",
    name: "Bespoke Axminster Carpets & Rugs",
    category: "Bespoke Axminster Carpets & Rugs",
    weave: "Axminster",
    style: "Modern Minimalist",
    rooms: ["Living Room", "Office & Study"],
    sizes: ["Custom Size"],
    materials: "80% Wool & 20% Nylon",
    colorPalette: "Bespoke Colorway",
    priceDisplay: "Request a Quote",
    image: "/hero/axminster.png",
    roomImage: "/hero/axminster.png",
    description:
      "High-performance flooring crafted for luxury hospitality and commercial environments, seamlessly blending enduring beauty, exceptional durability, and world-class craftsmanship.",
    craftDetails:
      "Woven cut pile carpet crafted for luxury hospitality and commercial environments.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-02",
    slug: "bespoke-hand-crafted-carpets-rugs",
    name: "Bespoke Hand-crafted Carpets & Rugs",
    category: "Bespoke Hand-crafted Carpets & Rugs",
    weave: "Hand Tufted",
    style: "Heritage & Vintage",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    sizes: ["Custom Size"],
    materials: "Wool & Silk",
    colorPalette: "Artisanal Custom Palette",
    priceDisplay: "Request a Quote",
    image: "/products/hand-knotted.webp",
    roomImage: "/products/hand-knotted.webp",
    description:
      "Created by skilled artisans and tailored to the most demanding design visions, our bespoke carpets and rugs combine exquisite craftsmanship, unparalleled customization, and timeless luxury.",
    craftDetails:
      "Created by skilled artisans and tailored to demanding design visions.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-03",
    slug: "textile-flooring",
    name: "Textile Flooring",
    category: "Textile Flooring",
    weave: "Carpet Tile",
    style: "Geometric & Linear",
    rooms: ["Office & Study", "Living Room"],
    sizes: ["50 x 50 cm", "Custom Size"],
    materials: "Solution-Dyed Architectural Fibres",
    colorPalette: "Contemporary Commercial Palette",
    priceDisplay: "Request a Quote",
    image: "/products/carpet-tiles.webp",
    roomImage: "/products/carpet-tiles.webp",
    description:
      "Architectural flooring solutions crafted for modern workplaces, hospitality spaces, and commercial interiors, combining sophisticated design, exceptional performance, and limitless creative possibilities.",
    craftDetails:
      "Architectural flooring solutions combining sophisticated design and high performance.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-04",
    slug: "resilient-flooring",
    name: "Resilient Flooring",
    category: "Resilient Flooring",
    weave: "Flatweave",
    style: "Modern Minimalist",
    rooms: ["Office & Study", "Hallway & Entryway"],
    sizes: ["Custom Size"],
    materials: "Resilient High-Performance Materials",
    colorPalette: "Natural & Architectural Tones",
    priceDisplay: "Request a Quote",
    image: "/products/flatweave.webp",
    roomImage: "/products/flatweave.webp",
    description: "",
    craftDetails:
      "Engineered resilient flooring designed for demanding commercial and hospitality interiors.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-05",
    slug: "tailored-flooring-solutions",
    name: "Tailored Flooring Solutions",
    category: "Tailored Flooring Solutions",
    weave: "Handloom",
    style: "Modern Minimalist",
    rooms: ["Living Room", "Bedroom", "Office & Study"],
    sizes: ["Custom Size"],
    materials: "Premium Natural & Blended Yarns",
    colorPalette: "Tailored Finishes & Custom Tones",
    priceDisplay: "Request a Quote",
    image: "/products/handloom-rug.webp",
    roomImage: "/products/handloom-rug.webp",
    description: "",
    craftDetails:
      "Tailored flooring designed and specified to meet precise architectural requirements.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-06",
    slug: "custom-flooring-solutions",
    name: "Custom Flooring Solutions",
    category: "Custom Flooring Solutions",
    weave: "Hand Tufted",
    style: "Organic & Abstract",
    rooms: ["Living Room", "Dining Room", "Office & Study"],
    sizes: ["Custom Size"],
    materials: "Bespoke Material Blends",
    colorPalette: "Project-Specific Custom Palette",
    priceDisplay: "Request a Quote",
    image: "/Room_ Curated_Rug.png",
    roomImage: "/Room_ Curated_Rug.png",
    description:
      "Beyond our product portfolio, Loomstone collaborates closely with architects, interior designers, hotel operators, and developers to create custom flooring solutions aligned with each project's design vision, operational requirements, and brand identity.",
    craftDetails:
      "Collaborative custom flooring solutions aligned with each project's vision and brand identity.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
];

// Helper functions for CMS & Store integration
const STORAGE_KEY = "loomstone_custom_products_v4";

export function getAllProducts(): Product[] {
  if (typeof window === "undefined") {
    return INITIAL_PRODUCTS;
  }
  try {
    // Clear legacy localStorage keys to ensure new flooring solutions load immediately
    localStorage.removeItem("loomstone_custom_products");
    localStorage.removeItem("loomstone_custom_products_v2");
    localStorage.removeItem("loomstone_custom_products_v3");

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
    localStorage.removeItem("loomstone_custom_products");
    localStorage.removeItem("loomstone_custom_products_v2");
    localStorage.removeItem("loomstone_custom_products_v3");
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
