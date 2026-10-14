export type CategoryItem = {
  title: string;
  text: string;
  image: string;
};

export const defaultCategories: CategoryItem[] = [
  {
    title: "Hand-Knotted Rugs",
    text: "Individually knotted by skilled artisans, these exceptionally durable rugs can last 50–100+ years with proper care.",
    image: "/products/hand-knotted.png",
  },
  {
    title: "Hand-Tufted Rugs",
    text: "Yarn is punched into a canvas frame using a tufting gun and secured with latex backing for a thick, cushioned pile.",
    image: "/products/hand-tufted.png",
  },
  {
    title: "Flatweave, Dhurrie & Kilim",
    text: "Woven without pile using interlocked warp and weft threads, these lightweight, reversible rugs are easy to maintain.",
    image: "/products/flatweave.png",
  },
  {
    title: "Power-Loomed Rugs",
    text: "Machine-woven for precise, consistent patterns, these versatile rugs offer excellent design variety at budget-friendly prices.",
    image: "/products/Power-Loomed.png",
  },
];
