"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  productApi,
  type Product,
  type ProductImage,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Package,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Hash,
} from "lucide-react";
import { ActiveToggle } from "@/components/ui/active-toggle";
import { optimisticToggle } from "@/lib/optimistic-toggle";

type ModalImageItem =
  | { isNew: false; url: string; imageId: string }
  | { isNew: true; file: File; previewUrl: string };

type FormState = {
  _id?: string;
  name: string;
  desc: string;
  order: number;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  desc: "",
  order: 0,
  isActive: true,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageList, setImageList] = useState<ModalImageItem[]>([]);
  const [showDescPreview, setShowDescPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Actions state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const prods = await productApi.list().catch(() => []);
      setProducts(prods);
    } catch (e: any) {
      toast.error(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open modal for new product
  function openNew() {
    setForm({
      ...EMPTY_FORM,
      order: products.length,
    });
    setImageList([]);
    setShowDescPreview(false);
    setModalOpen(true);
  }

  // Open modal for editing existing product
  function openEdit(p: Product) {
    setForm({
      _id: p._id,
      name: p.name || "",
      desc: p.desc || "",
      order: p.order ?? 0,
      isActive: p.isActive ?? true,
    });
    setImageList(
      (p.images || []).map((img) => ({
        isNew: false,
        url: img.url,
        imageId: img.imageId,
      }))
    );
    setShowDescPreview(false);
    setModalOpen(true);
  }

  // Image Upload Handlers
  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ModalImageItem[] = Array.from(files).map((file) => ({
      isNew: true,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImageList((prev) => [...prev, ...newItems]);
    e.target.value = "";
  }

  function removeImage(index: number) {
    setImageList((prev) => {
      const target = prev[index];
      if (target?.isNew && target.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= imageList.length) return;
    setImageList((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }

  // Save product (FormData)
  async function saveProduct() {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (imageList.length === 0) {
      toast.error("At least one product image is required");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("desc", form.desc);
      fd.append("order", String(form.order));
      fd.append("isActive", String(form.isActive));

      // Separate retained existing images and new files
      const retainedImages: ProductImage[] = [];
      imageList.forEach((item) => {
        if (!item.isNew) {
          retainedImages.push({ url: item.url, imageId: item.imageId });
        } else {
          fd.append("images", item.file);
        }
      });

      fd.append("existingImages", JSON.stringify(retainedImages));

      if (form._id) {
        await productApi.update(form._id, fd);
        toast.success("Product updated successfully");
      } else {
        await productApi.create(fd);
        toast.success("Product created successfully");
      }

      setModalOpen(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  // Optimistic Toggle
  async function toggle(p: Product) {
    setTogglingId(p._id);
    try {
      await optimisticToggle(p, setProducts, productApi.toggle, {
        on: "Product visible on website",
        off: "Product hidden from catalog",
      });
    } finally {
      setTogglingId(null);
    }
  }

  // Delete product
  async function remove(id: string) {
    try {
      await productApi.delete(id);
      toast.success("Product deleted");
      setDeleteId(null);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete product");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage product designs, imagery, and descriptions."
        action={
          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Product
          </Button>
        }
      />

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-slate-600 font-medium">No products created yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Add your first product with images, name, and description.
              </p>
              <Button onClick={openNew} size="sm">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add First Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 w-14">Order</th>
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 w-28">Status</th>
                    <th className="py-3.5 px-4 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => {
                    const cover = p.images?.[0]?.url || "/placeholder.png";
                    return (
                      <tr
                        key={p._id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 font-mono">
                            {p.order ?? 0}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={cover}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                              {p.images && p.images.length > 1 && (
                                <span className="absolute bottom-1 right-1 bg-black/60 text-[9px] text-white px-1 rounded-sm font-mono">
                                  +{p.images.length - 1}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 leading-snug">
                                {p.name}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400 font-mono mt-0.5">
                                <span>slug: <span className="text-slate-600 font-medium">/{p.slug}</span></span>
                                <span>•</span>
                                <span>id: <span className="text-slate-600 font-medium">{p.id || p._id}</span></span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-xs text-slate-500 max-w-md line-clamp-2">
                          {p.desc || "—"}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <ActiveToggle
                              active={p.isActive}
                              loading={togglingId === p._id}
                              onToggle={() => toggle(p)}
                              showLabel={false}
                            />
                            <Badge variant={p.isActive ? "success" : "default"}>
                              {p.isActive ? "Live" : "Hidden"}
                            </Badge>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(p._id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* ───────────────── Product Modal ───────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !saving && setModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200/80 my-8 overflow-hidden flex flex-col max-h-[92vh] z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#00355F] text-white flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {form._id ? "Edit Product" : "New Product"}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {form._id
                        ? "Update product details and images"
                        : "Add a new product with images"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !saving && setModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors text-slate-400 hover:text-slate-700 cursor-pointer"
                  disabled={saving}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Product Name *
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. Bespoke Axminster Carpets & Rugs"
                  />
                </div>

                {/* Multi-Image Upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Product Images *{" "}
                      <span className="text-[11px] font-normal text-slate-400">
                        (First image is the cover. Use arrows to reorder)
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00355F]/10 text-[#00355F] hover:bg-[#00355F]/20 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Add Images
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFilesSelected}
                      className="hidden"
                    />
                  </div>

                  {imageList.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-[#4A90C4] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20"
                    >
                      <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">
                        Click to upload product images
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        PNG, JPG, WEBP up to 10MB each
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {imageList.map((img, idx) => {
                        const url = img.isNew ? img.previewUrl : img.url;
                        const isCover = idx === 0;
                        return (
                          <div
                            key={idx}
                            className={`group relative rounded-xl border overflow-hidden bg-slate-100 aspect-square flex flex-col justify-between transition-all ${
                              isCover
                                ? "border-[#00355F] ring-2 ring-[#00355F]/30"
                                : "border-slate-200"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`Product image ${idx + 1}`}
                              className="w-full h-full object-cover absolute inset-0"
                            />

                            {/* Overlay Controls */}
                            <div className="relative z-10 flex items-center justify-between p-1.5 bg-gradient-to-b from-black/60 to-transparent">
                              {isCover ? (
                                <span className="bg-[#00355F] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                                  Cover
                                </span>
                              ) : (
                                <span className="text-[10px] text-white/80 font-mono px-1">
                                  #{idx + 1}
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="p-1 rounded-md bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                                title="Remove Image"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Bottom Reorder Controls */}
                            <div className="relative z-10 flex items-center justify-between p-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveImage(idx, idx - 1)}
                                className="p-1 rounded-md bg-black/50 hover:bg-black text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="Move Left"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === imageList.length - 1}
                                onClick={() => moveImage(idx, idx + 1)}
                                className="p-1 rounded-md bg-black/50 hover:bg-black text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="Move Right"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add more button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl border-2 border-dashed border-slate-200 hover:border-[#00355F] flex flex-col items-center justify-center aspect-square text-slate-400 hover:text-[#00355F] transition-colors cursor-pointer bg-slate-50/50"
                      >
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-[11px] font-semibold">
                          Add More
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Product Description
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowDescPreview(!showDescPreview)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00355F] hover:underline cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      {showDescPreview ? "Hide Live Preview" : "Show Live Preview"}
                    </button>
                  </div>

                  <Textarea
                    rows={5}
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    placeholder="Enter product description."
                    className="font-sans text-xs leading-relaxed"
                  />

                  {showDescPreview && (
                    <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Live Preview (as it will appear on website):
                      </div>
                      <div className="whitespace-pre-line font-normal leading-relaxed text-slate-800">
                        {form.desc.trim() || "(No description text entered)"}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order & Visibility */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Display Order
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="number"
                        value={form.order}
                        onChange={(e) =>
                          setForm({ ...form, order: Number(e.target.value) })
                        }
                        className="pl-9"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Visibility Status
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, isActive: !form.isActive })
                      }
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                        form.isActive
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <span>{form.isActive ? "Live in Catalog" : "Hidden"}</span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          form.isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/70 shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={saveProduct} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                  {form._id ? "Update Product" : "Publish Product"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {Boolean(deleteId) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 z-10 space-y-4"
            >
              <h3 className="text-base font-bold text-slate-900">
                Delete Product
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete this product? All images stored in Cloudinary for this product will be permanently purged.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteId && remove(deleteId)}
                >
                  Delete Product
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
