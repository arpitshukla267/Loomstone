import { defaultCategories } from "./defaultCategories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category:
    | "Hand-Tufted Carpets & Rugs"
    | "Hand-Knotted Rugs"
    | "Handloom Rugs"
    | "Axminster Carpets & Rugs"
    | "Carpet Tiles"
    | string;
  weave:
    | "Hand Knotted"
    | "Hand Tufted"
    | "Handloom"
    | "Axminster"
    | "Carpet Tile"
    | "Flatweave"
    | "Power Loomed";
  style:
    | "Modern Minimalist"
    | "Heritage & Vintage"
    | "Geometric & Linear"
    | "Organic & Abstract";
  rooms: (
    | "Living Room"
    | "Bedroom"
    | "Dining Room"
    | "Hallway & Entryway"
    | "Office & Study"
  )[];
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
    slug: "carpet-tiles",
    name: "Carpet Tiles",
    category: "Carpet Tiles",
    weave: "Carpet Tile",
    style: "Geometric & Linear",
    rooms: ["Office & Study", "Living Room"],
    sizes: ["50 x 50 cm", "Custom Size"],
    materials: "Solution-Dyed Nylon",
    colorPalette: "Grey, Charcoal & Beige",
    priceDisplay: "Request a Quote",
    image: "/products/carpet-tiles.webp",
    roomImage: "/products/carpet-tiles.webp",
    description:
      "Versatile modular carpet tiles designed for modern commercial and residential spaces.",
    craftDetails:
      "Durable modular construction with flexible installation patterns.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-02",
    slug: "flatweave",
    name: "Flatweave Rugs",
    category: "Handloom Rugs",
    weave: "Flatweave",
    style: "Modern Minimalist",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "Wool & Natural Fibres",
    colorPalette: "Neutral & Earthy Tones",
    priceDisplay: "Request a Quote",
    image: "/products/flatweave.webp",
    roomImage: "/products/flatweave.webp",
    description:
      "Lightweight flatwoven rugs with understated patterns and versatile styling.",
    craftDetails: "Flat-profile weaving with a clean, textured finish.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-03",
    slug: "hand-knotted",
    name: "Hand-Knotted Rugs",
    category: "Hand-Knotted Rugs",
    weave: "Hand Knotted",
    style: "Heritage & Vintage",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    sizes: ["6 x 9 ft", "8 x 10 ft", "9 x 12 ft", "Custom Size"],
    materials: "Wool & Silk",
    colorPalette: "Rich, Traditional & Contemporary Tones",
    priceDisplay: "Request a Quote",
    image: "/products/hand-knotted.webp",
    roomImage: "/products/hand-knotted.webp",
    description:
      "Artisan-crafted rugs showcasing intricate patterns and timeless character.",
    craftDetails:
      "Individually hand-knotted construction with detailed craftsmanship.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-04",
    slug: "handloom-rug",
    name: "Handloom Rugs",
    category: "Handloom Rugs",
    weave: "Handloom",
    style: "Geometric & Linear",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "Wool, Cotton & Natural Fibres",
    colorPalette: "Natural, Warm & Contemporary Tones",
    priceDisplay: "Request a Quote",
    image: "/products/handloom-rug.webp",
    roomImage: "/products/handloom-rug.webp",
    description:
      "Handwoven rugs combining traditional weaving methods with contemporary design.",
    craftDetails: "Loom-woven construction with distinctive woven textures.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-05",
    slug: "handmade-upcycled-printed-dhurrie",
    name: "Handmade Upcycled Printed Dhurrie",
    category: "Handloom Rugs",
    weave: "Flatweave",
    style: "Geometric & Linear",
    rooms: ["Living Room", "Bedroom", "Hallway & Entryway"],
    sizes: ["4 x 6 ft", "5 x 8 ft", "Custom Size"],
    materials: "Upcycled Textile Fibres",
    colorPalette: "Multicolour & Printed Patterns",
    priceDisplay: "Request a Quote",
    image: "/products/Handmade-Upcycled-Printed-Dhurrie.webp",
    roomImage: "/products/Handmade-Upcycled-Printed-Dhurrie.webp",
    description:
      "Handmade dhurries featuring expressive prints and upcycled textile materials.",
    craftDetails: "Flatwoven construction with distinctive printed designs.",
    leadTime: "Made to Order",
    isFeatured: false,
  },
  {
    id: "prod-06",
    slug: "hand-tufted",
    name: "Hand-Tufted Carpets & Rugs",
    category: "Hand-Tufted Carpets & Rugs",
    weave: "Hand Tufted",
    style: "Organic & Abstract",
    rooms: ["Living Room", "Bedroom", "Office & Study"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "Wool & Viscose",
    colorPalette: "Custom Colours & Patterns",
    priceDisplay: "Request a Quote",
    image: "/products/hand-tufted.webp",
    roomImage: "/products/hand-tufted.webp",
    description:
      "Custom tufted rugs offering creative freedom in colour, pattern and texture.",
    craftDetails:
      "Hand-tufted pile with options for carved and textured finishes.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-07",
    slug: "homemonde-polyester-chindi",
    name: "Homemonde Polyester Chindi Rugs",
    category: "Handloom Rugs",
    weave: "Flatweave",
    style: "Modern Minimalist",
    rooms: ["Living Room", "Bedroom", "Hallway & Entryway"],
    sizes: ["4 x 6 ft", "5 x 8 ft", "Custom Size"],
    materials: "Polyester Chindi",
    colorPalette: "Multicolour & Mixed Textures",
    priceDisplay: "Request a Quote",
    image: "/products/HOMEMONDE-Polyester-Chindi.webp",
    roomImage: "/products/HOMEMONDE-Polyester-Chindi.webp",
    description:
      "Textured chindi rugs with a casual aesthetic and distinctive textile character.",
    craftDetails: "Textile-based construction featuring mixed-fibre textures.",
    leadTime: "Made to Order",
    isFeatured: false,
  },
  {
    id: "prod-08",
    slug: "plush-hand-tufted-wool-rugs",
    name: "Plush Hand-Tufted Wool Rugs",
    category: "Hand-Tufted Carpets & Rugs",
    weave: "Hand Tufted",
    style: "Modern Minimalist",
    rooms: ["Living Room", "Bedroom"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "Wool",
    colorPalette: "Rich Colours & Soft Neutrals",
    priceDisplay: "Request a Quote",
    image: "/products/Plush-Hand-Tufted-&-Wool-Rugs.webp",
    roomImage: "/products/Plush-Hand-Tufted-&-Wool-Rugs.webp",
    description:
      "Soft, plush wool rugs designed to bring warmth and tactile comfort to interiors.",
    craftDetails: "Dense tufted pile with a luxurious, soft-touch finish.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
  {
    id: "prod-09",
    slug: "power-loomed",
    name: "Power-Loomed Carpets & Rugs",
    category: "Axminster Carpets & Rugs",
    weave: "Power Loomed",
    style: "Geometric & Linear",
    rooms: ["Living Room", "Dining Room", "Office & Study"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "Wool & Synthetic Fibre Blends",
    colorPalette: "Contemporary Patterns & Colours",
    priceDisplay: "Request a Quote",
    image: "/products/Power-Loomed.webp",
    roomImage: "/products/Power-Loomed.webp",
    description:
      "Machine-woven carpets offering consistent patterns and versatile design options.",
    craftDetails:
      "Power-loomed construction designed for consistent production and finish.",
    leadTime: "Made to Order",
    isFeatured: false,
  },
  {
    id: "prod-10",
    slug: "shaggy-expert-hand-tufted-wool-floral-loop-area-rug",
    name: "Shaggy Hand-Tufted Wool Floral Loop Area Rug",
    category: "Hand-Tufted Carpets & Rugs",
    weave: "Hand Tufted",
    style: "Organic & Abstract",
    rooms: ["Living Room", "Bedroom"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "Wool",
    colorPalette: "Floral Patterns & Rich Neutrals",
    priceDisplay: "Request a Quote",
    image: "/products/Shaggy-Expert-Hand-Tufted-Wool-Floral-Loop-Area-Rug.webp",
    roomImage:
      "/products/Shaggy-Expert-Hand-Tufted-Wool-Floral-Loop-Area-Rug.webp",
    description:
      "Distinctive shaggy wool rugs featuring floral motifs and varied loop textures.",
    craftDetails:
      "Hand-tufted wool construction with textured pile and loop detailing.",
    leadTime: "Made to Order",
    isFeatured: true,
  },
];

// Helper functions for CMS & Store integration
const STORAGE_KEY = "loomstone_custom_products_v2";

export function getAllProducts(): Product[] {
  if (typeof window === "undefined") {
    return INITIAL_PRODUCTS;
  }
  try {
    // Clear legacy localStorage key to prevent outdated categories from persisting
    localStorage.removeItem("loomstone_custom_products");

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
    window.dispatchEvent(new Event("loomstone_products_updated"));
  } catch (e) {
    console.error("Failed to reset products", e);
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getAllProducts();
  return products.find((p) => p.slug === slug) || INITIAL_PRODUCTS.find((p) => p.slug === slug);
}
