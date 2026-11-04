"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { whyLoomstoneApi, type WhyLoomstone } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";

type WhyCard = {
  icon?: string;
  heading: string;
  subheading: string;
  order: number;
};

const DEFAULT_CARDS: WhyCard[] = [
  {
    icon: "Layers",
    heading: "Flooring Expertise",
    subheading:
      "Axminster carpets & Rugs, Handcrafted carpets & Rugs, Textile flooring, Resilient Flooring",
    order: 0,
  },
  {
    icon: "Palette",
    heading: "Design Collaboration",
    subheading:
      "Working with architects and designers to translate their creative vision into distinctive flooring concepts.",
    order: 1,
  },
  {
    icon: "Gem",
    heading: "Bespoke Flooring Solutions",
    subheading:
      "Custom patterns, colours, textures and specifications crafted to bring each project's unique design vision to life.",
    order: 2,
  },
  {
    icon: "Globe",
    heading: "Global Manufacturing Partnerships",
    subheading:
      "Working with trusted manufacturing partners and specialist suppliers to deliver quality material, consistent standards & Bespoke flooring solutions.",
    order: 3,
  },
  {
    icon: "ClipboardCheck",
    heading: "Technical Precision",
    subheading:
      "Meticulous attention to specification, accurate measurements, budget consideration and project requirements ensuring flooring solutions that balance design intent, performance and practicality.",
    order: 4,
  },
  {
    icon: "Handshake",
    heading: "End to End Project Support",
    subheading:
      "Coordinated support from design development to supply and installation, ensuring a seamless product journey from concept to completion.",
    order: 5,
  },
];

export default function WhyLoomstonePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState("What Sets Loomstone Apart");
  const [subheading, setSubheading] = useState(
    "Thoughtful Design. Bespoke Craftsmanship. Seamless Execution."
  );
  const [cards, setCards] = useState<WhyCard[]>(DEFAULT_CARDS);

  // Drag and drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data: WhyLoomstone = await whyLoomstoneApi.get();
      if (data.heading) setHeading(data.heading);
      if (data.subheading) setSubheading(data.subheading);

      const rawFeatures = data.features || [];
      // Enforce exactly 6 cards
      const loadedCards: WhyCard[] = [];
      for (let i = 0; i < 6; i++) {
        if (rawFeatures[i]) {
          loadedCards.push({
            icon: rawFeatures[i].icon || "Layers",
            heading: rawFeatures[i].title || "",
            subheading: rawFeatures[i].text || "",
            order: i,
          });
        } else if (DEFAULT_CARDS[i]) {
          loadedCards.push({ ...DEFAULT_CARDS[i], order: i });
        } else {
          loadedCards.push({
            icon: "Layers",
            heading: "",
            subheading: "",
            order: i,
          });
        }
      }
      setCards(loadedCards);
    } catch (e: any) {
      toast.error(e.message || "Failed to load Why Loomstone content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateCard = (
    index: number,
    field: "heading" | "subheading",
    val: string
  ) => {
    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: val } : c))
    );
  };

  const moveCard = (from: number, to: number) => {
    if (to < 0 || to >= cards.length) return;
    setCards((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy.map((c, i) => ({ ...c, order: i }));
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    moveCard(draggedIndex, targetIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  async function save() {
    if (!heading.trim()) {
      toast.error("Section heading is required");
      return;
    }

    setSaving(true);
    try {
      const payloadFeatures = cards.slice(0, 6).map((c, i) => ({
        icon: c.icon || "Layers",
        title: c.heading.trim(),
        text: c.subheading.trim(),
        order: i,
      }));

      const fd = new FormData();
      fd.append("heading", heading.trim());
      fd.append("subheading", subheading.trim());
      fd.append("features", JSON.stringify(payloadFeatures));

      await whyLoomstoneApi.update(fd);
      toast.success("Why Loomstone updated successfully");
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to save Why Loomstone");
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
        description="Manage the 6 highlight cards and their heading & subheading. Drag and drop cards to reorder."
        action={
          <Button onClick={save} disabled={saving} size="lg">
            {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
            Save Changes
          </Button>
        }
      />

      {/* Section Heading & Subheading */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-[#4A90C4]" />
            <h3 className="text-sm font-bold text-slate-800">
              Section Title & Subheading
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Section Subheading / Tagline
              </label>
              <Input
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. Thoughtful Design. Bespoke Craftsmanship. Seamless Execution."
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 6 Cards Layout with Drag and Drop */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Cards Layout (6 Cards Only)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Grab the handle or drag cards to reorder. Each card contains a Heading and Subheading.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.slice(0, 6).map((card, idx) => {
            const isDragging = draggedIndex === idx;
            const isOver = dragOverIndex === idx && !isDragging;

            return (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={`group rounded-2xl border transition-all duration-200 bg-white shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isDragging
                    ? "opacity-40 border-dashed border-[#00355F] scale-[0.98]"
                    : isOver
                    ? "border-[#4A90C4] ring-2 ring-[#4A90C4]/20 scale-[1.01]"
                    : "border-slate-200/90 hover:border-slate-300"
                }`}
              >
                {/* Card Top Bar */}
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 rounded-t-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="cursor-grab active:cursor-grabbing p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Card #{idx + 1}
                    </span>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveCard(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCard(idx, idx + 1)}
                      disabled={idx === cards.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Body with 2 Fields */}
                <div className="p-4 space-y-3.5 flex-1">
                  {/* Field 1: Heading */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Heading *
                    </label>
                    <Input
                      value={card.heading}
                      onChange={(e) =>
                        updateCard(idx, "heading", e.target.value)
                      }
                      placeholder="e.g. Flooring Expertise"
                      className="font-medium text-xs text-slate-900"
                    />
                  </div>

                  {/* Field 2: Subheading */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Subheading / Description *
                    </label>
                    <Textarea
                      rows={4}
                      value={card.subheading}
                      onChange={(e) =>
                        updateCard(idx, "subheading", e.target.value)
                      }
                      placeholder="e.g. Axminster carpets & Rugs, Handcrafted carpets & Rugs..."
                      className="text-xs text-slate-700 leading-relaxed resize-none"
                    />
                  </div>
                </div>

                {/* Card Footer indicator */}
                <div className="px-4 py-2 border-t border-slate-50 bg-slate-50/40 rounded-b-2xl text-[10px] text-slate-400 font-mono">
                  Display order: {idx + 1} of 6
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="flex justify-end pt-2">
        <Button onClick={save} disabled={saving} size="lg">
          {saving && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
