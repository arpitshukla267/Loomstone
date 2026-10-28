"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";
import { Reveal } from "@/components/ui/reveal";
import { ProductImageCarousel } from "@/components/ui/product-image-carousel";
import { InquiryModal } from "@/components/sections/inquiry-modal";
import { getAllProducts, type Product } from "@/data/products";

const heroImage = "/inventory.png";

/* ---------- Products Content Component ---------- */
function ProductsContent() {
  const [productsList, setProductsList] = useState<Product[]>([]);

  useEffect(() => {
    setProductsList(getAllProducts());

    const handleUpdate = () => {
      setProductsList(getAllProducts());
    };
    window.addEventListener("loomstone_products_updated", handleUpdate);
    return () => {
      window.removeEventListener("loomstone_products_updated", handleUpdate);
    };
  }, []);

  // Inquiry Modal state for quick product enquiries
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);

  const openInquiryForProduct = (product: Product) => {
    setEnquiryProduct(product);
    setInquiryModalOpen(true);
  };

  return (
    <PageFrame active="Products">
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden md:min-h-[500px] 3xl:min-h-[640px] 4xl:min-h-[720px]">
        <Image
          src={heroImage}
          alt="Flooring Solutions"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right-top"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-[#000000]/50" />

        <div className="relative z-10 mx-auto max-w-[85vw] px-4 py-16 translate-y-1/4 text-center">
          <Reveal delay={100}>
            <h1 className="font-manrope text-[40px] font-semibold leading-[1.25] text-white md:text-6xl 3xl:text-7xl 4xl:text-8xl">
              Flooring Solutions
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ================= PRODUCT CATALOG ================= */}
      <section className="bg-ash px-4 pb-28 pt-12 sm:px-6 md:px-[5%] md:py-16 3xl:px-[7%] 3xl:py-24 4xl:py-32">
        <div className="mx-auto max-w-[1310px] 3xl:max-w-[1700px] 4xl:max-w-[2100px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-4 4xl:grid-cols-5 3xl:gap-8 4xl:gap-10">
            {productsList.map((product, index) => (
              <Reveal
                key={product.id}
                delay={(index % 4) * 80}
                y={20}
                className="h-full"
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-[#dbe1e5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_36px_rgba(42,41,103,0.09)]">
                  {/* Image Showcase (swipeable carousel) */}
                  <ProductImageCarousel
                    images={product.images}
                    alt={product.name}
                  />

                  {/* Card Info */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <h3 className="font-manrope text-[18px] font-normal leading-snug text-navy transition-colors group-hover:text-gold sm:text-[20px] 3xl:text-[23px]">
                        {product.name}
                      </h3>

                    <p className="mt-2 line-clamp-4 text-[12px] 3xl:text-[14px] leading-relaxed text-cool">
                      {product.description}
                    </p>

                    {/* Enquire Button */}
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={() => openInquiryForProduct(product)}
                        className="inline-flex min-h-[38px] 3xl:min-h-[44px] w-full items-center justify-center gap-1 rounded-[2px] border border-navy bg-navy px-2 text-[10px] 3xl:text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:border-gold hover:bg-gold hover:text-navy"
                      >
                        <MessageSquare size={13} />
                        Enquire
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => {
          setInquiryModalOpen(false);
          setEnquiryProduct(null);
        }}
        productName={enquiryProduct?.name}
      />
    </PageFrame>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <PageFrame active="Products">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center font-manrope text-navy">
              <span className="text-sm font-semibold tracking-widest uppercase text-gold">
                Loading Loomstone Flooring Solutions...
              </span>
            </div>
          </div>
        </PageFrame>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
