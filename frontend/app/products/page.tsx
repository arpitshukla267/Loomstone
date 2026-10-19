"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useDragControls,
} from "framer-motion";
import {
  ArrowDownAZ,
  ArrowRight,
  ArrowUpZA,
  Check,
  ChevronDown,
  SlidersHorizontal,
  TrendingUp,
  Tag,
  X,
  ArrowUpDown,
  Search,
  MessageSquare,
  Sparkles,
  Maximize2,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { PageFrame } from "@/components/site/site-chrome";
import { Reveal } from "@/components/ui/reveal";
import { InquiryModal } from "@/components/sections/inquiry-modal";
import { defaultCategories } from "@/data/defaultCategories";
import { getAllProducts, type Product } from "@/data/products";

const heroImage = "/inventory.png";

const DEFAULT_ROOM_OPTIONS = [
  "All",
  "Living Room",
  "Bedroom",
  "Dining Room",
  "Hallway & Entryway",
  "Office & Study",
];

const STYLE_OPTIONS = [
  "All",
  "Modern Minimalist",
  "Heritage & Vintage",
  "Geometric & Linear",
  "Organic & Abstract",
];

const SIZE_OPTIONS = [
  "All",
  "5 x 8 ft",
  "6 x 9 ft",
  "8 x 10 ft",
  "9 x 12 ft",
  "Custom Size",
];

type SortOption = "featured" | "name-asc" | "name-desc" | "category";

const sortOptions: { value: SortOption; label: string; icon: LucideIcon }[] = [
  { value: "featured", label: "Featured & Curated", icon: TrendingUp },
  { value: "name-asc", label: "Name: A to Z", icon: ArrowDownAZ },
  { value: "name-desc", label: "Name: Z to A", icon: ArrowUpZA },
  { value: "category", label: "Category", icon: Tag },
];

/* ---------- Sort dropdown ---------- */
const menuVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.18,
      ease: "easeOut",
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.97,
    transition: { duration: 0.14, ease: "easeIn" },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.18 } },
} as const;

function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedIndex = sortOptions.findIndex((o) => o.value === value);
  const selected = sortOptions[selectedIndex] || sortOptions[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (index: number) => {
    onChange(sortOptions[index].value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = sortOptions.length;
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setActive(selectedIndex);
        setOpen(true);
      } else {
        setActive((a) => (a + (e.key === "ArrowDown" ? 1 : -1) + n) % n);
      }
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      choose(active);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => {
            setActive(selectedIndex);
            setOpen((o) => !o);
          }}
          onKeyDown={onKeyDown}
          className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-[8px] border bg-white px-3 text-left text-[12px] text-navy outline-none transition-colors hover:border-navy focus-visible:border-navy ${
            open ? "border-navy" : "border-line"
          }`}
        >
          <SelectedIcon size={15} className="shrink-0 text-gold" />
          <span className="flex-1 font-medium">{selected.label}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-cool" />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              variants={menuVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{ transformOrigin: "top" }}
              className="absolute left-0 right-0 z-30 mt-2 m-0 list-none rounded-xl border border-[#dbe1e5] bg-white p-1.5 shadow-[0_16px_40px_rgba(42,41,103,0.14)]"
            >
              {sortOptions.map((option, index) => {
                const Icon = option.icon;
                const isSelected = option.value === value;
                const isActive = index === active;

                return (
                  <motion.li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    variants={itemVariants}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(index)}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] transition-colors ${
                      isActive ? "bg-ash" : ""
                    } ${isSelected ? "font-medium text-navy" : "text-cool"}`}
                  >
                    <Icon
                      size={15}
                      className={isSelected ? "text-gold" : "text-[#9299a0]"}
                    />
                    <span className="flex-1">{option.label}</span>
                    {isSelected && <Check size={14} className="text-gold" />}
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

