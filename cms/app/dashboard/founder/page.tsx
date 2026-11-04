"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { founderApi, type Founder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  X,
  UserCheck,
  Quote,
  Sparkles,
} from "lucide-react";

export default function FounderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sectionTitle, setSectionTitle] = useState("Meet Our Visionary");
  const [founderName, setFounderName] = useState("Pawan Yadav");
  const [designation, setDesignation] = useState("Managing Partner at Loomstone");
  const [tagline, setTagline] = useState(
    "Perfection is the foundation beneath every great space."
  );
  const [quote, setQuote] = useState(
    "We believe exceptional hospitality is shaped by thoughtful details. Flooring is more than a surface; it is a defining design element that enhances environments, enriches guest experiences, and contributes to the enduring identity of a space."
  );
  const [currentImage, setCurrentImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data: Founder = await founderApi.get();
      if (data.sectionTitle) setSectionTitle(data.sectionTitle);
      if (data.founderName) setFounderName(data.founderName);
      if (data.designation) setDesignation(data.designation);
      if (data.tagline) setTagline(data.tagline);
      if (data.quote) setQuote(data.quote);
      if (data.image) setCurrentImage(data.image);
    } catch (e: any) {
      toast.error(e.message || "Failed to load Founder content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function save() {
    if (!founderName.trim()) {
      toast.error("Founder name is required");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("sectionTitle", sectionTitle.trim());
      fd.append("founderName", founderName.trim());
      fd.append("designation", designation.trim());
      fd.append("tagline", tagline.trim());
      fd.append("quote", quote.trim());

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const updated = await founderApi.update(fd);
      if (updated.image) setCurrentImage(updated.image);
      setImageFile(null);
      toast.success("Founder's message updated successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to save founder changes");
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
        title="Founder's Message"
        description="Manage the visionary founder profile, quote, tagline, and photo displayed on the About page."
        action={
          <Button onClick={save} disabled={saving} size="lg">
            {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo Upload */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <UserCheck className="w-4 h-4 text-[#4A90C4]" />
                <h3 className="text-sm font-bold text-slate-800">
                  Founder Photo
                </h3>
              </div>

              {imageFile ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/5] flex flex-col items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="New founder preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      Remove New Photo
                    </button>
                  </div>
                </div>
              ) : currentImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-[4/5] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImage}
                    alt={founderName}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      Replace Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#00355F] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 aspect-[4/5] flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Upload Founder Photo
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImageFile(file);
                  e.target.value = "";
                }}
              />

              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  {currentImage || imageFile ? "Choose Different Image" : "Upload Photo"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: Founder Details & Quote */}
        <div className="space-y-6 lg:col-span-2">
          {/* Identity Info */}
          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-[#4A90C4]" />
                <h3 className="text-sm font-bold text-slate-800">
                  Profile Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Section Heading
                  </label>
                  <Input
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="e.g. Meet Our Visionary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Founder Name *
                  </label>
                  <Input
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="e.g. Pawan Yadav"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Designation / Role
                </label>
                <Input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Managing Partner at Loomstone"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Highlight Tagline
                </label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Perfection is the foundation beneath every great space."
                />
              </div>
            </CardBody>
          </Card>

          {/* Quote */}
          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Quote className="w-4 h-4 text-[#4A90C4]" />
                <h3 className="text-sm font-bold text-slate-800">
                  Founder&apos;s Quote / Statement
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Statement Text
                </label>
                <Textarea
                  rows={5}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Enter the founder's quote or message..."
                  className="text-xs leading-relaxed"
                />
              </div>
            </CardBody>
          </Card>

          <div className="flex justify-end pt-2">
            <Button onClick={save} disabled={saving} size="lg">
              {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
              Save Founder&apos;s Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
