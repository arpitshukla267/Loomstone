"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  Layers,
  MapPin,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { defaultCategories } from "@/data/defaultCategories";
import {
  getAllProducts,
  saveProducts,
  resetProducts,
  type Product,
} from "@/data/products";

export default function AdminCmsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "backup">("products");
  const [toast, setToast] = useState("");

  // Modal states for Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(defaultCategories[0].title);
  const [formWeave, setFormWeave] = useState<Product["weave"]>("Hand Knotted");
  const [formStyle, setFormStyle] = useState<Product["style"]>("Modern Minimalist");
  const [formRooms, setFormRooms] = useState<Product["rooms"]>(["Living Room"]);
  const [formSizes, setFormSizes] = useState("5 x 8 ft, 6 x 9 ft, 8 x 10 ft, 9 x 12 ft, Custom Size");
  const [formMaterials, setFormMaterials] = useState("100% Hand-spun New Zealand Wool");
  const [formColorPalette, setFormColorPalette] = useState("Natural Ivory & Slate Grey");
  const [formPriceDisplay, setFormPriceDisplay] = useState("$1,800 – $3,200");
  const [formImage, setFormImage] = useState("/products/hand-knotted.png");
  const [formRoomImage, setFormRoomImage] = useState("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80");
  const [formDescription, setFormDescription] = useState("");
  const [formCraftDetails, setFormCraftDetails] = useState("Hand-knotted with over 120 knots per square inch.");
  const [formLeadTime, setFormLeadTime] = useState("Ready to Dispatch (48h)");
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const loadProducts = () => {
    setProducts(getAllProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory(defaultCategories[0].title);
    setFormWeave("Hand Knotted");
    setFormStyle("Modern Minimalist");
    setFormRooms(["Living Room"]);
    setFormSizes("5 x 8 ft, 6 x 9 ft, 8 x 10 ft, 9 x 12 ft, Custom Size");
    setFormMaterials("100% Hand-spun New Zealand Wool");
    setFormColorPalette("Natural Ivory & Slate Grey");
    setFormPriceDisplay("$1,800 – $3,200");
    setFormImage("/products/hand-knotted.png");
    setFormRoomImage("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80");
    setFormDescription("Artisanal handcrafted floor covering calibrated for luxury residential interiors.");
    setFormCraftDetails("Hand-knotted with over 120 knots per square inch, finished with hand-bound selvedges.");
    setFormLeadTime("Ready to Dispatch (48h)");
    setFormIsFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormWeave(prod.weave);
    setFormStyle(prod.style);
    setFormRooms(prod.rooms);
    setFormSizes(prod.sizes.join(", "));
    setFormMaterials(prod.materials);
    setFormColorPalette(prod.colorPalette);
    setFormPriceDisplay(prod.priceDisplay);
    setFormImage(prod.image);
    setFormRoomImage(prod.roomImage);
    setFormDescription(prod.description);
    setFormCraftDetails(prod.craftDetails);
    setFormLeadTime(prod.leadTime);
    setFormIsFeatured(Boolean(prod.isFeatured));
    setIsModalOpen(true);
  };

  const handleToggleRoom = (room: Product["rooms"][number]) => {
    if (formRooms.includes(room)) {
      if (formRooms.length > 1) {
        setFormRooms(formRooms.filter((r) => r !== room));
      }
    } else {
      setFormRooms([...formRooms, room]);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const slug =
      editingProduct?.slug ||
      formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const sizesArray = formSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      slug,
      name: formName.trim(),
      category: formCategory,
      weave: formWeave,
      style: formStyle,
      rooms: formRooms,
      sizes: sizesArray.length ? sizesArray : ["Custom Size"],
      materials: formMaterials.trim(),
      colorPalette: formColorPalette.trim(),
      priceDisplay: formPriceDisplay.trim(),
      image: formImage.trim() || "/products/hand-knotted.png",
      roomImage: formRoomImage.trim() || "/products/hand-knotted.png",
      description: formDescription.trim(),
      craftDetails: formCraftDetails.trim(),
      leadTime: formLeadTime.trim(),
      isFeatured: formIsFeatured,
    };

    let nextProducts: Product[];
    if (editingProduct) {
      nextProducts = products.map((p) =>
        p.id === editingProduct.id ? updatedProduct : p
      );
      showToast(`Updated product "${updatedProduct.name}"`);
    } else {
      nextProducts = [updatedProduct, ...products];
      showToast(`Created new product "${updatedProduct.name}"`);
    }

    setProducts(nextProducts);
    saveProducts(nextProducts);
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalogue?`)) {
      const next = products.filter((p) => p.id !== id);
      setProducts(next);
      saveProducts(next);
      showToast(`Deleted product "${name}"`);
    }
  };

  const handleToggleFeatured = (prod: Product) => {
    const next = products.map((p) =>
      p.id === prod.id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    setProducts(next);
    saveProducts(next);
    showToast(`Updated featured status for "${prod.name}"`);
  };

  const handleResetCatalog = () => {
    if (
      window.confirm(
        "Reset the entire catalogue to factory defaults? Any custom products will be restored."
      )
    ) {
      resetProducts();
      loadProducts();
      showToast("Catalogue restored to default 14 pieces.");
    }
  };

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `loomstone_products_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported catalogue JSON.");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.weave.toLowerCase().includes(search.toLowerCase()) ||
      p.style.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ash text-ink font-sans">
      {/* CMS Header Bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cool hover:text-navy"
            >
              <ArrowLeft size={16} /> Live Site
            </Link>
            <span className="h-5 w-px bg-line" />
            <div>
              <h1 className="font-manrope text-[18px] font-bold text-navy sm:text-[22px]">
                Loomstone Atelier CMS
              </h1>
              <span className="text-[11px] font-medium text-cool/70">
                Products, Weave Typologies & Spatial Showcase Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-navy transition-colors hover:border-navy sm:inline-flex"
            >
              <Eye size={14} /> Preview Archive
            </Link>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-gold hover:text-navy"
            >
              <Plus size={16} /> Add New Rug
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Container */}
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* KPI Stats Overview */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cool/60">
              Total Rugs
            </span>
            <span className="mt-1 block font-manrope text-[28px] font-bold text-navy">
              {products.length}
            </span>
            <span className="text-[11px] text-cool">Active in showcase</span>
          </div>

          <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cool/60">
              Categories
            </span>
            <span className="mt-1 block font-manrope text-[28px] font-bold text-navy">
              {defaultCategories.length}
            </span>
            <span className="text-[11px] text-cool">Weaving typologies</span>
          </div>

          <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cool/60">
              Curated Featured
            </span>
            <span className="mt-1 block font-manrope text-[28px] font-bold text-gold">
              {products.filter((p) => p.isFeatured).length}
            </span>
            <span className="text-[11px] text-cool">Spotlight pieces</span>
          </div>

          <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cool/60">
              Spatial Rooms
            </span>
            <span className="mt-1 block font-manrope text-[28px] font-bold text-navy">
              5
            </span>
            <span className="text-[11px] text-cool">Living, Bed, Dining, etc.</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-line">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`border-b-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "products"
                ? "border-navy text-navy"
                : "border-transparent text-cool/70 hover:text-navy"
            }`}
          >
            Products Catalogue ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`border-b-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "categories"
                ? "border-navy text-navy"
                : "border-transparent text-cool/70 hover:text-navy"
            }`}
          >
            Weave Categories ({defaultCategories.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("backup")}
            className={`border-b-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "backup"
                ? "border-navy text-navy"
                : "border-transparent text-cool/70 hover:text-navy"
            }`}
          >
            Data Sync & Export
          </button>
        </div>

        {/* TAB 1: PRODUCTS TABLE */}
        {activeTab === "products" && (
          <div className="rounded-xl border border-line bg-white shadow-sm overflow-hidden">
            {/* Table Search & Actions */}
            <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cool/50"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by name, weave, category..."
                  className="w-full rounded-lg border border-line bg-ash/50 py-2 pl-9 pr-3 text-xs text-ink outline-none focus:border-navy focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadProducts}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-cool hover:text-navy"
                >
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ash/70 text-[10px] font-bold uppercase tracking-wider text-cool/70 border-b border-line">
                  <tr>
                    <th className="py-3 px-4">Rug Piece</th>
                    <th className="py-3 px-4">Category & Weave</th>
                    <th className="py-3 px-4">Style</th>
                    <th className="py-3 px-4">Suitable Rooms</th>
                    <th className="py-3 px-4">Price Display</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-ash/40 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-ash">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/products/${prod.slug}`}
                              target="_blank"
                              className="font-semibold text-navy hover:text-gold"
                            >
                              {prod.name}
                            </Link>
                            <span className="block text-[10px] text-cool/60">
                              slug: /{prod.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Weave */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-navy block">
                          {prod.category}
                        </span>
                        <span className="inline-block rounded bg-navy/10 px-1.5 py-0.5 text-[9px] font-semibold text-navy mt-0.5">
                          {prod.weave}
                        </span>
                      </td>

                      {/* Style */}
                      <td className="py-3 px-4 text-cool">{prod.style}</td>

                      {/* Rooms */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {prod.rooms.map((room) => (
                            <span
                              key={room}
                              className="rounded bg-ash px-1.5 py-0.5 text-[10px] text-cool"
                            >
                              {room}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-semibold text-navy">
                        {prod.priceDisplay}
                      </td>

                      {/* Featured toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(prod)}
                          title="Toggle featured status"
                          className={`rounded-full p-1.5 transition-colors ${
                            prod.isFeatured
                              ? "bg-gold/20 text-gold"
                              : "text-cool/30 hover:text-cool"
                          }`}
                        >
                          <Sparkles size={16} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            title="View live"
                            className="rounded p-1.5 text-cool hover:bg-ash hover:text-navy"
                          >
                            <ExternalLink size={14} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            title="Edit"
                            className="rounded p-1.5 text-navy hover:bg-navy/10"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            title="Delete"
                            className="rounded p-1.5 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="py-12 text-center text-cool">
                  <p>No products match your search query.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES OVERVIEW */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {defaultCategories.map((cat) => {
              const count = products.filter(
                (p) =>
                  p.category.toLowerCase() === cat.title.toLowerCase() ||
                  p.weave.toLowerCase() === cat.title.toLowerCase()
              ).length;

              return (
                <div
                  key={cat.title}
                  className="flex gap-4 rounded-xl border border-line bg-white p-5 shadow-sm"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-ash">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-manrope text-[18px] font-normal text-navy">
                        {cat.title}
                      </h3>
                      <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-[10px] font-bold text-navy">
                        {count} Designs
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-cool">
                      {cat.text}
                    </p>

                    <div className="mt-4">
                      <Link
                        href={`/products?category=${encodeURIComponent(cat.title)}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-navy hover:text-gold"
                      >
                        Filter In Archive <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: BACKUP & DATA MANAGEMENT */}
        {activeTab === "backup" && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
              <h3 className="font-manrope text-[18px] font-semibold text-navy">
                Data Persistence & Live Synchronization
              </h3>
              <p className="mt-2 text-xs text-cool leading-relaxed">
                Changes made in this CMS are instantly persisted to your browser storage and synchronised live across the website catalog, filters, and product detail pages.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy/90"
                >
                  <Download size={14} /> Export Catalogue (JSON)
                </button>

                <button
                  type="button"
                  onClick={handleResetCatalog}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-700 hover:bg-rose-100"
                >
                  <RotateCcw size={14} /> Restore Factory Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-cool hover:bg-ash hover:text-navy"
            >
              <X size={20} />
            </button>

            <h2 className="font-manrope text-[24px] font-bold text-navy">
              {editingProduct ? `Edit Rug: ${editingProduct.name}` : "Commission New Rug to Catalogue"}
            </h2>
            <p className="mt-1 text-xs text-cool">
              Define the architectural specifications, materials, and room suitability for this design piece.
            </p>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                  Rug Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Kashmir Botanical Medallion"
                  className="mt-1.5 w-full rounded-lg border border-line p-2.5 text-xs text-ink outline-none focus:border-navy"
                />
              </div>

              {/* Category & Weave */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Category (from defaultCategories) *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-white p-2.5 text-xs text-ink outline-none focus:border-navy"
                  >
                    {defaultCategories.map((c) => (
                      <option key={c.title} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Weave Technique *
                  </label>
                  <select
                    value={formWeave}
                    onChange={(e) => setFormWeave(e.target.value as Product["weave"])}
                    className="mt-1.5 w-full rounded-lg border border-line bg-white p-2.5 text-xs text-ink outline-none focus:border-navy"
                  >
                    <option value="Hand Knotted">Hand Knotted</option>
                    <option value="Hand Tufted">Hand Tufted</option>
                    <option value="Handloom">Handloom</option>
                    <option value="Flatweave">Flatweave</option>
                    <option value="Power Loomed">Power Loomed</option>
                  </select>
                </div>
              </div>

              {/* Style & Price */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Design Style *
                  </label>
                  <select
                    value={formStyle}
                    onChange={(e) => setFormStyle(e.target.value as Product["style"])}
                    className="mt-1.5 w-full rounded-lg border border-line bg-white p-2.5 text-xs text-ink outline-none focus:border-navy"
                  >
                    <option value="Modern Minimalist">Modern Minimalist</option>
                    <option value="Heritage & Vintage">Heritage & Vintage</option>
                    <option value="Geometric & Linear">Geometric & Linear</option>
                    <option value="Organic & Abstract">Organic & Abstract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Price Showcase Range *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPriceDisplay}
                    onChange={(e) => setFormPriceDisplay(e.target.value)}
                    placeholder="e.g. $1,850 – $3,600"
                    className="mt-1.5 w-full rounded-lg border border-line p-2.5 text-xs text-ink outline-none focus:border-navy"
                  />
                </div>
              </div>

              {/* Rooms Multi-select */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                  Suitable Rooms / Spatial Placement *
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      "Living Room",
                      "Bedroom",
                      "Dining Room",
                      "Hallway & Entryway",
                      "Office & Study",
                    ] as Product["rooms"][number][]
                  ).map((room) => {
                    const isSelected = formRooms.includes(room);
                    return (
                      <button
                        type="button"
                        key={room}
                        onClick={() => handleToggleRoom(room)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? "border-navy bg-navy text-white"
                            : "border-line bg-ash/60 text-cool hover:border-navy"
                        }`}
                      >
                        {isSelected && <Check size={12} className="inline mr-1" />}
                        {room}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizes Available */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                  Standard Sizes (comma-separated)
                </label>
                <input
                  type="text"
                  value={formSizes}
                  onChange={(e) => setFormSizes(e.target.value)}
                  placeholder="5 x 8 ft, 6 x 9 ft, 8 x 10 ft, 9 x 12 ft, Custom Size"
                  className="mt-1.5 w-full rounded-lg border border-line p-2.5 text-xs text-ink outline-none focus:border-navy"
                />
              </div>

              {/* Materials & Colors */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Fiber & Material Composition
                  </label>
                  <input
                    type="text"
                    value={formMaterials}
                    onChange={(e) => setFormMaterials(e.target.value)}
                    placeholder="e.g. 100% Hand-spun New Zealand Wool & Silk"
                    className="mt-1.5 w-full rounded-lg border border-line p-2.5 text-xs text-ink outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Color Palette
                  </label>
                  <input
                    type="text"
                    value={formColorPalette}
                    onChange={(e) => setFormColorPalette(e.target.value)}
                    placeholder="e.g. Terracotta, Warm Sandstone & Ochre"
                    className="mt-1.5 w-full rounded-lg border border-line p-2.5 text-xs text-ink outline-none focus:border-navy"
                  />
                </div>
              </div>

              {/* Image URLs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Studio Rug Image (URL or path)
                  </label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="/products/hand-knotted.png or https://..."
                    className="mt-1.5 w-full rounded-lg border border-line p-2.5 text-xs text-ink outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Room Context Image (URL or path)
                  </label>
                  <input
                    type="text"
                    value={formRoomImage}
                    onChange={(e) => setFormRoomImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-1.5 w-full rounded-lg border border-line p-2.5 text-xs text-ink outline-none focus:border-navy"
                  />
                </div>
              </div>

              {/* Description & Craft Details */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                  Architectural Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the aesthetic, tactile feel, and light interaction..."
                  className="mt-1.5 w-full rounded-lg border border-line p-2.5 text-xs text-ink outline-none focus:border-navy"
                />
              </div>

              {/* Lead Time & Featured */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-navy">
                    Lead Time
                  </label>
                  <input
                    type="text"
                    value={formLeadTime}
                    onChange={(e) => setFormLeadTime(e.target.value)}
                    placeholder="Ready to Dispatch (48h) or Crafted to Order"
                    className="mt-1.5 w-full rounded-lg border border-line p-2.5 text-xs text-ink outline-none focus:border-navy"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#2a2967]"
                    />
                    <span className="text-xs font-semibold text-navy">
                      Highlight as Featured / Curated Design
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-line px-5 py-2.5 text-xs font-semibold text-cool hover:text-navy"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-navy px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-gold hover:text-navy"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border-l-4 border-gold bg-navy px-5 py-3 text-xs font-semibold text-white shadow-xl">
          <Check size={16} className="text-gold" />
          {toast}
        </div>
      )}
    </div>
  );
}
