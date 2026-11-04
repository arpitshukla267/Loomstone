"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { blogApi, type BlogPostItem } from "@/lib/api";
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
  BookOpen,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
} from "lucide-react";

type BlogFormState = {
  _id?: string;
  title: string;
  slug: string;
  date: string;
  readTime: string;
  summary: string;
  contentText: string; // paragraphs separated by double newlines
  image?: string;
  imageFile?: File | null;
  isPublished: boolean;
};

const getTodayDateFormatted = () => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("en-US", options);
};

const EMPTY_BLOG_FORM: BlogFormState = {
  title: "",
  slug: "",
  date: getTodayDateFormatted(),
  readTime: "4 min read",
  summary: "",
  contentText: "",
  image: "",
  imageFile: null,
  isPublished: true,
};

export default function BlogsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<BlogFormState>(EMPTY_BLOG_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await blogApi.list(true);
      setBlogs(data || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenAdd = () => {
    setForm({
      ...EMPTY_BLOG_FORM,
      date: getTodayDateFormatted(),
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: BlogPostItem) => {
    setForm({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      date: item.date || getTodayDateFormatted(),
      readTime: item.readTime || "4 min read",
      summary: item.summary || "",
      contentText: Array.isArray(item.content) ? item.content.join("\n\n") : "",
      image: item.image,
      imageFile: null,
      isPublished: item.isPublished ?? true,
    });
    setModalOpen(true);
  };

  // Auto-slugify when typing title in add mode
  const handleTitleChange = (val: string) => {
    if (!form._id) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim();
      setForm((prev) => ({ ...prev, title: val, slug: autoSlug }));
    } else {
      setForm((prev) => ({ ...prev, title: val }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Blog title is required");
      return;
    }
    if (!form.summary.trim()) {
      toast.error("Blog summary is required");
      return;
    }
    if (!form._id && !form.imageFile) {
      toast.error("Please upload a featured image for this blog post");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("slug", form.slug.trim());
      formData.append("summary", form.summary.trim());
      formData.append("date", form.date.trim() || getTodayDateFormatted());
      formData.append("readTime", form.readTime.trim() || "4 min read");
      formData.append("isPublished", String(form.isPublished));

      // Break content by empty lines into paragraphs
      const paragraphs = form.contentText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      formData.append(
        "content",
        JSON.stringify(paragraphs.length > 0 ? paragraphs : [form.summary.trim()])
      );

      if (form.imageFile) {
        formData.append("image", form.imageFile);
      }

      if (form._id) {
        await blogApi.update(form._id, formData);
        toast.success("Blog post updated successfully");
      } else {
        await blogApi.create(formData);
        toast.success("Blog post created successfully");
      }

      setModalOpen(false);
      setForm(EMPTY_BLOG_FORM);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item: BlogPostItem) => {
    try {
      await blogApi.toggle(item._id);
      toast.success(
        item.isPublished
          ? `Moved "${item.title}" to Drafts`
          : `Published "${item.title}"`
      );
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to toggle publish status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await blogApi.delete(id);
      toast.success("Blog post deleted successfully");
      setDeleteId(null);
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete blog post");
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
        title="Blogs & Stories"
        description="Publish and manage articles, craftsmanship notes, and stories for the journal."
      />

      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-bold text-slate-900">
                  All Posts ({blogs.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Draft or publish stories to showcase on the blogs page and home journal section.
              </p>
            </div>
            <Button
              onClick={handleOpenAdd}
              className="bg-gold hover:bg-gold/90 text-navy font-semibold self-start sm:self-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Write New Blog
            </Button>
          </div>

          {blogs.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-slate-200 p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-700">
                No blog posts found
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No seed script was run for blogs. You can write your first original article right here!
              </p>
              <Button
                onClick={handleOpenAdd}
                className="mt-4 bg-navy hover:bg-navy/90 text-white"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Write First Blog
              </Button>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-slate-100">
              {blogs.map((item) => (
                <div
                  key={item._id}
                  className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  {/* Left: Thumbnail & Content info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            item.isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {item.isPublished ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" /> Draft
                            </>
                          )}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {item.date}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {item.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-gold transition truncate">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1">
                        {item.summary}
                      </p>

                      <p className="text-[11px] font-mono text-slate-400">
                        /blogs/{item.slug}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(item)}
                      title={item.isPublished ? "Unpublish" : "Publish"}
                      className="text-xs"
                    >
                      {item.isPublished ? (
                        <>
                          <EyeOff className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                          Publish
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(item)}
                      title="Edit"
                      className="text-xs"
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5 text-slate-600" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(item._id)}
                      title="Delete"
                      className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Add / Edit Blog Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form._id ? "Edit Blog Post" : "Write New Blog Post"}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Title *
            </label>
            <Input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. The Ancient Rhythm of Hand-Knotted Looms"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Slug (URL Identifier)
              </label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="ancient-rhythm-hand-knotted"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Publish Date
              </label>
              <Input
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="e.g. October 12, 2026"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Read Time
              </label>
              <Input
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                placeholder="e.g. 4 min read"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Summary (Excerpt) *
            </label>
            <Textarea
              rows={2}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="A short compelling overview shown in blog cards and previews..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Article Content (Separate paragraphs with double Enter)
            </label>
            <Textarea
              rows={7}
              value={form.contentText}
              onChange={(e) =>
                setForm({ ...form, contentText: e.target.value })
              }
              placeholder="Write the full story paragraphs here... Each blank line will create a separate paragraph block on the post page."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Featured Image {form._id ? "(Optional - keep existing if blank)" : "*"}
            </label>

            {form.image && !form.imageFile && (
              <div className="mb-3 relative h-32 w-full rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                <Image
                  src={form.image}
                  alt="Existing"
                  fill
                  className="object-cover"
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
              {form.image || form.imageFile ? "Change Featured Image" : "Upload Featured Image"}
            </Button>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished}
              onChange={(e) =>
                setForm({ ...form, isPublished: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-gold focus:ring-gold"
            />
            <label
              htmlFor="isPublished"
              className="text-xs font-medium text-slate-700 select-none cursor-pointer"
            >
              Publish immediately (visible to the public)
            </label>
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
              {form._id ? "Update Post" : "Publish Story"}
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
            Are you sure you want to delete this blog post? The featured image asset will also be permanently deleted.
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
