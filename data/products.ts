import { defaultCategories } from "./defaultCategories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // Matches defaultCategories: "Hand-Knotted Rugs" | "Hand-Tufted Rugs" | "Flatweave, Dhurrie & Kilim" | "Power-Loomed Rugs"
  weave: "Hand Knotted" | "Hand Tufted" | "Handloom" | "Flatweave" | "Power Loomed";
  style: "Modern Minimalist" | "Heritage & Vintage" | "Geometric & Linear" | "Organic & Abstract";
  rooms: ("Living Room" | "Bedroom" | "Dining Room" | "Hallway & Entryway" | "Office & Study")[];
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
    slug: "kashmiri-botanical-medallion",
    name: "Kashmiri Botanical Medallion",
    category: "Hand-Knotted Rugs",
    weave: "Hand Knotted",
    style: "Heritage & Vintage",
    rooms: ["Living Room", "Dining Room"],
    sizes: ["6 x 9 ft", "8 x 10 ft", "9 x 12 ft", "Custom Size"],
    materials: "100% Hand-spun Ghazni Wool with Silk Highlights",
    colorPalette: "Crimson, Vintage Indigo & Warm Ivory",
    priceDisplay: "$2,850 – $4,600",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    description: "An heirloom Persian-inspired medallion rug hand-knotted over 7 months by master weavers in the Kashmir valley. Dyed using wild pomegranate rind and indigo.",
    craftDetails: "Double-knotted Senneh weave, hand-washed in mineral-rich mountain water for authentic patina.",
    knotDensity: "144 knots / sq inch",
    pileHeight: "9 mm medium plush",
    leadTime: "Ready to Dispatch (48h)",
    isFeatured: true,
  },
  {
    id: "prod-02",
    slug: "terracotta-strata-relief",
    name: "Terracotta Strata Sculpted Rug",
    category: "Hand-Tufted Rugs",
    weave: "Hand Tufted",
    style: "Organic & Abstract",
    rooms: ["Living Room", "Bedroom", "Office & Study"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "9 x 12 ft", "Custom Size"],
    materials: "New Zealand Wool & High-luster Viscose",
    colorPalette: "Warm Terracotta, Sandstone & Earthy Ochre",
    priceDisplay: "$1,450 – $2,800",
    image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    description: "Sculptural multi-level pile inspired by geological terrace formations. Hand-embossed high-low shearing gives dimensional depth under directional light.",
    craftDetails: "Hand-tufted cut-and-loop pile with carved bevel contours and anti-slip natural latex backing.",
    knotDensity: "Dense 4.5 lbs yarn per sq yard",
    pileHeight: "14 mm variable sculptural pile",
    leadTime: "Crafted to Order (3–4 weeks)",
    isFeatured: true,
  },
  {
    id: "prod-03",
    slug: "jaipur-geometric-kilim",
    name: "Jaipur Monochrome Geometric Kilim",
    category: "Flatweave, Dhurrie & Kilim",
    weave: "Flatweave",
    style: "Geometric & Linear",
    rooms: ["Dining Room", "Hallway & Entryway", "Living Room"],
    sizes: ["4 x 6 ft", "5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "100% Organic Semi-worsted Indian Wool & Natural Jute",
    colorPalette: "Bone White, Charcoal & Warm Ash",
    priceDisplay: "$780 – $1,650",
    image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    description: "Crisp, reversible flatweave woven on traditional pit looms in Rajasthan. Features interlocked warp and weft for extreme tensile durability beneath dining chairs.",
    craftDetails: "Reversible dhurrie construction with hand-braided fringe finishing.",
    knotDensity: "Flatweave (No Pile)",
    pileHeight: "5 mm flat profile",
    leadTime: "Ready to Dispatch (48h)",
    isFeatured: true,
  },
  {
    id: "prod-04",
    slug: "nordic-minimalist-handloom",
    name: "Nordic Ribbed Handloom Rug",
    category: "Hand-Tufted Rugs",
    weave: "Handloom",
    style: "Modern Minimalist",
    rooms: ["Bedroom", "Living Room", "Office & Study"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "Pure Unbleached Tibetan Wool & Linen Core",
    colorPalette: "Oatmeal, Ecru & Raw Taupe",
    priceDisplay: "$1,250 – $2,400",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    description: "Quiet, tactile architectural flooring showcasing alternating ribbed textures. The natural lanolin in raw wool provides innate stain resistance and warmth.",
    craftDetails: "Woven on manual panja looms with zero synthetic dyes or chemical sizing.",
    knotDensity: "Heavyweight handloom rib",
    pileHeight: "11 mm loop pile",
    leadTime: "Ready to Dispatch (48h)",
    isFeatured: true,
  },
  {
    id: "prod-05",
    slug: "ziegler-ivory-serapi",
    name: "Ziegler Ivory Serapi Heritage",
    category: "Hand-Knotted Rugs",
    weave: "Hand Knotted",
    style: "Heritage & Vintage",
    rooms: ["Living Room", "Dining Room"],
    sizes: ["8 x 10 ft", "9 x 12 ft", "10 x 14 ft", "Custom Size"],
    materials: "Hand-carded Wool with Hand-spun Silk",
    colorPalette: "Antique Ivory, Madder Root Red & Soft Amber",
    priceDisplay: "$3,400 – $5,900",
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    description: "A stately revival of 19th-century Sultanabad cartouche motifs. Crafted with softened contrast to blend seamlessly with contemporary and classic millwork.",
    craftDetails: "Hand-knotted with over 450,000 knots across standard 8x10 format, sun-aged in open courtyards.",
    knotDensity: "160 knots / sq inch",
    pileHeight: "8 mm hand-sheared",
    leadTime: "Crafted to Order (6–8 weeks)",
    isFeatured: false,
  },
  {
    id: "prod-06",
    slug: "amber-horizon-abstract-plush",
    name: "Amber Horizon Abstract Rug",
    category: "Hand-Tufted Rugs",
    weave: "Hand Tufted",
    style: "Organic & Abstract",
    rooms: ["Living Room", "Bedroom"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "9 x 12 ft", "Custom Size"],
    materials: "New Zealand Wool & Botanical Bamboo Silk",
    colorPalette: "Amber, Burnt Sienna & Dusty Rose",
    priceDisplay: "$1,650 – $3,100",
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description: "An expressive color field gradient reminiscent of twilight over sandstone canyons. The bamboo silk threads catch afternoon daylight with gentle sheen.",
    craftDetails: "Deep plush pile tufting with selective hand-embossed borders.",
    knotDensity: "Plush 80-ounce density",
    pileHeight: "16 mm ultra plush",
    leadTime: "Ready to Dispatch (48h)",
    isFeatured: true,
  },
  {
    id: "prod-07",
    slug: "marrakesh-linear-runner",
    name: "Marrakesh Linear Hallway Runner",
    category: "Flatweave, Dhurrie & Kilim",
    weave: "Flatweave",
    style: "Geometric & Linear",
    rooms: ["Hallway & Entryway", "Office & Study"],
    sizes: ["2.5 x 8 ft (Runner)", "2.5 x 10 ft (Runner)", "2.5 x 12 ft (Runner)", "Custom Length"],
    materials: "100% Recycled Cotton & Jute Blend",
    colorPalette: "Natural Cream, Slate Grey & Terracotta Accent",
    priceDisplay: "$420 – $890",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    description: "Designed specifically for architectural circulation zones, gallery corridors, and entry vestibules. Heavyweight construction prevents curling and shifting.",
    craftDetails: "Double-thick selvedge borders with anti-fray hand-stitched hem.",
    knotDensity: "Dense flatweave structure",
    pileHeight: "6 mm smooth runner profile",
    leadTime: "Ready to Dispatch (48h)",
    isFeatured: false,
  },
  {
    id: "prod-08",
    slug: "arcadia-modernist-grid",
    name: "Arcadia Architectural Grid",
    category: "Power-Loomed Rugs",
    weave: "Power Loomed",
    style: "Modern Minimalist",
    rooms: ["Office & Study", "Living Room", "Dining Room"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "9 x 12 ft"],
    materials: "High-density Heat-set Polypropylene & Cotton Warp",
    colorPalette: "Graphite, Concrete Grey & Warm Chalk",
    priceDisplay: "$580 – $1,150",
    image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    description: "Precision engineered on Belgian Wilton looms. Delivers exact geometric lines, non-shedding convenience, and exceptional resilience for high-traffic environments.",
    craftDetails: "One million point precision power-loom with cotton-bound serged edges.",
    knotDensity: "1,000,000 points / sq meter",
    pileHeight: "10 mm low-shed pile",
    leadTime: "Ready to Dispatch (24h)",
    isFeatured: false,
  },
  {
    id: "prod-09",
    slug: "lapis-lazuli-raw-silk",
    name: "Lapis Lazuli Heritage Medallion",
    category: "Hand-Knotted Rugs",
    weave: "Hand Knotted",
    style: "Heritage & Vintage",
    rooms: ["Living Room", "Dining Room", "Bedroom"],
    sizes: ["6 x 9 ft", "8 x 10 ft", "9 x 12 ft", "Custom Size"],
    materials: "Tibetan Highland Wool & Mulberry Raw Silk",
    colorPalette: "Deep Lapis Indigo, Bronze & Champagne",
    priceDisplay: "$3,200 – $5,400",
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    description: "Hand-knotted with pure vegetable indigo pigments that age into complex sapphire and oceanic depths over generations. An architectural statement centerpiece.",
    craftDetails: "Hand-spun wool carded by hand to retain organic fiber irregularities.",
    knotDensity: "150 knots / sq inch",
    pileHeight: "8.5 mm",
    leadTime: "Crafted to Order (5–7 weeks)",
    isFeatured: true,
  },
  {
    id: "prod-10",
    slug: "sumak-tribal-diamond-flatweave",
    name: "Sumak Tribal Diamond Flatweave",
    category: "Flatweave, Dhurrie & Kilim",
    weave: "Flatweave",
    style: "Geometric & Linear",
    rooms: ["Dining Room", "Living Room", "Bedroom"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "100% Hand-spun Wool & Natural Linen",
    colorPalette: "Rust Terracotta, Sage Green & Desert Sand",
    priceDisplay: "$920 – $1,850",
    image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description: "Woven using the intricate Soumak brocading technique where weft threads wrap around warp sets to create an embroidered, heavy-duty tactile surface.",
    craftDetails: "Extra-dense hand-braided selvedge preventing corner curling under furniture.",
    knotDensity: "Hand-wrapped Soumak weave",
    pileHeight: "7 mm dense flat profile",
    leadTime: "Ready to Dispatch (48h)",
    isFeatured: false,
  },
  {
    id: "prod-11",
    slug: "zenith-curvilinear-hand-tufted",
    name: "Zenith Curvilinear Contour Rug",
    category: "Hand-Tufted Rugs",
    weave: "Hand Tufted",
    style: "Organic & Abstract",
    rooms: ["Bedroom", "Living Room"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "9 x 12 ft", "Custom Size"],
    materials: "100% Bikaner Wool with Tencel Highlights",
    colorPalette: "Warm Cream, Dove Grey & Muted Clay",
    priceDisplay: "$1,550 – $2,950",
    image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    description: "Flowing organic contours carved by hand with angled scissors to create optical elevations that change appearance with light angles throughout the day.",
    craftDetails: "Triple-twisted yarn with hand-cut bevels on all flowing curves.",
    knotDensity: "Heavy tufted pile",
    pileHeight: "15 mm high-low contour",
    leadTime: "Crafted to Order (3–4 weeks)",
    isFeatured: true,
  },
  {
    id: "prod-12",
    slug: "verona-classical-powerloom",
    name: "Verona Classical Damask",
    category: "Power-Loomed Rugs",
    weave: "Power Loomed",
    style: "Heritage & Vintage",
    rooms: ["Living Room", "Dining Room", "Hallway & Entryway"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "9 x 12 ft"],
    materials: "Silky Polyester & Shrink Acrylic Blend",
    colorPalette: "Distressed Cream, Olive & Soft Gold",
    priceDisplay: "$640 – $1,280",
    image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80",
    description: "Features a modern distressed vintage patina mimicking centuries of wear, combined with advanced stain-resistant fibers for relaxed family living.",
    craftDetails: "High-density cross-woven machine construction with ultra-soft micro-chenille finish.",
    knotDensity: "1,200,000 points / sq meter",
    pileHeight: "9 mm resilient low pile",
    leadTime: "Ready to Dispatch (24h)",
    isFeatured: false,
  },
  {
    id: "prod-13",
    slug: "atlas-monochrome-moroccan-plush",
    name: "Atlas Berber Shag Rug",
    category: "Hand-Knotted Rugs",
    weave: "Hand Knotted",
    style: "Modern Minimalist",
    rooms: ["Bedroom", "Living Room"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "100% Unsheared Atlas Mountain Wool",
    colorPalette: "Natural Ivory with Charcoal Diamond Lattice",
    priceDisplay: "$2,100 – $3,800",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    description: "Deep, cloud-soft pile hand-knotted by Berber craftswomen using ancestral methods. The spontaneous lines symbolize fertility, mountain peaks, and home sanctuary.",
    craftDetails: "Hand-tied asymmetrical knots with long 25mm plush shaggy wool yarn.",
    knotDensity: "80 knots / sq inch (Plush Moroccan style)",
    pileHeight: "25 mm deep luxurious pile",
    leadTime: "Ready to Dispatch (48h)",
    isFeatured: true,
  },
  {
    id: "prod-14",
    slug: "kyoto-architectural-handloom",
    name: "Kyoto Linear Handloom Mat",
    category: "Hand-Tufted Rugs",
    weave: "Handloom",
    style: "Modern Minimalist",
    rooms: ["Office & Study", "Living Room", "Hallway & Entryway"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    materials: "Handloom Bamboo Silk & Organic Jute Core",
    colorPalette: "Moss Green, Slate Charcoal & Raw Linen",
    priceDisplay: "$1,380 – $2,600",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    roomImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    description: "Inspired by traditional Japanese tatami mats and Zen gravel gardens. Subtle micro-stripes create directional perspective without overwhelming furniture.",
    craftDetails: "Flat shuttle handloom weaving with hand-turned self-finished edges.",
    knotDensity: "Medium panja weave",
    pileHeight: "8 mm low profile",
    leadTime: "Ready to Dispatch (48h)",
    isFeatured: false,
  },
];

// Helper functions for CMS & Store integration
const STORAGE_KEY = "loomstone_custom_products";

export function getAllProducts(): Product[] {
  if (typeof window === "undefined") {
    return INITIAL_PRODUCTS;
  }
  try {
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
    window.dispatchEvent(new Event("loomstone_products_updated"));
  } catch (e) {
    console.error("Failed to reset products", e);
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getAllProducts();
  return products.find((p) => p.slug === slug) || INITIAL_PRODUCTS.find((p) => p.slug === slug);
}
