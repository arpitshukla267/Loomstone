"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Phone,
  Share2,
} from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";
import { Reveal } from "@/components/ui/reveal";
import { InquiryModal } from "@/components/sections/inquiry-modal";
import { getProductBySlug } from "@/data/products";

interface UnifiedProduct {
  id: string;
  slug: string;
  name: string;
  desc: string;
  category?: string;
  rooms?: string[];
  sizes: string[];
  options?: string[];
  images: { url: string; imageId?: string }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const galleryRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<UnifiedProduct | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    const loadLocal = () => {
      const found = getProductBySlug(slug);
      if (found) {
        const localUnified: UnifiedProduct = {
          id: found.id,
          slug: found.slug,
          name: found.name,
          desc: found.description || "",
          category: found.category,
          rooms: found.rooms,
          sizes: found.sizes || [],
          options: [],
          images: [
            { url: found.image },
            ...(found.roomImage && found.roomImage !== found.image
              ? [{ url: found.roomImage }]
              : []),
          ],
        };
        setProduct(localUnified);
        if (localUnified.sizes.length > 0) {
          setSelectedSize(localUnified.sizes[0]);
        }
      }
      setLoading(false);
    };

    if (base) {
      fetch(`${base}/api/products/${slug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Product not found in API");
          return res.json();
        })
        .then((data) => {
          if (data && data.name) {
            const apiUnified: UnifiedProduct = {
              id: data._id || data.id,
              slug: data.slug || slug,
              name: data.name,
              desc: data.desc || data.description || "",
              category: data.category || "",
              rooms: data.rooms || [],
              sizes:
                data.sizes && data.sizes.length > 0
                  ? data.sizes
                  : ["Custom Size"],
              options: data.options || [],
              images:
                Array.isArray(data.images) && data.images.length > 0
                  ? data.images
                  : [{ url: data.image || "/products/hand-knotted.webp" }],
            };
            setProduct(apiUnified);
            if (apiUnified.sizes.length > 0) {
              setSelectedSize(apiUnified.sizes[0]);
            }
            setLoading(false);
          } else {
            loadLocal();
          }
        })
        .catch(() => {
          loadLocal();
        });
    } else {
      loadLocal();
    }
  }, [slug]);

  // Product badalne par gallery pehli image par wapas
  useEffect(() => {
    setActiveIdx(0);
    galleryRef.current?.scrollTo({ left: 0 });
  }, [product?.id]);

  // Swipe/scroll ke saath active image ka index update
  const handleScroll = useCallback(() => {
    const el = galleryRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIdx((prev) => (prev === idx ? prev : idx));
  }, []);

  const goTo = (idx: number) => {
    const el = galleryRef.current;
    if (!el || !product) return;
    const clamped = Math.max(0, Math.min(product.images.length - 1, idx));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  if (loading) {
    return (
      <PageFrame active="Products">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-cool tracking-wider">
              Loading product details...
            </p>
          </div>
        </div>
      </PageFrame>
    );
  }

  if (!product) {
    return (
      <PageFrame active="Products">
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <h2 className="font-manrope text-[28px] text-navy">
            Product Not Found
          </h2>
          <p className="mt-2 text-cool text-sm">
            The requested design archive may have been archived or moved.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-gold hover:text-navy transition-colors"
          >
            <ArrowLeft size={16} /> Return to Products Catalog
          </Link>
        </div>
      </PageFrame>
    );
  }

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const images = product.images;
  const hasMany = images.length > 1;

  const whatsappMessage = encodeURIComponent(
    `Hello Loomstone, I am interested in inquiring about "${product.name}" (Size: ${selectedSize || "Standard"}). Please share availability and bespoke details.`,
  );

  return (
    <PageFrame active="Products">
      {/* ================= BREADCRUMBS ================= */}
      <div className="border-b border-line/60 bg-white px-6 pt-[115px] pb-4 md:px-[5%] md:pt-[130px]">
        <div className="mx-auto flex max-w-[1310px] items-center justify-between text-[12px] text-cool">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-navy transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-cool/40" />
            <Link
              href="/products"
              className="hover:text-navy transition-colors"
            >
              Products
            </Link>
            {product.category && (
              <>
                <ChevronRight size={14} className="text-cool/40" />
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-navy transition-colors"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={14} className="text-cool/40" />
            <span className="truncate font-medium text-navy">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-cool hover:text-navy transition-colors cursor-pointer"
          >
            <Share2 size={13} />
            {copied ? "Link Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* ================= SIMPLE TWO-COLUMN LAYOUT ================= */}
      <section className="bg-white px-6 py-10 md:px-[5%] md:py-16">
        <div className="mx-auto max-w-[1310px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 items-start">
            {/* ── Left Column: Image Gallery (7 cols) ── */}
            <div className="lg:col-span-7">
              <Reveal>
                {/* Main box: swipeable carousel */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#dbe1e5] bg-[#f8f9fa] shadow-sm md:aspect-[16/11]">
                  <div
                    ref={galleryRef}
                    onScroll={handleScroll}
                    className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {images.map((img, idx) => (
                      <div
                        key={`${img.url}-${idx}`}
                        className="h-full w-full shrink-0 snap-center"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={`${product.name} ${idx + 1}`}
                          draggable={false}
                          loading={idx === 0 ? "eager" : "lazy"}
                          className="h-full w-full select-none object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Arrows (sirf jab ek se zyada images hon) */}
                  {hasMany && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() => goTo(activeIdx - 1)}
                        disabled={activeIdx === 0}
                        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#dbe1e5] bg-white/95 text-navy shadow-md transition-all hover:bg-white active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={() => goTo(activeIdx + 1)}
                        disabled={activeIdx === images.length - 1}
                        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#dbe1e5] bg-white/95 text-navy shadow-md transition-all hover:bg-white active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                {/* Indicator dots */}
                {hasMany && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Go to image ${idx + 1}`}
                        aria-current={idx === activeIdx}
                        onClick={() => goTo(idx)}
                        className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                          idx === activeIdx
                            ? "w-6 bg-navy"
                            : "w-2 bg-line hover:bg-cool"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </Reveal>
            </div>

            {/* ── Right Column: Heading, Description, Sizes (5 cols) ── */}
            <div className="lg:col-span-5">
              <Reveal delay={120}>
                {/* Heading */}
                <h1 className="font-manrope text-[32px] md:text-[42px] font-normal leading-[1.15] text-navy tracking-[-0.02em]">
                  {product.name}
                </h1>

                {/* Description: raw store, whitespace-pre-line se sirf asli line breaks dikhte hain */}
                {product.desc ? (
                  <div className="mt-6 text-[15px] leading-relaxed text-cool/90 whitespace-pre-line font-normal">
                    {product.desc}
                  </div>
                ) : null}

                {/* Sizes (selectable chips, no label) */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2.5">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`flex items-center justify-center rounded-[8px] border py-2.5 px-4 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                            isSelected
                              ? "border-navy bg-navy text-white shadow-sm"
                              : "border-line bg-white text-navy hover:border-navy"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Actions: Inquire & WhatsApp */}
                <div className="mt-10 space-y-3 pt-4 border-t border-line/60">
                  <button
                    type="button"
                    onClick={() => setInquiryOpen(true)}
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md transition-all duration-200 hover:bg-gold hover:text-navy hover:shadow-lg cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    Inquire For This Rug{" "}
                    {selectedSize ? `(${selectedSize})` : ""}
                  </button>

                  <a
                    href={`https://wa.me/?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 text-xs font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:border-navy hover:bg-ash"
                  >
                    <Phone size={15} className="text-emerald-600" />
                    Direct WhatsApp Consultation
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        productName={product.name}
        productDetails={`Selected Size: ${selectedSize || "Custom Size"}`}
      />
    </PageFrame>
  );
}
