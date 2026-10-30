"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { whyLoomstoneApi, type WhyLoomstone, type WhyFeature } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Sparkles,
  Upload,
  X,
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";

const ICON_OPTIONS = [
  "Layers",
  "Palette",
  "Gem",
  "Globe",
  "ClipboardCheck",
  "Handshake",
  "Shield",
  "Award",
  "Heart",
  "Star",
  "Zap",
  "Target",
  "Users",
  "Lightbulb",
  "Settings",
  "Compass",
];

type FeatureForm = {
  icon: string;
  title: string;
  text: string;
  order: number;
};

export default function WhyLomstonePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [features, setFeatures] = useState<FeatureForm[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await whyLoomstoneApi.get();
      setHeading(data.heading || "");
      setSubheading(data.subheading || "");
      setCurrentImage(data.image || "");
      setFeatures(
        (data.features || []).map((f, i) => ({
          icon: f.icon || "Layers",
          title: f.title || "",
          text: f.text || "",
          order: f.order ?? i,
        }))
      );
    } catch (e: any) {
      toast.error(e.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function addFeature() {
    setFeatures((prev) => [
      ...prev,
      { icon: "Layers", title: "", text: "", order: prev.length },
    ]);
  }

  function removeFeature(idx: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateFeature(idx: number, field: keyof FeatureForm, value: string | number) {
    setFeatures((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f))
    );
  }

  function moveFeature(from: number, to: number) {
    if (to < 0 || to >= features.length) return;
    setFeatures((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy.map((f, i) => ({ ...f, order: i }));
    });
  }

  async function save() {
    if (!heading.trim()) {
      toast.error("Section heading is required");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("heading", heading.trim());
      fd.append("subheading", subheading.trim());
      fd.append(
        "features",
        JSON.stringify(features.map((f, i) => ({ ...f, order: i })))
      );

      if (imageFile) {
        fd.append("image", imageFile);
      }

      await whyLoomstoneApi.update(fd);
      toast.success("Why Loomstone content updated");
      setImageFile(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Why Loomstone"
        description='Manage the "What Sets Loomstone Apart" section content, image, and feature highlights.'
        action={
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
            Save Changes
          </Button>
        }
      />

      {/* Heading & Subheading */}
      <Card>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Section Heading
            </label>
            <Input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="e.g. What Sets Loomstone Apart"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subheading / Tagline
            </label>
            <Input
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              placeholder="e.g. Thoughtful Design. Bespoke Craftsmanship. Seamless Execution."
            />
          </div>
        </CardBody>
      </Card>

      {/* Section Image */}
      <Card>
        <CardBody className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Section Image
          </label>

          {imageFile ? (
            <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="New upload preview"
                  className="w-20 h-14 rounded-lg object-cover"
                />
                <div>
                  <span className="text-xs font-medium text-slate-800 block truncate max-w-xs">
                    {imageFile.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    New image ready to upload
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : currentImage ? (
            <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage}
                  alt="Current"
                  className="w-20 h-14 rounded-lg object-cover"
                />
                <div>
                  <span className="text-xs font-medium text-slate-800 block">
                    Current Image
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
                Click to upload section image
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
              if (file) setImageFile(file);
              e.target.value = "";
            }}
            className="hidden"
          />
        </CardBody>
      </Card>

      {/* Features */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Feature Highlights</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Each feature shows an icon, title, and description in a 3×2 grid.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={addFeature}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Feature
            </Button>
          </div>

          {features.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No features added yet.</p>
              <Button size="sm" onClick={addFeature}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add First Feature
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{idx + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveFeature(idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFeature(idx, idx + 1)}
                          disabled={idx === features.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove Feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Icon
                      </label>
                      <select
                        value={feature.icon}
                        onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                        className="w-full rounded-lg bg-white border border-slate-200 px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-[#4A90C4] cursor-pointer"
                      >
                        {ICON_OPTIONS.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Title
                      </label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(idx, "title", e.target.value)}
                        placeholder="e.g. Flooring Expertise"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Description
                    </label>
                    <Textarea
                      rows={2}
                      value={feature.text}
                      onChange={(e) => updateFeature(idx, "text", e.target.value)}
                      placeholder="Describe this feature..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Save Button (bottom) */}
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} size="lg">
          {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
