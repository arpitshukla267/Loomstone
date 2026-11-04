"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  inspirationApi,
  type InspirationItem,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Palette,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

type InspirationModalState = {
  _id?: string;
  title: string;
  category: string;
  label: string;
  text: string;
  image?: string;
  imageFile?: File | null;
  order: number;
};

const EMPTY_INSPIRATION_MODAL: InspirationModalState = {
  title: "",
  category: "",
  label: "",
  text: "",
  image: "",
  imageFile: null,
  order: 0,
};

export default function InspirationPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<InspirationItem[]>([]);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<InspirationModalState>(
    EMPTY_INSPIRATION_MODAL
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await inspirationApi.list();
      setItems(data || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load inspiration items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setForm({ ...EMPTY_INSPIRATION_MODAL, order: items.length });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: InspirationItem) => {
    setForm({
      _id: item._id,
      title: item.title,
      category: item.category || "",
      label: item.label || "",
      text: item.text || "",
      image: item.image,
      imageFile: null,
      order: item.order,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form._id && !form.imageFile) {
      toast.error("Please upload an image for this inspiration item");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("category", form.category.trim());
      formData.append("label", form.label.trim());
      formData.append("text", form.text.trim());
      formData.append("order", String(form.order ?? items.length));
      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      if (form._id) {
        await inspirationApi.update(form._id, formData);
        toast.success("Inspiration item updated");
      } else {
        await inspirationApi.create(formData);
        toast.success("Inspiration item added to collage");
      }

      setModalOpen(false);
      setForm(EMPTY_INSPIRATION_MODAL);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to save inspiration item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await inspirationApi.delete(id);
      toast.success("Inspiration item deleted");
      setDeleteId(null);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete item");
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setItems(next);

    try {
      await inspirationApi.reorder(next.map((item) => item._id));
      toast.success("Order updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update order");
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Inspirations Collage"
        description="Manage images in the inspiration masonry collage. Images keep their natural proportions, and adding more extends the collage height."
      />

      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-slate-900">
                  Collage Images ({items.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Every image retains its natural aspect ratio in a responsive masonry collage.
              </p>
            </div>
            <Button
              onClick={handleOpenAdd}
              className="bg-gold hover:bg-gold/90 text-navy font-semibold self-start sm:self-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Collage Image
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-slate-200 p-12 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                No inspiration images yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Upload images to create your dynamic masonry collage.
              </p>
              <Button
                onClick={handleOpenAdd}
                className="mt-4 bg-navy hover:bg-navy/90 text-white"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Image
              </Button>
            </div>
          ) : (
            /* Masonry collage layout matching frontend */
            <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {items.map((item, index) => (
                <div
                  key={item._id}
                  className="group relative break-inside-avoid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition duration-200 hover:border-gold/60 hover:shadow-md"
                >
                  {/* Top Bar with Reorder and Actions */}
                  <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Reorder Buttons */}
                    <div className="flex gap-1 bg-white/90 backdrop-blur-xs rounded-md p-1 shadow-sm border border-slate-200">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMove(index, -1)}
                        className="p-1 text-slate-600 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move backward"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === items.length - 1}
                        onClick={() => handleMove(index, 1)}
                        className="p-1 text-slate-600 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move forward"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1 bg-white/90 backdrop-blur-xs rounded-md p-1 shadow-sm border border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 text-slate-600 hover:text-gold"
                        title="Edit details"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(item._id)}
                        className="p-1 text-slate-600 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Natural dimensions image */}
                  <div className="relative w-full bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="block w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Caption & details */}
                  <div className="p-3 bg-white border-t border-slate-100">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        #{index + 1}
                      </span>
                    </div>
                    {item.category && (
                      <p className="text-[11px] text-gold font-medium mt-0.5 truncate">
                        {item.category}
                      </p>
                    )}
                    {item.text && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {item.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Add / Edit Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form._id ? "Edit Collage Image" : "Add Collage Image"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Title *
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Unbleached Highland Fleece"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Category (Optional)
              </label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Weave Textures"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Label / Tag (Optional)
              </label>
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="e.g. Pure Mountain Wool"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <Textarea
              rows={2}
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Brief note or story behind the texture / image..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Image File {form._id ? "(Optional - keep existing if blank)" : "*"}
            </label>

            {form.image && !form.imageFile && (
              <div className="mb-3 relative max-h-48 w-full rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image}
                  alt="Existing"
                  className="max-h-48 w-auto object-contain"
                />
              </div>
            )}

            {form.imageFile && (
              <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-gold" />
                  <span className="text-xs font-medium text-slate-700 truncate max-w-xs">
                    {form.imageFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageFile: null })}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setForm({ ...form, imageFile: file });
              }}
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-dashed"
            >
              <Upload className="mr-2 h-4 w-4" />
              {form.image || form.imageFile ? "Change Image" : "Upload Image"}
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-navy hover:bg-navy/90 text-white"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {form._id ? "Update Image" : "Add to Collage"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to remove this image from the collage? The image asset will also be cleaned up.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
