"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Layers,
  MapPin,
  Maximize2,
  MessageSquare,
  Phone,
  Ruler,
  Scissors,
  Share2,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";
import { Reveal } from "@/components/ui/reveal";
import { InquiryModal } from "@/components/sections/inquiry-modal";
import {
  getAllProducts,
  getProductBySlug,
  type Product,
} from "@/data/products";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImageTab, setActiveImageTab] = useState<"rug" | "room">("rug");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      const found = getProductBySlug(slug);
      if (found) {
        setProduct(found);
        if (found.sizes && found.sizes.length > 0) {
          setSelectedSize(found.sizes[0]);
        }
      }
    }
  }, [slug]);

  if (!product) {
    return (
      <PageFrame active="Products">
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <h2 className="font-manrope text-[28px] text-navy">
            Rug Specification Not Found
          </h2>
          <p className="mt-2 text-cool">
            The requested design archive may have been archived or moved.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white"
          >
            <ArrowLeft size={16} /> Return to Products Archive
          </Link>
        </div>
      </PageFrame>
    );
  }

  const allProducts = getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.style === product.style))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Loomstone, I am interested in commissioning or enquiring about the "${product.name}" (${product.weave}, Size: ${selectedSize || "Standard"}). Please share availability and bespoke details.`
  );

  return (
    <PageFrame active="Products">
      {/* ================= BREADCRUMBS ================= */}
      <div className="border-b border-line/60 bg-white px-6 pt-[115px] pb-4 md:px-[5%] md:pt-[130px]">
        <div className="mx-auto flex max-w-[1310px] items-center gap-2 text-[12px] text-cool">
          <Link href="/" className="hover:text-navy">
            Home
          </Link>
          <ChevronRight size={14} className="text-cool/40" />
          <Link href="/products" className="hover:text-navy">
            Products Archive
          </Link>
          <ChevronRight size={14} className="text-cool/40" />
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-navy"
          >
            {product.category}
          </Link>
          <ChevronRight size={14} className="text-cool/40" />
          <span className="truncate font-medium text-navy">{product.name}</span>
        </div>
      </div>

      {/* ================= PRODUCT SHOWCASE MAIN ================= */}
      <section className="bg-white px-6 py-10 md:px-[5%] md:py-16">
        <div className="mx-auto max-w-[1310px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Visual Gallery (7 cols) */}
            <div className="lg:col-span-7">
              <Reveal>
                {/* Visual View Switcher (Studio Rug vs Room Placement) */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveImageTab("rug")}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                        activeImageTab === "rug"
                          ? "bg-navy text-white shadow-sm"
                          : "bg-ash text-cool hover:text-navy"
                      }`}
                    >
                      Studio Rug View
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageTab("room")}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                        activeImageTab === "room"
                          ? "bg-navy text-white shadow-sm"
                          : "bg-ash text-cool hover:text-navy"
                      }`}
                    >
                      In-Room Placement
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-cool hover:text-navy"
                  >
                    <Share2 size={14} />
                    {copied ? "Link Copied!" : "Share Specification"}
                  </button>
                </div>

                {/* Main Display Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#dbe1e5] bg-[#f8f9fa] shadow-sm md:aspect-[16/11]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeImageTab === "rug" ? product.image : product.roomImage}
                    alt={`${product.name} - ${activeImageTab === "rug" ? "Studio" : "Interior Context"}`}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Corner Watermark / Tag */}
                  <div className="absolute bottom-4 left-4 rounded-md bg-white/95 px-3 py-1 text-[11px] font-semibold text-navy shadow-md backdrop-blur-sm">
                    {activeImageTab === "rug" ? "Atelier Master Piece" : "Architectural Context"}
                  </div>
                </div>

                {/* Thumbnail Switcher */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveImageTab("rug")}
                    className={`flex items-center gap-3 rounded-xl border p-2 text-left transition-all ${
                      activeImageTab === "rug"
                        ? "border-navy bg-navy/5 ring-2 ring-navy/20"
                        : "border-line bg-white hover:border-cool"
                    }`}
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ash">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt="Thumbnail rug"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-navy">
                        Studio Flat View
                      </span>
                      <span className="text-[11px] text-cool">
                        Fibers & weave texture
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveImageTab("room")}
                    className={`flex items-center gap-3 rounded-xl border p-2 text-left transition-all ${
                      activeImageTab === "room"
                        ? "border-navy bg-navy/5 ring-2 ring-navy/20"
                        : "border-line bg-white hover:border-cool"
                    }`}
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ash">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.roomImage}
                        alt="Thumbnail room"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-navy">
                        Room Setting
                      </span>
                      <span className="text-[11px] text-cool">
                        Spatial proportion & light
                      </span>
                    </div>
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Specification, Sizing, Enquire Actions (5 cols) */}
            <div className="lg:col-span-5">
              <Reveal delay={150}>
                {/* Category & Style Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-navy/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy">
                    {product.weave}
                  </span>
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy">
                    {product.style}
                  </span>
                  {product.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-gold">
                      <Sparkles size={12} /> Curated Design
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="mt-3 font-manrope text-[32px] font-normal leading-[1.15] text-navy md:text-[40px]">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="mt-4 rounded-xl border border-line/70 bg-ash/60 p-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-cool/70">
                        Indicative Commission Range
                      </span>
                      <span className="font-manrope text-[24px] font-bold text-navy">
                        {product.priceDisplay}
                      </span>
                    </div>
                    <span className="rounded bg-white px-2.5 py-1 text-[11px] font-medium text-cool border border-line">
                      {product.leadTime}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-cool/80">
                    * Final quotation accounts for bespoke spatial dimensions, raw yarn selection, and shipment logistics.
                  </p>
                </div>

                {/* Description */}
                <p className="mt-5 text-[14px] leading-relaxed text-cool">
                  {product.description}
                </p>

                {/* Room Suitability Pills */}
                <div className="mt-6">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Recommended Space Placement:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.rooms.map((room) => (
                      <span
                        key={room}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-navy shadow-sm"
                      >
                        <MapPin size={13} className="text-gold" />
                        {room}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-navy">
                      Select Proportional Dimensions:
                    </span>
                    <span className="text-[11px] text-cool/70">
                      Scale can be custom-drafted
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 px-2 text-xs font-semibold transition-all ${
                          selectedSize === size
                            ? "border-navy bg-navy text-white shadow-sm"
                            : "border-line bg-white text-cool hover:border-navy"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTAs: Direct Enquiry + WhatsApp */}
                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={() => setInquiryOpen(true)}
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md transition-all duration-200 hover:bg-gold hover:text-navy hover:shadow-lg"
                  >
                    <MessageSquare size={16} />
                    Inquire For This Rug ({selectedSize || "Custom"})
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

                {/* Assurances */}
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line/60 pt-6 text-[12px] text-cool">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck size={18} className="shrink-0 text-gold" />
                    <span>Master weaver signed authenticity certification.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Truck size={18} className="shrink-0 text-gold" />
                    <span>Insured global white-glove crate dispatch.</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ================= TECHNICAL SPECS TABLE ================= */}
          <div className="mt-16 border-t border-line pt-12 md:mt-24">
            <h2 className="font-manrope text-[24px] font-normal text-navy md:text-[30px]">
              Technical Craft Specifications
            </h2>

            <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-sm">
              <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                <div className="p-5">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-cool/60">
                    Weaving Typology
                  </span>
                  <span className="mt-1 block font-manrope text-[16px] font-semibold text-navy">
                    {product.weave}
                  </span>
                  <span className="mt-1 block text-xs text-cool">
                    {product.category}
                  </span>
                </div>

                <div className="p-5">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-cool/60">
                    Fiber Composition
                  </span>
                  <span className="mt-1 block font-manrope text-[16px] font-semibold text-navy">
                    Natural Yarns
                  </span>
                  <span className="mt-1 block text-xs text-cool">
                    {product.materials}
                  </span>
                </div>

                <div className="p-5">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-cool/60">
                    Pile & Texture
                  </span>
                  <span className="mt-1 block font-manrope text-[16px] font-semibold text-navy">
                    {product.pileHeight || "Tailored Pile"}
                  </span>
                  <span className="mt-1 block text-xs text-cool">
                    {product.knotDensity || "High-density weave"}
                  </span>
                </div>

                <div className="p-5">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-cool/60">
                    Chromatic Story
                  </span>
                  <span className="mt-1 block font-manrope text-[16px] font-semibold text-navy">
                    Botanical Pigments
                  </span>
                  <span className="mt-1 block text-xs text-cool">
                    {product.colorPalette}
                  </span>
                </div>
              </div>

              <div className="border-t border-line bg-ash/40 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-navy">
                  Atelier Craftsmanship Notes:
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-cool">
                  {product.craftDetails} Every rug in this category is finished with hand-bound selvedges and washed with clean running water to stabilize yarn luster.
                </p>
              </div>
            </div>
          </div>

          {/* ================= RELATED DESIGNS ================= */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 border-t border-line pt-12 md:mt-24">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                    Complementary Pieces
                  </span>
                  <h3 className="mt-1 font-manrope text-[24px] font-normal text-navy md:text-[32px]">
                    You may also consider
                  </h3>
                </div>
                <Link
                  href="/products"
                  className="hidden items-center gap-1 text-xs font-semibold uppercase tracking-wider text-navy hover:text-gold sm:inline-flex"
                >
                  View Archive <ArrowRight size={14} />
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/products/${rel.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[#dbe1e5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-ash">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                        {rel.weave}
                      </span>
                      <h4 className="mt-1 font-manrope text-[17px] font-normal text-navy transition-colors group-hover:text-gold">
                        {rel.name}
                      </h4>
                      <p className="mt-1 text-xs text-cool">{rel.priceDisplay}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Inquiry Modal pre-filled */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        productName={product.name}
        productDetails={`Selected Size: ${selectedSize || "Bespoke"} • ${product.category} • ${product.priceDisplay}`}
      />
    </PageFrame>
  );
}
