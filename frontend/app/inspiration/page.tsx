"use client";

import { useEffect, useState } from "react";
import { PageFrame } from "@/components/site/site-chrome";
import GalleryGrid from "@/components/ui/Gallerygrid";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Sirf 3 fields: order (number), name (optional), image (url)
interface InspirationItem {
  order: number;
  name?: string;
  image: string;
}

// Images: public/inspirations/1.webp, 2.webp, 3.webp
const STATIC_INSPIRATIONS: InspirationItem[] = [
  {
    order: 1,
    name: "",
    image: "/inspiration/1.webp",
  },
  {
    order: 2,
    name: "",
    image: "/inspiration/2.webp",
  },
  {
    order: 3,
    name: "",
    image: "/inspiration/3.webp",
  },
  {
    order: 4,
    name: "",
    image: "/inspiration/4.webp",
  },
];

export default function InspirationPage() {
  const [items, setItems] = useState<InspirationItem[]>(STATIC_INSPIRATIONS);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/api/inspiration`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch inspiration");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {
        // Fallback to static items
      });

    return () => controller.abort();
  }, []);

  return (
    <PageFrame active="Inspiration">
      {/* Inspiration Collage - Masonry preserving natural dimensions */}
      <section className="bg-[#FFFCF4] px-6 pb-[70px] pt-[130px] md:px-[5%] md:pb-[100px] md:pt-[170px]">
        <div className="mx-auto max-w-[1310px] 3xl:max-w-[1700px] 4xl:max-w-[2100px]">
          <h1 className="font-manrope text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] text-navy md:text-[clamp(40px,5vw,60px)] 3xl:text-[66px] 4xl:text-[76px]">
            Inspirations...
          </h1>
          <p className="mb-16 mt-5 max-w-[640px] text-[16px] leading-[1.8] text-cool md:text-[17px] 3xl:mb-20 3xl:max-w-[780px] 3xl:text-[20px] 4xl:max-w-[900px] 4xl:text-[23px]">
            Explore a world...
          </p>
          <GalleryGrid items={items} />
        </div>
      </section>
    </PageFrame>
  );
}
