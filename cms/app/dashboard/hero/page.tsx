"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { heroApi, type HeroSlide } from "@/lib/api";
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
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { ActiveToggle } from "@/components/ui/active-toggle";
import { optimisticToggle } from "@/lib/optimistic-toggle";

type FormState = {
  _id?: string;
  heading: string;
  description: string;
  primaryText: string;
  secondaryText: string;
  order: number;
  isActive: boolean;
  image?: string;
  imageFile?: File | null;
};

const EMPTY: FormState = {
  heading: "",
  description: "",
  primaryText: "Explore Collections",
  secondaryText: "Inquire About a Custom Rug",
  order: 0,
  isActive: true,
  image: "",
  imageFile: null,
};

export default function HeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
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
      const data = await heroApi.list();
      setSlides(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load hero slides");
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
      order: slides.length,
      imageFile: null,
    });
    setModalOpen(true);
  }

  function openEdit(s: HeroSlide) {
    setForm({
      _id: s._id,
      heading: s.heading || "",
      description: s.description || "",
      primaryText: s.primaryText || "",
      secondaryText: s.secondaryText || "",
      order: s.order ?? 0,
      isActive: s.isActive ?? true,
      image: s.image || s.imageUrl || "",
      imageFile: null,
    });
    setModalOpen(true);
  }

  async function save() {
    if (!form.heading.trim()) {
      toast.error("Heading is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.primaryText.trim()) {
      toast.error("Primary button text is required");
      return;
    }
    if (!form._id && !form.imageFile) {
      toast.error("Slide image is required");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("heading", form.heading.trim());
      fd.append("description", form.description.trim());
      fd.append("primaryText", form.primaryText.trim());
      if (form.secondaryText.trim()) {
        fd.append("secondaryText", form.secondaryText.trim());
      }
      fd.append("order", String(form.order));
      fd.append("isActive", String(form.isActive));

      if (form.imageFile) {
        fd.append("image", form.imageFile);
      }

      if (form._id) {
        await heroApi.update(form._id, fd);
        toast.success("Hero slide updated");
      } else {
        await heroApi.create(fd);
        toast.success("Hero slide created");
      }
      setModalOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(s: HeroSlide) {
    setTogglingId(s._id);
    try {
      await optimisticToggle(s, setSlides, heroApi.toggle, {
        on: "Slide active on homepage",
        off: "Slide hidden from homepage",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function doDelete(id: string) {
    try {
      await heroApi.delete(id);
      toast.success("Hero slide deleted");
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete slide");
    }
  }

  // Format heading with gold styling for preview
  const formatHeading = (h: string) => {
    const parts = h.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <span key={i} className="text-[#D4AF37] font-semibold">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hero Slides"
        description="Manage the slides and banners displayed on the Loomstone homepage."
        action={
          <Button
            onClick={openNew}
            size="lg"
            className="shadow-md shadow-[#00355F]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
        </div>
      ) : slides.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">No slides found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Get started by creating your first homepage hero slider.
            </p>
            <Button onClick={openNew} className="mt-2">
              <Plus className="w-4 h-4" /> Add Slide
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((s) => {
            const img = s.image || s.imageUrl;
            return (
              <Card
                key={s._id}
                className="overflow-hidden flex flex-col justify-between group hover:border-[#B2CDFA] hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="relative w-full h-56 bg-slate-900 overflow-hidden">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={s.heading}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                    <div className="absolute top-3 right-3">
                      <Badge variant={s.isActive ? "success" : "warning"}>
                        {s.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>

                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {s.order}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg leading-snug line-clamp-2">
                        {formatHeading(s.heading)}
                      </h3>
                    </div>
                  </div>

                  <CardBody className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {s.description || "No description provided."}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                      {s.primaryText && (
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium border border-slate-200">
                          Button 1: {s.primaryText}
                        </span>
                      )}
                      {s.secondaryText && (
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium border border-slate-200">
                          Button 2: {s.secondaryText}
                        </span>
                      )}
                    </div>
                  </CardBody>
                </div>

                <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <ActiveToggle
                    active={Boolean(s.isActive)}
                    loading={togglingId === s._id}
                    onToggle={() => toggle(s)}
                  />

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(s)}
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(s._id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form._id ? "Edit Hero Slide" : "Add Hero Slide"}
        size="lg"
      >
        <div className="flex flex-col gap-4">
          <div>
            <Input
              label="Slide Heading"
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
              placeholder="Handmade rugs for *beautiful* spaces."
              className="w-full"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: Wrap words in asterisks like <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">*golden*</code> to display them in gold accent.
            </p>
          </div>

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Carefully woven by hand using natural wool and silk..."
            rows={3}
            className="w-full"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Primary Button Text"
              value={form.primaryText}
              onChange={(e) =>
                setForm({ ...form, primaryText: e.target.value })
              }
              placeholder="Explore Collections"
            />
            <Input
              label="Secondary Button Text (optional)"
              value={form.secondaryText}
              onChange={(e) =>
                setForm({ ...form, secondaryText: e.target.value })
              }
              placeholder="Inquire About a Custom Rug"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Slide Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-[#00355F] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50"
            >
              {form.imageFile ? (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 overflow-hidden text-left">
                    <ImageIcon className="w-5 h-5 text-[#00355F] shrink-0" />
                    <span className="text-xs font-medium text-slate-800 truncate">
                      {form.imageFile.name} ({(form.imageFile.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, imageFile: null });
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : form.image ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image}
                    alt="Current"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <div className="mt-2 text-xs text-slate-500 flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Click to choose a new image
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-500">
                  <Upload className="w-7 h-7 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">
                    Click to select an image from your computer
                  </span>
                  <span className="text-[11px] text-slate-400">
                    JPG, PNG, WEBP up to 5MB
                  </span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setForm({ ...form, imageFile: file });
                e.target.value = "";
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-center pt-2">
            <Input
              label="Display Order"
              type="number"
              value={String(form.order)}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Visibility
              </label>
              <ActiveToggle
                active={Boolean(form.isActive)}
                onToggle={() =>
                  setForm({ ...form, isActive: !form.isActive })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving}>
              {form._id ? "Save Changes" : "Create Slide"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Slide?"
        size="sm"
      >
        <p className="text-sm text-slate-600 mb-6">
          This action will permanently remove this hero slide and its image.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteId && doDelete(deleteId)}
          >
            Delete Slide
          </Button>
        </div>
      </Modal>
    </div>
  );
}
