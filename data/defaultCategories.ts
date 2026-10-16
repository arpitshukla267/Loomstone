export type CategoryItem = {
  title: string;
  text: string;
  image: string;
};

export const defaultCategories: CategoryItem[] = [
  {
    title: "Hand-Tufted Carpets & Rugs",
    text: "Yarn is punched into a canvas frame using a tufting gun and secured with latex backing for a thick, cushioned pile.",
    image: "/products/hand-tufted.webp",
  },
  {
    title: "Hand-Knotted Rugs",
    text: "Individually knotted by skilled artisans, these exceptionally durable rugs can last 50–100+ years with proper care.",
    image: "/products/hand-knotted.webp",
  },
  {
    title: "Handloom Rugs",
    text: "Woven by master weavers on traditional shuttle looms, offering subtle textural ribs, organic flatweaves, and timeless warmth.",
    image: "/products/handloom-rug.webp",
  },
  {
    title: "Axminster Carpets & Rugs",
    text: "Precision-woven high-density wool-rich carpets crafted for grand hospitality ballrooms, luxury suites, and statement residential floors.",
    image: "/carpet.jpeg",
  },
  {
    title: "Carpet Tiles",
    text: "Modular, high-performance textile squares engineered for modern corporate headquarters, commercial spaces, and versatile design layouts.",
    image: "/products/carpet-tiles.webp",
  },
];
