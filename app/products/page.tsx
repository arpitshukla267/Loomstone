"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
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
  type LucideIcon,
} from "lucide-react";
import { PageFrame, siteImages } from "@/components/site/site-chrome";
import { Reveal } from "@/components/ui/reveal";

const products = [
  {
    name: "Kashmiri Botanical Medallion",
    category: "Hand-knotted",
    image: siteImages.wool,
  },
  {
    name: "Ziegler Ivory Serapi",
    category: "Hand-knotted",
    image: siteImages.relief,
  },
  {
    name: "Highland Mohair Rib",
    category: "Relief",
    image: siteImages.mono,
  },
  {
    name: "Lapis Lazuli Raw Silk",
    category: "Botanical dye",
    image: siteImages.flat,
  },
  {
    name: "Ochre Horizon",
    category: "Botanical dye",
    image: siteImages.wool,
  },
  {
    name: "Travertine Strata",
    category: "Relief",
    image: siteImages.relief,
  },
];

const categories = ["All", "Hand-knotted", "Relief", "Botanical dye"];

type SortOption = "featured" | "name-asc" | "name-desc" | "category";

const sortOptions: { value: SortOption; label: string; icon: LucideIcon }[] = [
  { value: "featured", label: "Featured", icon: TrendingUp },
  { value: "name-asc", label: "Name: A to Z", icon: ArrowDownAZ },
  { value: "name-desc", label: "Name: Z to A", icon: ArrowUpZA },
  { value: "category", label: "Category", icon: Tag },
];

