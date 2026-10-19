"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { categoryApi, type Category } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Tag,
  Hash,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { ActiveToggle } from "@/components/ui/active-toggle";
import { optimisticToggle } from "@/lib/optimistic-toggle";

type FormState = {
  _id?: string;
  name: string;
  desc: string;
  order: number;
  isActive: boolean;
  image?: string;
  imageFile?: File | null;
};

const EMPTY: FormState = {
  name: "",
  desc: "",
  order: 0,
  isActive: true,
  image: "",
  imageFile: null,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryApi.list();
      setCategories(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openNew() {
    setForm({
      ...EMPTY,
      order: categories.length,
      imageFile: null,
    });
    setModalOpen(true);
  }

  function openEdit(c: Category) {
    setForm({
      _id: c._id,
      name: c.name || "",
      desc: c.desc || c.text || "",
      order: c.order ?? 0,
      isActive: c.isActive ?? true,
      image: c.image || "",
      imageFile: null,
    });
    setModalOpen(true);
  }

  async function save() {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("desc", form.desc.trim());
      fd.append("order", String(form.order));
      fd.append("isActive", String(form.isActive));

      if (form.imageFile) {
        fd.append("image", form.imageFile);
      }

      if (form._id) {
        await categoryApi.update(form._id, fd);
        toast.success("Category updated successfully");
      } else {
        await categoryApi.create(fd);
        toast.success("Category created successfully");
      }
      setModalOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(c: Category) {
    setTogglingId(c._id);
    try {
      await optimisticToggle(c, setCategories, categoryApi.toggle, {
        on: "Category visible on website",
        off: "Category hidden from website",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function remove(id: string) {
    try {
      await categoryApi.delete(id);
      toast.success("Category deleted");
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product weave techniques, imagery, and descriptions. Active categories appear directly in the website category section and filter box."
        action={
          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Category
          </Button>
        }
      />

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Tag className="w-6 h-6" />
              </div>
              <p className="text-slate-600 font-medium">No categories yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create categories for your rugs (e.g. Hand-Knotted, Hand-Tufted, Handloom, Flatweave).
              </p>
              <Button onClick={openNew} size="sm">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add First Category
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 w-16">Order</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 w-32">Status</th>
                    <th className="py-3.5 px-4 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 font-mono">
                          {c.order ?? 0}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/70">
                            {c.image ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={c.image}
                                alt={c.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900">
                              {c.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-500 max-w-md line-clamp-2">
                        {c.desc || c.text || "—"}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <ActiveToggle
                            active={c.isActive}
                            loading={togglingId === c._id}
                            onToggle={() => toggle(c)}
                            showLabel={false}
                          />
                          <Badge variant={c.isActive ? "success" : "default"}>
                            {c.isActive ? "Active" : "Hidden"}
                          </Badge>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(c)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(c._id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form._id ? "Edit Category" : "New Category"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category Name *
            </label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Hand-Knotted Rugs"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <Textarea
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="e.g. Individually knotted by skilled artisans, these exceptionally durable rugs can last 50–100+ years."
            />
          </div>

          {/* Category Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category Image
            </label>

            {form.imageFile ? (
              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(form.imageFile)}
                    alt="New upload preview"
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <span className="text-xs font-medium text-slate-800 block truncate max-w-xs">
                      {form.imageFile.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      New image ready to upload
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, imageFile: null })}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : form.image ? (
              <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image}
                    alt={form.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <span className="text-xs font-medium text-slate-800 block">
                      Current Cloudinary Image
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-[#00355F] hover:underline cursor-pointer"
                    >
                      Click to replace
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-[#4A90C4] rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50"
              >
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-700">
                  Click to upload category photo
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setForm({ ...form, imageFile: file });
              }}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  form.isActive
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <span>{form.isActive ? "Active (Shown)" : "Hidden"}</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    form.isActive ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              {form._id ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this category? The associated image in Cloudinary will also be purged.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && remove(deleteId)}
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