/* ---------- Sticky column ---------- */
function useStickyColumn(topOffset = 96) {
  const columnRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const reset = (inner: HTMLDivElement, col: HTMLDivElement) => {
      inner.style.position = "";
      inner.style.top = "";
      inner.style.bottom = "";
      inner.style.left = "";
      inner.style.width = "";
      col.style.minHeight = "";
    };

    const update = () => {
      frame = 0;
      const col = columnRef.current;
      const inner = innerRef.current;
      if (!col || !inner) return;

      if (window.innerWidth < 768) {
        reset(inner, col);
        return;
      }

      const rect = col.getBoundingClientRect();
      const height = inner.offsetHeight;
      col.style.minHeight = `${height}px`;

      if (rect.top >= topOffset) {
        inner.style.position = "";
        inner.style.top = "";
        inner.style.bottom = "";
        inner.style.left = "";
        inner.style.width = "";
      } else if (rect.bottom - height <= topOffset) {
        inner.style.position = "absolute";
        inner.style.top = "";
        inner.style.bottom = "0px";
        inner.style.left = "0px";
        inner.style.width = `${rect.width}px`;
      } else {
        inner.style.position = "fixed";
        inner.style.top = `${topOffset}px`;
        inner.style.bottom = "";
        inner.style.left = `${rect.left}px`;
        inner.style.width = `${rect.width}px`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    if (columnRef.current) observer.observe(columnRef.current);
    if (innerRef.current) observer.observe(innerRef.current);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [topOffset]);

  return { columnRef, innerRef };
}

/* ---------- Mobile Sheet ---------- */
function BottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dragControls = useDragControls();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="sheet-overlay"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
          />

          <motion.div
            key="sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              duration: 0.28,
              ease: [0.32, 0.72, 0, 1],
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col rounded-t-2xl bg-white shadow-[0_-12px_40px_rgba(42,41,103,0.18)] md:hidden"
          >
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex shrink-0 cursor-grab touch-none justify-center pb-1 pt-3"
            >
              <span className="h-1 w-10 rounded-full bg-[#dbe1e5]" />
            </div>

            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex shrink-0 touch-none items-center justify-between border-b border-line px-5 pb-3 pt-2"
            >
              <h3 className="font-manrope text-[18px] font-normal text-navy">
                {title}
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-ash"
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- Products Content Component ---------- */
function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load products & handle updates from CMS
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    "All",
    ...defaultCategories.map((c) => c.title),
  ]);

  // Load products from backend (fallback to local mock data)
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    const loadLocal = () => {
      setProductsList(getAllProducts());
    };

    if (base) {
      fetch(`${base}/api/products`)
        .then((res) => {
          if (!res.ok) throw new Error("API error");
          return res.json();
        })
        .then((data) => {
          const list = Array.isArray(data) ? data : data?.data;
          if (Array.isArray(list) && list.length > 0) {
            const mapped: Product[] = list.map((p) => ({
              id: p._id,
              slug: p.slug || p._id,
              name: p.name,
              category: p.category || "Handmade Rugs",
              weave: p.category || "Handmade",
              style: p.options?.[0] || "Curated Design",
              rooms: p.rooms || [],
              sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["Custom Size"],
              materials: p.options?.join(", ") || "100% Fine Handcrafted Fibers",
              colorPalette: "",
              priceDisplay: "Request a Quote",
              image: p.images?.[0]?.url || "/products/hand-knotted.webp",
              roomImage: p.images?.[1]?.url || p.images?.[0]?.url || "/products/hand-knotted.webp",
              description: p.desc || "",
              craftDetails: p.desc || "",
              leadTime: "Made to Order",
              isFeatured: true,
            }));
            setProductsList(mapped);
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

    const handleUpdate = () => {
      loadLocal();
    };
    window.addEventListener("loomstone_products_updated", handleUpdate);
    return () => {
      window.removeEventListener("loomstone_products_updated", handleUpdate);
    };
  }, []);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [roomOptions, setRoomOptions] = useState<string[]>(DEFAULT_ROOM_OPTIONS);
  const [selectedRoom, setSelectedRoom] = useState<string>("All");
  const [selectedStyle, setSelectedStyle] = useState<string>("All");
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("featured");

  // Fetch categories and rooms from backend to keep filter options synced with CMS
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!base) return;

    // Fetch Categories
    fetch(`${base}/api/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load categories");
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data;
        if (Array.isArray(list) && list.length > 0) {
          const apiCats: string[] = list
            .filter((c) => c.isActive !== false)
            .map((c) => c.name?.trim())
            .filter(Boolean);

          const merged = [
            "All",
            ...Array.from(new Set([...apiCats, ...defaultCategories.map((c) => c.title)])),
          ];
          setCategoryOptions(merged);
        }
      })
      .catch(() => {});

    // Fetch Rooms
    fetch(`${base}/api/rooms`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load rooms");
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data;
        if (Array.isArray(list) && list.length > 0) {
          const apiRooms: string[] = list
            .filter((r) => r.isActive !== false)
            .map((r) => ((r.heading || r.name) as string)?.trim())
            .filter(Boolean);

          const merged = [
            "All",
            ...Array.from(
              new Set([...apiRooms, ...DEFAULT_ROOM_OPTIONS.slice(1)]),
            ),
          ];
          setRoomOptions(merged);
        }
      })
      .catch(() => {});
  }, []);

  // Sync initial query params on mount or when URL changes
  useEffect(() => {
    const catParam = searchParams.get("category");
    const weaveParam = searchParams.get("weave");
    const roomParam = searchParams.get("room");
    const styleParam = searchParams.get("style");
    const sizeParam = searchParams.get("size");

    if (catParam) {
      // Find matching default category or exact string
      const matched = defaultCategories.find(
        (c) => c.title.toLowerCase() === catParam.toLowerCase(),
      );
      setSelectedCategory(matched ? matched.title : catParam);
    } else if (weaveParam) {
      // Map weave to category if applicable
      const matchedCat = defaultCategories.find((c) =>
        c.title.toLowerCase().includes(weaveParam.toLowerCase()),
      );
      if (matchedCat) {
        setSelectedCategory(matchedCat.title);
      } else {
        setSelectedCategory(weaveParam);
      }
    }

    if (roomParam) {
      const decoded = decodeURIComponent(roomParam.replace(/\+/g, " "));
      const matchedRoom = roomOptions.find(
        (r) => r.toLowerCase() === decoded.toLowerCase(),
      );
      setSelectedRoom(matchedRoom || decoded);
    }

    if (styleParam) {
      const matchedStyle = STYLE_OPTIONS.find(
        (s) => s.toLowerCase() === styleParam.toLowerCase(),
      );
      if (matchedStyle) setSelectedStyle(matchedStyle);
    }

    if (sizeParam) {
      setSelectedSize(sizeParam);
    }
  }, [searchParams, roomOptions]);

  // Filter collapsible state (category open by default for immediate accessibility)
  const [openFilters, setOpenFilters] = useState<{
    category: boolean;
    room: boolean;
    style: boolean;
    size: boolean;
  }>({
    category: true,
    room: false,
    style: false,
    size: false,
  });

  const toggleFilter = (key: "category" | "room" | "style" | "size") => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mobile Bottom Bar state
  const [barVisible, setBarVisible] = useState(false);
  const [mobileSheet, setMobileSheet] = useState<"filter" | "sort" | null>(
    null,
  );
  const { columnRef, innerRef } = useStickyColumn(120);
  const catalogRef = useRef<HTMLElement>(null);

  // Inquiry Modal state for quick product enquiries
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState<Product | null>(null);

  useEffect(() => {
    const el = catalogRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBarVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Filter logic
  const filteredProducts = useMemo(() => {
    let result = productsList;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.materials.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.colorPalette.toLowerCase().includes(q) ||
          p.craftDetails.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          p.weave.toLowerCase() === selectedCategory.toLowerCase() ||
          selectedCategory.toLowerCase().includes(p.weave.toLowerCase()),
      );
    }

    // Room filter
    if (selectedRoom !== "All") {
      result = result.filter((p) =>
        p.rooms.some((r) => r.toLowerCase() === selectedRoom.toLowerCase()),
      );
    }

    // Style filter
    if (selectedStyle !== "All") {
      result = result.filter(
        (p) => p.style.toLowerCase() === selectedStyle.toLowerCase(),
      );
    }

    // Size filter
    if (selectedSize !== "All") {
      result = result.filter((p) =>
        p.sizes.some((s) =>
          s.toLowerCase().includes(selectedSize.toLowerCase()),
        ),
      );
    }

    // Sorting
    switch (sort) {
      case "name-asc":
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...result].sort((a, b) => b.name.localeCompare(a.name));
      case "category":
        return [...result].sort((a, b) => a.category.localeCompare(b.category));
      case "featured":
      default:
        return [...result].sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
        );
    }
  }, [
    productsList,
    searchQuery,
    selectedCategory,
    selectedRoom,
    selectedStyle,
    selectedSize,
    sort,
  ]);

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedRoom !== "All" ||
    selectedStyle !== "All" ||
    selectedSize !== "All" ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedRoom("All");
    setSelectedStyle("All");
    setSelectedSize("All");
    setSearchQuery("");
  };

  const openInquiryForProduct = (product: Product) => {
    setEnquiryProduct(product);
    setInquiryModalOpen(true);
  };

  return (
    <PageFrame active="Products">
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden md:min-h-[500px]">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right-top"
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-[#000000]/50" />

        <div className="relative z-10 mx-auto max-w-[85vw] px-4 py-16 translate-y-1/4 text-center">
          <Reveal delay={100}>
            <h1 className="font-manrope text-[40px] font-semibold leading-[1.25] text-white md:text-6xl">
              Our{" "}
              <em className="block font-semibold not-italic text-[#e8a21c]">
                Collection
              </em>
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ================= PRODUCT CATALOG ================= */}
      <section
        ref={catalogRef}
        className="bg-ash px-4 pb-28 pt-8 sm:px-6 md:px-[5%] md:py-12"
      >
        <div className="mx-auto max-w-[1310px]">
          {/* Top Bar: Search + Results Count + Sorting (desktop) */}
          <div className="mb-8 rounded-xl border border-[#dbe1e5] bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 md:max-w-md">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cool/60"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by rug name, fiber, or color..."
                  className="w-full border border-line bg-ash/50 py-2.5 pl-10 pr-9 rounded-[8px] text-[13px] text-ink outline-none transition-colors placeholder:text-cool/50 focus:border-navy focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cool/60 hover:text-navy"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status & Sort */}
              <div className="flex items-center justify-between gap-4 md:justify-end">
                <span className="text-[12px] font-medium text-cool">
                  Showing{" "}
                  <strong className="text-navy">
                    {filteredProducts.length}
                  </strong>{" "}
                  of {productsList.length} designs
                </span>

                <div className="hidden w-[200px] md:block">
                  <SortSelect value={sort} onChange={setSort} />
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Desktop Sidebar Filters + Products Grid */}
          <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
            {/* ================= DESKTOP FILTER SIDEBAR ================= */}
            <div
              ref={columnRef}
              className="relative hidden min-w-0 self-stretch md:block"
            >
              <div ref={innerRef} className="z-20 w-full space-y-4">
                <aside className="rounded-xl border border-[#dbe1e5] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-line pb-3.5">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={16} className="text-navy" />
                      <h3 className="text-sm font-semibold tracking-[0.1em] text-navy">
                        Filters
                      </h3>
                    </div>

                    {/* Clear All button in front of Filter Archive */}
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium tracking-wider text-gold hover:bg-gold/10 hover:text-navy transition-colors"
                      title="Clear all filters"
                    >
                      <RotateCcw size={12} />
                      Clear All
                    </button>
                  </div>

                  {/* 1. Category / Technique (From defaultCategories) */}
                  <div className="border-b border-line py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleFilter("category")}
                      className="flex w-full items-center justify-between text-left transition-colors hover:text-navy"
                    >
                      <h4 className="text-xs font-semibold tracking-wider text-navy">
                        Category
                      </h4>
                      <ChevronDown
                        size={16}
                        className={`text-cool transition-transform duration-200 ${
                          openFilters.category ? "rotate-180 text-navy" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFilters.category && (
                        <motion.div
                          key="cat-anim"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: [0.04, 0.62, 0.23, 0.98],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-2">
                            {categoryOptions.map((cat) => {
                              const count =
                                cat === "All"
                                  ? productsList.length
                                  : productsList.filter(
                                      (p) =>
                                        p.category.toLowerCase() ===
                                          cat.toLowerCase() ||
                                        p.weave.toLowerCase() ===
                                          cat.toLowerCase() ||
                                        cat
                                          .toLowerCase()
                                          .includes(p.weave.toLowerCase()),
                                    ).length;

                              return (
                                <label
                                  key={cat}
                                  className="flex cursor-pointer items-center justify-between text-[12px] text-cool hover:text-navy"
                                >
                                  <span className="flex items-center gap-2.5">
                                    <input
                                      type="radio"
                                      name="desktop-category"
                                      value={cat}
                                      checked={selectedCategory === cat}
                                      onChange={() => setSelectedCategory(cat)}
                                      className="h-3.5 w-3.5 accent-[#2a2967]"
                                    />
                                    <span
                                      className={
                                        selectedCategory === cat
                                          ? "font-semibold text-navy"
                                          : ""
                                      }
                                    >
                                      {cat}
                                    </span>
                                  </span>
                                  <span className="text-[10px] tabular-nums text-cool/50">
                                    {count}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 2. Space */}
                  <div className="border-b border-line py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleFilter("room")}
                      className="flex w-full items-center justify-between text-left transition-colors hover:text-navy"
                    >
                      <h4 className="text-xs font-semibold tracking-wider text-navy">
                        Placement
                      </h4>
                      <ChevronDown
                        size={16}
                        className={`text-cool transition-transform duration-200 ${
                          openFilters.room ? "rotate-180 text-navy" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFilters.room && (
                        <motion.div
                          key="room-anim"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: [0.04, 0.62, 0.23, 0.98],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-2">
                            {roomOptions.map((room) => {
                              const count =
                                room === "All"
                                  ? productsList.length
                                  : productsList.filter((p) =>
                                      p.rooms.some(
                                        (r) =>
                                          r.toLowerCase() ===
                                          room.toLowerCase(),
                                      ),
                                    ).length;

                              return (
                                <label
                                  key={room}
                                  className="flex cursor-pointer items-center justify-between text-[12px] text-cool hover:text-navy"
                                >
                                  <span className="flex items-center gap-2.5">
                                    <input
                                      type="radio"
                                      name="desktop-room"
                                      value={room}
                                      checked={selectedRoom === room}
                                      onChange={() => setSelectedRoom(room)}
                                      className="h-3.5 w-3.5 accent-[#2a2967]"
                                    />
                                    <span
                                      className={
                                        selectedRoom === room
                                          ? "font-semibold text-navy"
                                          : ""
                                      }
                                    >
                                      {room}
                                    </span>
                                  </span>
                                  <span className="text-[10px] tabular-nums text-cool/50">
                                    {count}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Style */}
                  <div className="border-b border-line py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleFilter("style")}
                      className="flex w-full items-center justify-between text-left transition-colors hover:text-navy"
                    >
                      <h4 className="text-xs font-semibold tracking-wider text-navy">
                        Design Style
                      </h4>
                      <ChevronDown
                        size={16}
                        className={`text-cool transition-transform duration-200 ${
                          openFilters.style ? "rotate-180 text-navy" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFilters.style && (
                        <motion.div
                          key="style-anim"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: [0.04, 0.62, 0.23, 0.98],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-2">
                            {STYLE_OPTIONS.map((style) => (
                              <label
                                key={style}
                                className="flex cursor-pointer items-center gap-2.5 text-[12px] text-cool hover:text-navy"
                              >
                                <input
                                  type="radio"
                                  name="desktop-style"
                                  value={style}
                                  checked={selectedStyle === style}
                                  onChange={() => setSelectedStyle(style)}
                                  className="h-3.5 w-3.5 accent-[#2a2967]"
                                />
                                <span
                                  className={
                                    selectedStyle === style
                                      ? "font-semibold text-navy"
                                      : ""
                                  }
                                >
                                  {style}
                                </span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 4. Sizes */}
                  <div className="pt-3.5">
                    <button
                      type="button"
                      onClick={() => toggleFilter("size")}
                      className="flex w-full items-center justify-between text-left transition-colors hover:text-navy"
                    >
                      <h4 className="text-xs font-semibold tracking-wider text-navy">
                        Standard Size
                      </h4>
                      <ChevronDown
                        size={16}
                        className={`text-cool transition-transform duration-200 ${
                          openFilters.size ? "rotate-180 text-navy" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFilters.size && (
                        <motion.div
                          key="size-anim"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.28,
                            ease: [0.04, 0.62, 0.23, 0.98],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {SIZE_OPTIONS.map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                className={`rounded border px-2.5 py-1 text-[11px] transition-colors ${
                                  selectedSize === size
                                    ? "border-navy bg-navy font-medium text-white"
                                    : "border-line bg-ash/40 text-cool hover:border-navy"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </aside>
              </div>
            </div>

            {/* ================= PRODUCTS GRID ================= */}
            <div className="min-w-0">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product, index) => (
                    <Reveal
                      key={product.id}
                      delay={(index % 3) * 80}
                      y={20}
                      className="h-full"
                    >
                      <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#dbe1e5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_36px_rgba(42,41,103,0.09)]">
                        {/* Image Showcase */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8e9e8]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />

                          {/* Quick details link on image hover */}
                          <Link
                            href={`/products/${product.slug}`}
                            aria-label={`View ${product.name}`}
                            className="absolute inset-0"
                          />
                        </div>

                        {/* Card Info */}
                        <div className="flex flex-1 flex-col p-4 sm:p-5">
                          {/* Title */}
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-manrope text-[18px] font-normal leading-snug text-navy transition-colors group-hover:text-gold sm:text-[20px]">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Description */}
                          <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-cool">
                            {product.description}
                          </p>

                          {/* Action Buttons */}
                          <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                            <Link
                              href={`/products/${product.slug}`}
                              className="inline-flex min-h-[38px] items-center justify-center gap-1 rounded-[8px] border border-navy bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-navy transition-colors hover:bg-ash"
                            >
                              Details
                              <ArrowRight size={13} />
                            </Link>

                            <button
                              type="button"
                              onClick={() => openInquiryForProduct(product)}
                              className="inline-flex min-h-[38px] items-center justify-center gap-1 rounded-[8px] border border-navy bg-navy px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-gold hover:border-gold hover:text-navy"
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
              ) : (
                <div className="rounded-xl border border-line bg-white px-6 py-16 text-center">
                  <h3 className="font-manrope text-[24px] text-navy">
                    No matching rug designs found
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-[13px] text-cool">
                    No items match your active filters. Try loosening your
                    criteria or resetting the filters.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-6 rounded-lg bg-navy px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy/90"
                  >
                    View All Designs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <AnimatePresence>
        {barVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(42,41,103,0.12)] md:hidden"
          >
            <button
              type="button"
              onClick={() => setMobileSheet("filter")}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy active:bg-ash"
            >
              <SlidersHorizontal size={15} className="text-gold" />
              Filters {hasActiveFilters && "•"}
            </button>

            <span aria-hidden="true" className="my-3 w-px shrink-0 bg-line" />

            <button
              type="button"
              onClick={() => setMobileSheet("sort")}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy active:bg-ash"
            >
              <ArrowUpDown size={15} className="text-gold" />
              Sort
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Sheet */}
      <BottomSheet
        open={mobileSheet === "filter"}
        title="Filter Designs"
        onClose={() => setMobileSheet(null)}
      >
        <div className="space-y-6 pb-6">
          {/* Category */}
          <div className="border-b border-line/50 pb-3">
            <button
              type="button"
              onClick={() => toggleFilter("category")}
              className="flex w-full items-center justify-between text-left"
            >
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-navy">
                Category
              </h4>
              <ChevronDown
                size={16}
                className={`text-cool transition-transform duration-200 ${
                  openFilters.category ? "rotate-180 text-navy" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openFilters.category && (
                <motion.div
                  key="m-cat"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2">
                    {categoryOptions.map((cat) => (
                      <label
                        key={cat}
                        className="flex min-h-[38px] cursor-pointer items-center gap-3 border-b border-line/30 last:border-b-0"
                      >
                        <input
                          type="radio"
                          name="mobile-category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="h-4 w-4 accent-[#2a2967]"
                        />
                        <span
                          className={`text-[13px] ${
                            selectedCategory === cat
                              ? "font-semibold text-navy"
                              : "text-cool"
                          }`}
                        >
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Room */}
          <div className="border-b border-line/50 pb-3">
            <button
              type="button"
              onClick={() => toggleFilter("room")}
              className="flex w-full items-center justify-between text-left"
            >
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-navy">
                Placement
              </h4>
              <ChevronDown
                size={16}
                className={`text-cool transition-transform duration-200 ${
                  openFilters.room ? "rotate-180 text-navy" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openFilters.room && (
                <motion.div
                  key="m-room"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2">
                    {roomOptions.map((room) => (
                      <label
                        key={room}
                        className="flex min-h-[38px] cursor-pointer items-center gap-3 border-b border-line/30 last:border-b-0"
                      >
                        <input
                          type="radio"
                          name="mobile-room"
                          value={room}
                          checked={selectedRoom === room}
                          onChange={() => setSelectedRoom(room)}
                          className="h-4 w-4 accent-[#2a2967]"
                        />
                        <span
                          className={`text-[13px] ${
                            selectedRoom === room
                              ? "font-semibold text-navy"
                              : "text-cool"
                          }`}
                        >
                          {room}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Style */}
          <div className="border-b border-line/50 pb-3">
            <button
              type="button"
              onClick={() => toggleFilter("style")}
              className="flex w-full items-center justify-between text-left"
            >
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-navy">
                Design Style
              </h4>
              <ChevronDown
                size={16}
                className={`text-cool transition-transform duration-200 ${
                  openFilters.style ? "rotate-180 text-navy" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openFilters.style && (
                <motion.div
                  key="m-style"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2">
                    {STYLE_OPTIONS.map((style) => (
                      <label
                        key={style}
                        className="flex min-h-[38px] cursor-pointer items-center gap-3 border-b border-line/30 last:border-b-0"
                      >
                        <input
                          type="radio"
                          name="mobile-style"
                          value={style}
                          checked={selectedStyle === style}
                          onChange={() => setSelectedStyle(style)}
                          className="h-4 w-4 accent-[#2a2967]"
                        />
                        <span
                          className={`text-[13px] ${
                            selectedStyle === style
                              ? "font-semibold text-navy"
                              : "text-cool"
                          }`}
                        >
                          {style}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Standard Size */}
          <div className="pb-3">
            <button
              type="button"
              onClick={() => toggleFilter("size")}
              className="flex w-full items-center justify-between text-left"
            >
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-navy">
                Standard Size
              </h4>
              <ChevronDown
                size={16}
                className={`text-cool transition-transform duration-200 ${
                  openFilters.size ? "rotate-180 text-navy" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openFilters.size && (
                <motion.div
                  key="m-size"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    duration: 0.28,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded border px-3 py-1.5 text-xs transition-colors ${
                          selectedSize === size
                            ? "border-navy bg-navy font-medium text-white"
                            : "border-line bg-ash/40 text-cool hover:border-navy"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex-1 rounded-lg border border-line py-3 text-[11px] font-bold uppercase tracking-wider text-navy"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setMobileSheet(null)}
              className="flex-1 rounded-lg bg-navy py-3 text-[11px] font-bold uppercase tracking-wider text-white"
            >
              View Results ({filteredProducts.length})
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Mobile Sort Sheet */}
      <BottomSheet
        open={mobileSheet === "sort"}
        title="Sort By"
        onClose={() => setMobileSheet(null)}
      >
        <div className="space-y-2 pb-6">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = option.value === sort;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSort(option.value);
                  setMobileSheet(null);
                }}
                className={`flex min-h-[48px] w-full items-center gap-3 border-b border-line/50 px-2 text-left text-[13px] ${
                  isSelected ? "font-semibold text-navy" : "text-cool"
                }`}
              >
                <Icon
                  size={16}
                  className={isSelected ? "text-gold" : "text-cool/50"}
                />
                <span className="flex-1">{option.label}</span>
                {isSelected && <Check size={16} className="text-gold" />}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => {
          setInquiryModalOpen(false);
          setEnquiryProduct(null);
        }}
        productName={enquiryProduct?.name}
        productDetails={
          enquiryProduct
            ? `${enquiryProduct.category} • ${enquiryProduct.priceDisplay}`
            : undefined
        }
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
                Loading Loomstone Archive...
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