/* ---------- Custom sort dropdown with enter / exit animation (desktop) ---------- */
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
  const selected = sortOptions[selectedIndex];
  const SelectedIcon = selected.icon;

  // Close on outside click
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
          aria-labelledby="product-sort-label"
          onClick={() => {
            setActive(selectedIndex);
            setOpen((o) => !o);
          }}
          onKeyDown={onKeyDown}
          className={`flex min-h-[44px] w-full items-center gap-2.5 rounded-lg border bg-white px-3 text-left text-[12px] text-navy outline-none transition-colors hover:border-navy focus-visible:border-navy ${
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
              aria-labelledby="product-sort-label"
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

/* ---------- Sticky column that doesn't depend on ancestor overflow ----------
   CSS `position: sticky` silently fails when any parent has overflow
   hidden/auto (common in page wrappers). This version uses fixed positioning
   driven by scroll, so it works regardless. It sticks below the header, then
   rests at the bottom of its column when the products end. */
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
        // Not reached yet: normal flow
        inner.style.position = "";
        inner.style.top = "";
        inner.style.bottom = "";
        inner.style.left = "";
        inner.style.width = "";
      } else if (rect.bottom - height <= topOffset) {
        // Products ended: rest at the bottom of the column
        inner.style.position = "absolute";
        inner.style.top = "";
        inner.style.bottom = "0px";
        inner.style.left = "0px";
        inner.style.width = `${rect.width}px`;
      } else {
        // Stuck while scrolling
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

/* ---------- Page scroll lock (works on iOS Safari too) ----------
   Pins the body in place and restores the exact scroll position on unlock. */
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
    };
  }, [locked]);
}

/* ---------- Mobile bottom sheet ---------- */
function BottomSheet({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
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
          {/* Overlay */}
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

          {/* Sheet */}
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
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-[0_-12px_40px_rgba(42,41,103,0.18)] md:hidden"
          >
            {/* Drag handle */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex shrink-0 cursor-grab touch-none justify-center pb-1 pt-3"
            >
              <span className="h-1 w-10 rounded-full bg-[#dbe1e5]" />
            </div>

            {/* Header */}
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
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-navy transition-colors hover:bg-ash"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              {children}
            </div>

            {/* Footer (optional) */}
            {footer ? (
              <div className="shrink-0 border-t border-line px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
                {footer}
              </div>
            ) : (
              <div className="shrink-0 pb-[env(safe-area-inset-bottom)]" />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- Mobile bottom bar (Filter + Sort) and its sheets ---------- */
function MobileFilterBar({
  visible,
  filter,
  setFilter,
  sort,
  setSort,
}: {
  visible: boolean;
  filter: string;
  setFilter: (value: string) => void;
  sort: SortOption;
  setSort: (value: SortOption) => void;
}) {
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);

  useBodyScrollLock(sheet !== null);

  // Close the sheet if the viewport grows to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setSheet(null);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const close = () => setSheet(null);

  const barButton =
    "flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy transition-colors active:bg-ash";

  return (
    <MotionConfig reducedMotion="user">
      {/* Bottom bar */}
      <AnimatePresence>
        {(visible || sheet !== null) && (
          <motion.div
            key="mobile-bar"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-stretch bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(42,41,103,0.08)] md:hidden"
          >
            <button
              type="button"
              onClick={() => setSheet("filter")}
              aria-haspopup="dialog"
              className={barButton}
            >
              <SlidersHorizontal size={15} className="text-gold" />
              Filter
            </button>

            {/* Divider between the two buttons */}
            <span aria-hidden="true" className="my-3 w-px shrink-0 bg-line" />

            <button
              type="button"
              onClick={() => setSheet("sort")}
              aria-haspopup="dialog"
              className={barButton}
            >
              <ArrowUpDown size={15} className="text-gold" />
              Sort
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter sheet */}
      <BottomSheet open={sheet === "filter"} title="Filters" onClose={close}>
        <h4 className="mb-2 text-[11px] font-semibold text-navy">Category</h4>
        <div role="radiogroup" aria-label="Category">
          {categories.map((category) => {
            const count =
              category === "All"
                ? products.length
                : products.filter((p) => p.category === category).length;
            const selected = filter === category;

            return (
              <label
                key={category}
                className="flex min-h-[48px] cursor-pointer items-center gap-3 border-b border-line last:border-b-0"
              >
                <input
                  type="radio"
                  name="product-category-mobile"
                  value={category}
                  checked={selected}
                  onChange={() => {
                    setFilter(category);
                    close();
                  }}
                  className="h-4 w-4 shrink-0 accent-[#2a2967]"
                />
                <span
                  className={`flex-1 text-[13px] ${
                    selected ? "font-medium text-navy" : "text-cool"
                  }`}
                >
                  {category}
                </span>
                <span className="text-[11px] tabular-nums text-[#9299a0]">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </BottomSheet>

      {/* Sort sheet */}
      <BottomSheet open={sheet === "sort"} title="Sort by" onClose={close}>
        <div role="radiogroup" aria-label="Sort by">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const selected = option.value === sort;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setSort(option.value);
                  close();
                }}
                className={`flex min-h-[48px] w-full items-center gap-3 border-b border-line text-left text-[13px] last:border-b-0 ${
                  selected ? "font-medium text-navy" : "text-cool"
                }`}
              >
                <Icon
                  size={16}
                  className={selected ? "text-gold" : "text-[#9299a0]"}
                />
                <span className="flex-1">{option.label}</span>
                {selected && <Check size={16} className="text-gold" />}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </MotionConfig>
  );
}

export default function ProductsPage() {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState<SortOption>("featured");
  const [barVisible, setBarVisible] = useState(false);
  const { columnRef, innerRef } = useStickyColumn(96);
  const catalogRef = useRef<HTMLElement>(null);

  // Show the mobile bar only while the catalog section is on screen,
  // so it never covers the hero or the footer.
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

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) => filter === "All" || product.category === filter,
    );

    switch (sort) {
      case "name-asc":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));

      case "name-desc":
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));

      case "category":
        return [...filtered].sort((a, b) =>
          a.category.localeCompare(b.category),
        );

      default:
        return filtered;
    }
  }, [filter, sort]);

  return (
    <PageFrame active="Products">
      {/* ================= HERO ================= */}
      <section className="bg-white px-6 pb-12 pt-[125px] md:px-[5%] md:pb-[55px] md:pt-[150px]">
        <Reveal>
          <div className="mx-auto flex max-w-[1310px] flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-[850px]">
              <h1 className="font-manrope text-[42px] font-semibold leading-[1.08] tracking-[-0.035em] text-navy md:text-[clamp(45px,5.5vw,72px)]">
                Objects for{" "}
                <em className="text-gold not-italic">considered rooms.</em>
              </h1>

              <p className="mt-5 max-w-[650px] text-[14px] leading-[1.8] text-cool md:text-[16px]">
                Explore a considered library of fibers, textures, and natural
                color stories. Every design is a starting point for a piece made
                specifically for your space.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= PRODUCT CATALOG ================= */}
      {/* Extra bottom padding on mobile leaves room for the fixed bottom bar */}
      <section
        ref={catalogRef}
        className="bg-ash px-2 pb-28 pt-12 sm:px-5 md:px-[5%] md:py-[55px]"
      >
        <div className="mx-auto max-w-[1310px]">
          {/* Catalog Heading */}
          <Reveal className="px-2">
            <div className="mb-7 flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-manrope text-[30px] font-normal text-navy md:text-[36px]">
                  Popular products
                </h2>

                <p className="mt-2 text-[13px] text-cool">
                  Ready for custom sizing, colors, and direct inquiry.
                </p>
              </div>

              <span className="text-[12px] text-cool">
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1 ? "design" : "designs"}
              </span>
            </div>
          </Reveal>

          {/*
            Central wrapper (2 columns on desktop):
            - Left: filter sidebar (desktop only), sticky while this wrapper is on screen.
            - Right: products, scroll with the normal page.
            On mobile the sidebar is removed; filters and sorting live in the
            bottom bar + bottom sheets instead.
          */}
          <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-7 lg:gap-10">
            {/* ================= FILTER SIDEBAR (desktop only) ================= */}
            <div
              ref={columnRef}
              className="relative hidden min-w-0 self-stretch md:block"
            >
              <div ref={innerRef} className="z-20 w-full">
                <aside className="rounded-xl border border-[#dbe1e5] bg-white p-5 md:p-6">
                  <div className="flex items-center gap-2 border-b border-line pb-4">
                    <SlidersHorizontal size={17} className="text-navy" />

                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-navy">
                      Filters
                    </h3>
                  </div>

                  {/* Category Filters */}
                  <div className="border-b border-line py-5">
                    <h4 className="mb-4 text-[11px] font-semibold text-navy">
                      Category
                    </h4>

                    <div className="space-y-3.5">
                      {categories.map((category) => {
                        const count =
                          category === "All"
                            ? products.length
                            : products.filter(
                                (product) => product.category === category,
                              ).length;

                        return (
                          <label
                            key={category}
                            className="flex cursor-pointer items-center gap-3"
                          >
                            <input
                              type="radio"
                              name="product-category"
                              value={category}
                              checked={filter === category}
                              onChange={() => setFilter(category)}
                              className="h-4 w-4 shrink-0 accent-[#2a2967]"
                            />

                            <span
                              className={`flex-1 text-[12px] ${
                                filter === category
                                  ? "font-medium text-navy"
                                  : "text-cool"
                              }`}
                            >
                              {category}
                            </span>

                            <span className="text-[11px] tabular-nums text-[#9299a0]">
                              {count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sorting Options */}
                  <div className="pt-5">
                    <span
                      id="product-sort-label"
                      className="mb-3 block text-[11px] font-semibold text-navy"
                    >
                      Sort by
                    </span>

                    <SortSelect value={sort} onChange={setSort} />
                  </div>

                  {/* Clear Filter */}
                  {filter !== "All" && (
                    <button
                      type="button"
                      onClick={() => setFilter("All")}
                      className="mt-5 w-full rounded-lg border border-line px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-navy transition-colors hover:border-navy"
                    >
                      Clear filters
                    </button>
                  )}
                </aside>
              </div>
            </div>

            {/* ================= PRODUCTS (scroll with page) ================= */}
            <div className="min-w-0">
              {visibleProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                  {visibleProducts.map((product, index) => (
                    <Reveal
                      key={product.name}
                      delay={(index % 3) * 100}
                      y={24}
                      duration={850}
                      className="h-full"
                    >
                      <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#dbe1e5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_12px_28px_rgba(42,41,103,0.08)]">
                        {/* Product Image */}
                        <div className="aspect-[4/3] overflow-hidden bg-[#e8e9e8]">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </div>

                        {/* Product Information */}
                        <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-[18px]">
                          <h3 className="font-manrope text-[15px] font-normal leading-[1.3] text-navy sm:text-[19px] md:text-[21px]">
                            {product.name}
                          </h3>

                          <p className="mt-2 line-clamp-3 flex-1 text-[11px] leading-[1.6] text-cool sm:line-clamp-none sm:text-[12px] sm:leading-[1.7]">
                            Natural fibers, thoughtful textures, and a
                            considered palette for architectural interiors.
                          </p>

                          {/* Enquire Button */}
                          <button
                            type="button"
                            onClick={() =>
                              window.alert(
                                `A consultation request for ${product.name} has been prepared.`,
                              )
                            }
                            className="mt-4 inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-navy bg-navy px-2 py-2.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-200 hover:bg-white hover:text-navy sm:mt-5 sm:min-h-[42px] sm:gap-2 sm:px-3 sm:text-[10px] sm:tracking-[0.08em]"
                          >
                            Enquire Now
                            <ArrowRight size={14} className="shrink-0" />
                          </button>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-line bg-white px-6 py-16 text-center">
                  <h3 className="font-manrope text-[24px] text-navy">
                    No designs found
                  </h3>

                  <p className="mt-2 text-[13px] text-cool">
                    Try selecting another category.
                  </p>

                  <button
                    type="button"
                    onClick={() => setFilter("All")}
                    className="mt-5 rounded-lg bg-navy px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
                  >
                    View all designs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MOBILE FILTER / SORT BAR + SHEETS ================= */}
      <MobileFilterBar
        visible={barVisible}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />

      {/* ================= PRODUCT VALUES ================= */}
      <section className="bg-white px-6 py-[65px] md:px-[5%] md:py-[85px]">
        <div className="mx-auto max-w-[1310px]">
          <Reveal>
            <div className="mb-8 max-w-[750px]">
              <h2 className="font-manrope text-[30px] font-normal leading-[1.2] text-navy md:text-[40px]">
                Made slowly. Specified precisely.
              </h2>

              <p className="mt-3 text-[13px] leading-[1.8] text-cool md:text-[15px]">
                From raw fiber to final placement, every stage is considered as
                part of the architecture.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Natural fibers only",
              "Small-batch botanical dyes",
              "Dense hand-knotting",
              "White-glove delivery",
            ].map((value, index) => (
              <Reveal key={value} delay={index * 100} duration={850}>
                <div className="h-full rounded-xl border border-[#dbe1e5] p-5 transition-colors duration-300 hover:border-gold md:p-6">
                  <Check size={17} className="text-gold" />

                  <h3 className="my-3 font-manrope text-[20px] font-normal leading-[1.3] text-navy">
                    {value}
                  </h3>

                  <p className="m-0 text-[12px] leading-[1.8] text-cool">
                    Honest materials and careful craft, documented for your
                    project file.
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
