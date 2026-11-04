"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  clienteleApi,
  type ClienteleData,
  type ClientLogoItem,
  type TestimonialItem,
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
  Handshake,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";

type LogoModalState = {
  _id?: string;
  name: string;
  logo?: string;
  logoFile?: File | null;
  order: number;
};

const EMPTY_LOGO_MODAL: LogoModalState = {
  name: "",
  logo: "",
  logoFile: null,
  order: 0,
};

type TestimonialModalState = {
  index?: number;
  text: string;
  name: string;
  designation: string;
  company: string;
};

const EMPTY_TESTIMONIAL_MODAL: TestimonialModalState = {
  text: "",
  name: "",
  designation: "",
  company: "",
};

export default function ClientelePage() {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [savingLogo, setSavingLogo] = useState(false);

  // Section fields
  const [heading, setHeading] = useState("Built on Expertise.");
  const [headingHighlight, setHeadingHighlight] = useState("Defined by Trust.");
  const [description, setDescription] = useState(
    "We partner with architects, designers, developers and hospitality groups to deliver tailored flooring solutions, backed by design collaboration, quality and dependable project coordination."
  );
  const [subheading, setSubheading] = useState(
    "Thoughtful Collaboration. Lasting Partnerships."
  );
  const [testimonialsHeading, setTestimonialsHeading] = useState(
    "What Our Clients Says"
  );

  // Lists
  const [clients, setClients] = useState<ClientLogoItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  // Logo Modal
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [logoForm, setLogoForm] = useState<LogoModalState>(EMPTY_LOGO_MODAL);
  const [deleteLogoId, setDeleteLogoId] = useState<string | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Testimonial Modal
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialModalState>(
    EMPTY_TESTIMONIAL_MODAL
  );
  const [deleteTestimonialIndex, setDeleteTestimonialIndex] = useState<
    number | null
  >(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data: ClienteleData = await clienteleApi.get(true);
      if (data.heading) setHeading(data.heading);
      if (data.headingHighlight) setHeadingHighlight(data.headingHighlight);
      if (data.description) setDescription(data.description);
      if (data.subheading) setSubheading(data.subheading);
      if (data.testimonialsHeading)
        setTestimonialsHeading(data.testimonialsHeading);
      setClients(data.clients || []);
      setTestimonials(data.testimonials || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load clientele data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save Section copy + testimonials
  const handleSaveSection = async (updatedTestimonials?: TestimonialItem[]) => {
    setSavingSection(true);
    try {
      const currentTestimonials = updatedTestimonials || testimonials;
      await clienteleApi.updateSection({
        heading,
        headingHighlight,
        description,
        subheading,
        testimonialsHeading,
        testimonials: currentTestimonials,
      });
      toast.success("Clientele section updated successfully");
    } catch (e: any) {
      toast.error(e.message || "Failed to save section");
    } finally {
      setSavingSection(false);
    }
  };

  // Client Logo Actions
  const handleOpenAddLogo = () => {
    setLogoForm({ ...EMPTY_LOGO_MODAL, order: clients.length });
    setLogoModalOpen(true);
  };

  const handleOpenEditLogo = (client: ClientLogoItem) => {
    setLogoForm({
      _id: client._id,
      name: client.name,
      logo: client.logo,
      logoFile: null,
      order: client.order,
    });
    setLogoModalOpen(true);
  };

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoForm.name.trim()) {
      toast.error("Client name is required");
      return;
    }
    if (!logoForm._id && !logoForm.logoFile) {
      toast.error("Please select a client logo image");
      return;
    }

    setSavingLogo(true);
    try {
      const formData = new FormData();
      formData.append("name", logoForm.name.trim());
      formData.append("order", String(logoForm.order ?? clients.length));
      if (logoForm.logoFile) {
        formData.append("logo", logoForm.logoFile);
      }

      if (logoForm._id) {
        await clienteleApi.updateClient(logoForm._id, formData);
        toast.success("Client logo updated");
      } else {
        await clienteleApi.createClient(formData);
        toast.success("Client logo created");
      }

      setLogoModalOpen(false);
      setLogoForm(EMPTY_LOGO_MODAL);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to save client logo");
    } finally {
      setSavingLogo(false);
    }
  };

  const handleDeleteLogo = async (id: string) => {
    try {
      await clienteleApi.deleteClient(id);
      toast.success("Client logo deleted");
      setDeleteLogoId(null);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete client logo");
    }
  };

  const handleMoveLogo = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= clients.length) return;

    const next = [...clients];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setClients(next);

    try {
      await clienteleApi.reorderClients(next.map((c) => c._id));
      toast.success("Order updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update order");
      loadData();
    }
  };

  // Testimonials Actions
  const handleOpenAddTestimonial = () => {
    setTestimonialForm(EMPTY_TESTIMONIAL_MODAL);
    setTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (item: TestimonialItem, index: number) => {
    setTestimonialForm({
      index,
      text: item.text,
      name: item.name,
      designation: item.designation,
      company: item.company,
    });
    setTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.text.trim()) {
      toast.error("Testimonial text is required");
      return;
    }
    if (!testimonialForm.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    const next = [...testimonials];
    const newEntry: TestimonialItem = {
      text: testimonialForm.text.trim(),
      name: testimonialForm.name.trim(),
      designation: testimonialForm.designation.trim(),
      company: testimonialForm.company.trim(),
    };

    if (
      testimonialForm.index !== undefined &&
      testimonialForm.index >= 0 &&
      testimonialForm.index < next.length
    ) {
      next[testimonialForm.index] = newEntry;
    } else {
      next.push(newEntry);
    }

    setTestimonials(next);
    setTestimonialModalOpen(false);
    setTestimonialForm(EMPTY_TESTIMONIAL_MODAL);

    await handleSaveSection(next);
  };

  const handleDeleteTestimonial = async (index: number) => {
    const next = testimonials.filter((_, i) => i !== index);
    setTestimonials(next);
    setDeleteTestimonialIndex(null);
    await handleSaveSection(next);
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
        title="Clientele & Partnerships"
        description="Manage page headings, trusted partner logos, and client testimonials."
      />

      {/* ── Section Copy ── */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Page Header & Copy
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the main heading, highlight accent text, and introduction.
              </p>
            </div>
            <Button
              onClick={() => handleSaveSection()}
              disabled={savingSection}
              className="bg-navy hover:bg-navy/90 text-white"
            >
              {savingSection && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Section Copy
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Main Heading
              </label>
              <Input
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="e.g. Built on Expertise."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Heading Highlight (Italic Accent)
              </label>
              <Input
                value={headingHighlight}
                onChange={(e) => setHeadingHighlight(e.target.value)}
                placeholder="e.g. Defined by Trust."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Description
              </label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="We partner with architects, designers..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Subheading
              </label>
              <Input
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                placeholder="e.g. Thoughtful Collaboration. Lasting Partnerships."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Testimonials Section Heading
              </label>
              <Input
                value={testimonialsHeading}
                onChange={(e) => setTestimonialsHeading(e.target.value)}
                placeholder="e.g. What Our Clients Says"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Client Logos Grid ── */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-slate-900">
                  Client Logos ({clients.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Add, edit, reorder, or remove client partner logos displayed on the page.
              </p>
            </div>
            <Button
              onClick={handleOpenAddLogo}
              className="bg-gold hover:bg-gold/90 text-navy font-semibold self-start sm:self-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Client Logo
            </Button>
          </div>

          {clients.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-slate-200 p-12 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm font-medium text-slate-600">
                No client logos added yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Upload your first partner or client logo to display in the showcase.
              </p>
              <Button
                onClick={handleOpenAddLogo}
                className="mt-4 bg-navy hover:bg-navy/90 text-white"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Logo
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {clients.map((client, index) => (
                <div
                  key={client._id}
                  className="group relative flex flex-col items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-gold/60 hover:shadow-md"
                >
                  {/* Reorder Buttons */}
                  <div className="absolute top-2 left-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-xs rounded-md p-0.5 shadow-xs border border-slate-200">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveLogo(index, -1)}
                      className="p-1 text-slate-500 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move backward"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === clients.length - 1}
                      onClick={() => handleMoveLogo(index, 1)}
                      className="p-1 text-slate-500 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move forward"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-xs rounded-md p-0.5 shadow-xs border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleOpenEditLogo(client)}
                      className="p-1 text-slate-600 hover:text-gold"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteLogoId(client._id)}
                      className="p-1 text-slate-600 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Logo Display */}
                  <div className="flex h-24 w-full items-center justify-center p-2">
                    {client.logo ? (
                      <div className="relative h-16 w-full max-w-[140px]">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* Client Name */}
                  <div className="w-full text-center border-t border-slate-100 pt-2.5 mt-2">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {client.name}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Order: #{index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Testimonials List ── */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Quote className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-slate-900">
                  Client Testimonials ({testimonials.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the scrolling testimonials marquee shown on the clientele page.
              </p>
            </div>
            <Button
              onClick={handleOpenAddTestimonial}
              className="bg-navy hover:bg-navy/90 text-white self-start sm:self-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </div>

          {testimonials.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-slate-200 p-12 text-center">
              <Quote className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm font-medium text-slate-600">
                No testimonials added yet
              </p>
              <Button
                onClick={handleOpenAddTestimonial}
                className="mt-4 bg-navy hover:bg-navy/90 text-white"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-gold/60"
                >
                  <div className="absolute top-3 right-3 flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditTestimonial(t, idx)}
                      className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-navy"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTestimonialIndex(idx)}
                      className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <Quote className="h-5 w-5 text-gold fill-gold/20" />
                    <p className="mt-3 text-sm text-slate-700 leading-relaxed italic line-clamp-4">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-sm font-semibold text-slate-900">
                      ~ {t.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.designation ? `${t.designation}, ` : ""}
                      {t.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Client Logo Modal ── */}
      <Modal
        open={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
        title={logoForm._id ? "Edit Client Logo" : "Add Client Logo"}
      >
        <form onSubmit={handleSaveLogo} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Client / Brand Name *
            </label>
            <Input
              value={logoForm.name}
              onChange={(e) =>
                setLogoForm({ ...logoForm, name: e.target.value })
              }
              placeholder="e.g. Marriott Hotels"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Logo Image {logoForm._id ? "(Optional - keep existing if blank)" : "*"}
            </label>

            {logoForm.logo && !logoForm.logoFile && (
              <div className="mb-3 relative h-28 w-full rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-3">
                <Image
                  src={logoForm.logo}
                  alt="Existing Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}

            {logoForm.logoFile && (
              <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-gold" />
                  <span className="text-xs font-medium text-slate-700 truncate max-w-xs">
                    {logoForm.logoFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLogoForm({ ...logoForm, logoFile: null })}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <input
              ref={logoFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setLogoForm({ ...logoForm, logoFile: file });
              }}
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => logoFileInputRef.current?.click()}
              className="w-full border-dashed"
            >
              <Upload className="mr-2 h-4 w-4" />
              {logoForm.logo || logoForm.logoFile ? "Change Image" : "Upload Logo Image"}
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLogoModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={savingLogo}
              className="bg-navy hover:bg-navy/90 text-white"
            >
              {savingLogo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {logoForm._id ? "Update Logo" : "Add Logo"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Testimonial Modal ── */}
      <Modal
        open={testimonialModalOpen}
        onClose={() => setTestimonialModalOpen(false)}
        title={
          testimonialForm.index !== undefined
            ? "Edit Testimonial"
            : "Add Testimonial"
        }
      >
        <form onSubmit={handleSaveTestimonial} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Testimonial Quote *
            </label>
            <Textarea
              rows={4}
              value={testimonialForm.text}
              onChange={(e) =>
                setTestimonialForm({ ...testimonialForm, text: e.target.value })
              }
              placeholder="Enter client praise, feedback, or review..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Client Name *
              </label>
              <Input
                value={testimonialForm.name}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Designation
              </label>
              <Input
                value={testimonialForm.designation}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    designation: e.target.value,
                  })
                }
                placeholder="e.g. Lead Interior Architect"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Company / Hotel Group
            </label>
            <Input
              value={testimonialForm.company}
              onChange={(e) =>
                setTestimonialForm({
                  ...testimonialForm,
                  company: e.target.value,
                })
              }
              placeholder="e.g. Oberoi Hotels & Resorts"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setTestimonialModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={savingSection}
              className="bg-navy hover:bg-navy/90 text-white"
            >
              {savingSection && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Testimonial
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Logo Confirmation Modal ── */}
      <Modal
        open={!!deleteLogoId}
        onClose={() => setDeleteLogoId(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this client logo? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteLogoId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteLogoId && handleDeleteLogo(deleteLogoId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Testimonial Confirmation Modal ── */}
      <Modal
        open={deleteTestimonialIndex !== null}
        onClose={() => setDeleteTestimonialIndex(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this testimonial?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteTestimonialIndex(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteTestimonialIndex !== null &&
                handleDeleteTestimonial(deleteTestimonialIndex)
              }
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
