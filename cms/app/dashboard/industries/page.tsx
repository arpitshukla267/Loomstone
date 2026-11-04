"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  industryApi,
  type IndustryCard,
  type IndustriesData,
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
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type CardModalState = {
  _id?: string;
  name: string;
  image?: string;
  imageFile?: File | null;
  order: number;
};

const EMPTY_MODAL: CardModalState = {
  name: "",
  image: "",
  imageFile: null,
  order: 0,
};

export default function IndustriesPage() {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingCard, setSavingCard] = useState(false);

  // 2 Section fields
  const [sectionHeading, setSectionHeading] = useState("Industries We Serve");
  const [sectionDesc, setSectionDesc] = useState(
    "From iconic hospitality destinations to refined commercial spaces and residences, we create bespoke flooring that brings design vision to life."
  );

  // Cards list
  const [cards, setCards] = useState<IndustryCard[]>([]);

  // Modal states
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState<CardModalState>(EMPTY_MODAL);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data: IndustriesData = await industryApi.get(true);
      if (data.heading) setSectionHeading(data.heading);
      if (data.description) setSectionDesc(data.description);
      setCards(data.cards || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load industries data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save the 2 section fields
  async function saveSection() {
    if (!sectionHeading.trim()) {
      toast.error("Section heading is required");
      return;
    }

    setSavingSection(true);
    try {
      await industryApi.updateSection({
        sectionHeading: sectionHeading.trim(),
        sectionDesc: sectionDesc.trim(),
      });
      toast.success("Section details updated successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to update section details");
    } finally {
      setSavingSection(false);
    }
  }

  // Open modal for new card
  function openAddCard() {
    setCardForm({
      ...EMPTY_MODAL,
      order: cards.length,
    });
    setCardModalOpen(true);
  }

  // Open modal to edit existing card
  function openEditCard(c: IndustryCard) {
    setCardForm({
      _id: c._id,
      name: c.name || "",
      image: c.image || "",
      imageFile: null,
      order: c.order ?? 0,
    });
    setCardModalOpen(true);
  }

  // Save card (Create or Update)
  async function saveCard() {
    if (!cardForm.name.trim()) {
      toast.error("Card name is required");
      return;
    }
    if (!cardForm._id && !cardForm.imageFile) {
      toast.error("Card image is required");
      return;
    }

    setSavingCard(true);
    try {
      const fd = new FormData();
      fd.append("name", cardForm.name.trim());
      fd.append("order", String(cardForm.order));
      if (cardForm.imageFile) {
        fd.append("image", cardForm.imageFile);
      }

      if (cardForm._id) {
        await industryApi.updateCard(cardForm._id, fd);
        toast.success("Industry card updated");
      } else {
        await industryApi.createCard(fd);
        toast.success("New industry card added");
      }

      setCardModalOpen(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to save industry card");
    } finally {
      setSavingCard(false);
    }
  }

  // Delete card (Reduce cards)
  async function doDeleteCard(id: string) {
    try {
      await industryApi.deleteCard(id);
      toast.success("Industry card deleted");
      setDeleteId(null);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete card");
    }
  }

  // Quick reorder cards
  async function moveCard(from: number, to: number) {
    if (to < 0 || to >= cards.length) return;
    const copy = [...cards];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    setCards(copy);

    try {
      await industryApi.reorderCards(copy.map((c) => c._id));
    } catch {
      toast.error("Failed to persist card order");
      loadData();
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
        title="Industries We Serve"
        description="Manage the section heading, description, and industry cards displayed on the homepage."
        action={
          <Button onClick={openAddCard} size="lg" className="cursor-pointer">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Card
          </Button>
        }
      />

      {/* ── 2 Main Section Fields ── */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#4A90C4]" />
              <h3 className="text-sm font-bold text-slate-800">
                Section Information (2 Fields)
              </h3>
            </div>
            <Button
              onClick={saveSection}
              disabled={savingSection}
              size="sm"
              variant="default"
            >
              {savingSection && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              Save Section Info
            </Button>
          </div>

          <div className="space-y-4">
            {/* Field 1: Section Heading */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                1. Section Heading *
              </label>
              <Input
                value={sectionHeading}
                onChange={(e) => setSectionHeading(e.target.value)}
                placeholder="e.g. Industries We Serve"
              />
            </div>

            {/* Field 2: Section Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                2. Section Description *
              </label>
              <Textarea
                rows={3}
                value={sectionDesc}
                onChange={(e) => setSectionDesc(e.target.value)}
                placeholder="From iconic hospitality destinations to refined commercial spaces..."
                className="text-xs leading-relaxed"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Industry Cards Section ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Industry Cards
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {cards.length} {cards.length === 1 ? "card" : "cards"}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Displays initial 6 cards and expands as new cards are added. Admin can add or reduce cards anytime.
            </p>
          </div>
          <Button onClick={openAddCard} size="sm" variant="outline">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Card
          </Button>
        </div>

        {cards.length === 0 ? (
          <Card>
            <CardBody className="py-16 text-center space-y-3">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">
                No industry cards yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add industry cards with name and cover image.
              </p>
              <Button onClick={openAddCard} size="sm">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add First Card
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {cards.map((card, idx) => (
              <Card
                key={card._id}
                className="overflow-hidden flex flex-col justify-between group hover:border-[#B2CDFA] hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative w-full h-48 bg-slate-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      #{idx + 1}
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <h4 className="font-bold text-base line-clamp-1">
                        {card.name}
                      </h4>
                      <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                        slug: /{card.slug}
                      </p>
                    </div>
                  </div>

                  <CardBody className="p-3.5 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-700">
                      Card Name: <strong className="text-slate-900">{card.name}</strong>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveCard(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        title="Move Left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCard(idx, idx + 1)}
                        disabled={idx === cards.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        title="Move Right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </CardBody>
                </div>

                {/* Card Actions */}
                <div className="px-3.5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditCard(card)}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(card._id)}
                    title="Reduce card"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── Add / Edit Card Modal ── */}
      <Modal
        open={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        title={cardForm._id ? "Edit Industry Card" : "Add Industry Card"}
        size="md"
      >
        <div className="space-y-4">
          {/* Card Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Card Name *
            </label>
            <Input
              value={cardForm.name}
              onChange={(e) =>
                setCardForm({ ...cardForm, name: e.target.value })
              }
              placeholder="e.g. Hospitality, Luxury Residential, Gaming..."
            />
          </div>

          {/* Card Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Card Image *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-[#00355F] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50"
            >
              {cardForm.imageFile ? (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 overflow-hidden text-left">
                    <ImageIcon className="w-5 h-5 text-[#00355F] shrink-0" />
                    <span className="text-xs font-medium text-slate-800 truncate">
                      {cardForm.imageFile.name} ({(cardForm.imageFile.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardForm({ ...cardForm, imageFile: null });
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : cardForm.image ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cardForm.image}
                    alt="Current card"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <div className="mt-2 text-xs text-slate-500 flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Click to choose a replacement image
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-500">
                  <Upload className="w-7 h-7 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">
                    Click to select an industry card image
                  </span>
                  <span className="text-[11px] text-slate-400">
                    PNG, JPG, WEBP up to 10MB
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
                if (file) setCardForm({ ...cardForm, imageFile: file });
                e.target.value = "";
              }}
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setCardModalOpen(false)}
              disabled={savingCard}
            >
              Cancel
            </Button>
            <Button onClick={saveCard} disabled={savingCard}>
              {savingCard && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              {cardForm._id ? "Update Card" : "Add Card"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Reduce / Delete Card?"
        size="sm"
      >
        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Are you sure you want to delete this industry card? This will reduce the total cards displayed on your site and remove its image.
        </p>
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteId && doDeleteCard(deleteId)}
          >
            Delete Card
          </Button>
        </div>
      </Modal>
    </div>
  );
}
