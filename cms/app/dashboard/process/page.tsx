"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { processApi, type ProcessData, type ProcessStep } from "@/lib/api";
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
  Workflow,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

type StepModalState = {
  _id?: string;
  title: string;
  description: string;
  media?: string;
  mediaFile?: File | null;
  order: number;
};

const EMPTY_STEP: StepModalState = {
  title: "",
  description: "",
  media: "",
  mediaFile: null,
  order: 0,
};

export default function ProcessPage() {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingStep, setSavingStep] = useState(false);

  // Section fields
  const [heading, setHeading] = useState("From Vision to Exceptional Spaces");
  const [intro, setIntro] = useState(
    "At Loomstone, exceptional flooring begins with a clear vision and is realised through meticulous execution. We guide every project from concept to completion, creating floors that elevate the character and identity of a space."
  );

  // Steps
  const [steps, setSteps] = useState<ProcessStep[]>([]);

  // Modals
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [stepForm, setStepForm] = useState<StepModalState>(EMPTY_STEP);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data: ProcessData = await processApi.get();
      if (data.heading) setHeading(data.heading);
      if (data.intro) setIntro(data.intro);
      setSteps(data.steps || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load process data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save Section Heading & Intro
  async function saveSection() {
    if (!heading.trim()) {
      toast.error("Process heading is required");
      return;
    }

    setSavingSection(true);
    try {
      await processApi.updateSection({
        heading: heading.trim(),
        intro: intro.trim(),
      });
      toast.success("Process section details updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to save section details");
    } finally {
      setSavingSection(false);
    }
  }

  // Open modal for new step
  function openAddStep() {
    setStepForm({
      ...EMPTY_STEP,
      order: steps.length,
    });
    setStepModalOpen(true);
  }

  // Open modal to edit existing step
  function openEditStep(step: ProcessStep) {
    setStepForm({
      _id: step._id,
      title: step.title || "",
      description: step.description || "",
      media: step.media || "",
      mediaFile: null,
      order: step.order ?? 0,
    });
    setStepModalOpen(true);
  }

  // Save Step (Create or Update)
  async function saveStep() {
    if (!stepForm.title.trim()) {
      toast.error("Step title is required");
      return;
    }

    setSavingStep(true);
    try {
      const fd = new FormData();
      fd.append("title", stepForm.title.trim());
      fd.append("description", stepForm.description.trim());
      fd.append("order", String(stepForm.order));
      if (stepForm.mediaFile) {
        fd.append("media", stepForm.mediaFile);
      }

      if (stepForm._id) {
        await processApi.updateStep(stepForm._id, fd);
        toast.success("Process step updated");
      } else {
        await processApi.createStep(fd);
        toast.success("New process step added");
      }

      setStepModalOpen(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to save process step");
    } finally {
      setSavingStep(false);
    }
  }

  // Delete step
  async function doDeleteStep(id: string) {
    try {
      await processApi.deleteStep(id);
      toast.success("Process step deleted");
      setDeleteId(null);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete process step");
    }
  }

  // Reorder steps
  async function moveStep(from: number, to: number) {
    if (to < 0 || to >= steps.length) return;
    const copy = [...steps];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    setSteps(copy);

    try {
      await processApi.reorderSteps(copy.map((s) => s._id));
    } catch {
      toast.error("Failed to reorder process steps");
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
        title="Craft & Manufacturing Process"
        description="Manage the step-by-step process, titles, descriptions, and photography shown on the About page."
        action={
          <Button onClick={openAddStep} size="lg" className="cursor-pointer">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Step
          </Button>
        }
      />

      {/* ── Section Heading & Intro ── */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4 text-[#4A90C4]" />
              <h3 className="text-sm font-bold text-slate-800">
                Process Section Intro
              </h3>
            </div>
            <Button
              onClick={saveSection}
              disabled={savingSection}
              size="sm"
            >
              {savingSection && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              Save Section Intro
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Section Heading *
              </label>
              <Input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. From Vision to Exceptional Spaces"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Intro Text
              </label>
              <Textarea
                rows={3}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="At Loomstone, exceptional flooring begins with a clear vision..."
                className="text-xs leading-relaxed"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Steps List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Process Steps
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {steps.length} {steps.length === 1 ? "step" : "steps"}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Steps are presented sequentially in an alternating zig-zag layout on the frontend.
            </p>
          </div>
          <Button onClick={openAddStep} size="sm" variant="outline">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Step
          </Button>
        </div>

        {steps.length === 0 ? (
          <Card>
            <CardBody className="py-16 text-center space-y-3">
              <Workflow className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">
                No process steps added yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your manufacturing and design process steps with photos.
              </p>
              <Button onClick={openAddStep} size="sm">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add First Step
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <Card
                key={step._id}
                className="overflow-hidden hover:border-[#B2CDFA] transition-all"
              >
                <div className="flex flex-col sm:flex-row items-stretch">
                  {/* Step Image */}
                  <div className="relative w-full sm:w-56 h-44 shrink-0 bg-slate-900 overflow-hidden">
                    {step.media ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={step.media}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-100">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                      Step #{idx + 1}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-base text-slate-900">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-3">
                        {step.description || "—"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                      {/* Order controls */}
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-400 font-mono mr-2">
                          Order: {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => moveStep(idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveStep(idx, idx + 1)}
                          disabled={idx === steps.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditStep(step)}
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(step._id)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── Add / Edit Step Modal ── */}
      <Modal
        open={stepModalOpen}
        onClose={() => setStepModalOpen(false)}
        title={stepForm._id ? "Edit Process Step" : "Add Process Step"}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Step Title *
            </label>
            <Input
              value={stepForm.title}
              onChange={(e) =>
                setStepForm({ ...stepForm, title: e.target.value })
              }
              placeholder="e.g. Design Consultation, Sampling & Prototyping..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Step Description *
            </label>
            <Textarea
              rows={4}
              value={stepForm.description}
              onChange={(e) =>
                setStepForm({ ...stepForm, description: e.target.value })
              }
              placeholder="Describe this manufacturing or design step..."
              className="text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Step Photo / Media
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-[#00355F] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50"
            >
              {stepForm.mediaFile ? (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2 overflow-hidden text-left">
                    <ImageIcon className="w-5 h-5 text-[#00355F] shrink-0" />
                    <span className="text-xs font-medium text-slate-800 truncate">
                      {stepForm.mediaFile.name} ({(stepForm.mediaFile.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStepForm({ ...stepForm, mediaFile: null });
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : stepForm.media ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stepForm.media}
                    alt="Current step media"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <div className="mt-2 text-xs text-slate-500 flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Click to replace photo
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-500">
                  <Upload className="w-7 h-7 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700">
                    Click to select step photo
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
                if (file) setStepForm({ ...stepForm, mediaFile: file });
                e.target.value = "";
              }}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setStepModalOpen(false)}
              disabled={savingStep}
            >
              Cancel
            </Button>
            <Button onClick={saveStep} disabled={savingStep}>
              {savingStep && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              {stepForm._id ? "Update Step" : "Add Step"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Process Step?"
        size="sm"
      >
        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Are you sure you want to delete this process step? This will remove it from the About page.
        </p>
        <div className="flex justify-end gap-2.5">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteId && doDeleteStep(deleteId)}
          >
            Delete Step
          </Button>
        </div>
      </Modal>
    </div>
  );
}
