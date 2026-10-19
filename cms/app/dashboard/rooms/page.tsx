"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { roomApi, type Room } from "@/lib/api";
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
  ExternalLink,
} from "lucide-react";
import { ActiveToggle } from "@/components/ui/active-toggle";
import { optimisticToggle } from "@/lib/optimistic-toggle";

type FormState = {
  _id?: string;
  name: string;
  heading: string;
  desc: string;
  href: string;
  order: number;
  isActive: boolean;
  image?: string;
  imageFile?: File | null;
};

const EMPTY: FormState = {
  name: "",
  heading: "",
  desc: "",
  href: "",
  order: 0,
  isActive: true,
  image: "",
  imageFile: null,
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
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
      const data = await roomApi.list();
      setRooms(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load rooms");
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
      order: rooms.length,
      imageFile: null,
    });
    setModalOpen(true);
  }

  function openEdit(r: Room) {
    setForm({
      _id: r._id,
      name: r.name || "",
      heading: r.heading || r.name || "",
      desc: r.desc || "",
      href: r.href || "",
      order: r.order ?? 0,
      isActive: r.isActive ?? true,
      image: r.image || "",
      imageFile: null,
    });
    setModalOpen(true);
  }

  async function save() {
    if (!form.name.trim()) {
      toast.error("Room name is required");
      return;
    }
    if (!form.desc.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form._id && !form.imageFile) {
      toast.error("Room image is required");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("heading", (form.heading || form.name).trim());
      fd.append("desc", form.desc.trim());
      if (form.href.trim()) {
        fd.append("href", form.href.trim());
      }
      fd.append("order", String(form.order));
      fd.append("isActive", String(form.isActive));

      if (form.imageFile) {
        fd.append("image", form.imageFile);
      }

      if (form._id) {
        await roomApi.update(form._id, fd);
        toast.success("Room category updated");
      } else {
        await roomApi.create(fd);
        toast.success("Room category created");
      }
      setModalOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(r: Room) {
    setTogglingId(r._id);
    try {
      await optimisticToggle(r, setRooms, roomApi.toggle, {
        on: "Room visible on website",
        off: "Room hidden from website",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function doDelete(id: string) {
    try {
      await roomApi.delete(id);
      toast.success("Room deleted");
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete room");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rooms & Spaces"
        description="Manage room categories (Living Room, Bedroom, Dining, Entryway) and their rugs showcase."
        action={
          <Button
            onClick={openNew}
            size="lg"
            className="shadow-md shadow-[#00355F]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Room
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
        </div>
      ) : rooms.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">No rooms found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Create rooms to showcase rugs curated for specific spaces.
            </p>
            <Button onClick={openNew} className="mt-2">
              <Plus className="w-4 h-4" /> Add Room
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <Card
              key={r._id}
              className="overflow-hidden flex flex-col justify-between group hover:border-[#B2CDFA] hover:shadow-lg transition-all duration-200"
            >
              <div>
                <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
                  {r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.image}
                      alt={r.name}
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

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  <div className="absolute top-3 right-3">
                    <Badge variant={r.isActive ? "success" : "warning"}>
                      {r.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </div>

                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    {r.order}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg leading-snug truncate">
                      {r.name}
                    </h3>
                  </div>
                </div>

                <CardBody className="p-4 space-y-2.5">
                  {r.heading && r.heading !== r.name && (
                    <p className="text-xs font-semibold text-slate-800">
                      {r.heading}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {r.desc}
                  </p>
                  {r.href && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate font-mono">
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      {r.href}
                    </p>
                  )}
                </CardBody>
              </div>

              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <ActiveToggle
                  active={Boolean(r.isActive)}
                  loading={togglingId === r._id}
                  onToggle={() => toggle(r)}
                />

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(r)}
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(r._id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Add / Edit Room Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form._id ? "Edit Room Category" : "Add Room Category"}
        size="lg"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Room Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Hallway & Entryway"
              required
            />
            <Input
              label="Heading (optional)"
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
              placeholder="Defaults to room name"
            />
          </div>

          <Textarea
            label="Description"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            placeholder="Durable, elegant runners designed for welcoming corridors..."
            rows={3}
            required
          />

          <Input
            label="Custom Link URL (optional)"
            value={form.href}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
            placeholder="/products?room=Hallway+%26+Entryway (auto-generated if empty)"
          />

          {/* Image Upload Area */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Room Image
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
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="mt-2 text-xs text-slate-500 flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Click to choose a new image
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-500">
                  <Upload className="w-7 h-7 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">
                    Click to upload room image
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
              {form._id ? "Save Changes" : "Create Room"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Room?"
        size="sm"
      >
        <p className="text-sm text-slate-600 mb-6">
          This action will permanently remove this room category and its image.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteId && doDelete(deleteId)}
          >
            Delete Room
          </Button>
        </div>
      </Modal>
    </div>
  );
}
