import Blog, { generateBlogSlug } from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";

const removeImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed for blog image:", err.message);
  }
};

const makeUniqueSlug = async (title, excludeId = null) => {
  const base = generateBlogSlug(title) || "blog-post";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await Blog.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
};

const parseContent = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    // If not valid JSON, split by double newlines into paragraphs
    return val
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
};

// GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isPublished: true };
    const blogs = await Blog.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/blogs/:idOrSlug
export const getBlogBySlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let blog = await Blog.findOne({ slug: idOrSlug });
    if (!blog && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(idOrSlug);
    }
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/blogs
export const createBlog = async (req, res) => {
  const file = req.file;
  try {
    const { title, summary, content, date, readTime, isPublished, order } =
      req.body;
    if (!title || !title.trim()) {
      if (file) await removeImage(file.filename);
      return res.status(400).json({ message: "Blog title is required" });
    }

    const slug = await makeUniqueSlug(title);
    const count = await Blog.countDocuments();
    const parsedOrder = order !== undefined ? Number(order) : count;

    const formattedDate =
      date && date.trim()
        ? date.trim()
        : new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

    const blog = await Blog.create({
      title: title.trim(),
      slug,
      summary: summary ? summary.trim() : "",
      content: parseContent(content),
      image: file ? file.path : "",
      imagePublicId: file ? file.filename : "",
      date: formattedDate,
      readTime: readTime && readTime.trim() ? readTime.trim() : "3 min read",
      isPublished: isPublished === undefined ? true : isPublished === "true" || isPublished === true,
      order: parsedOrder,
    });

    res.status(201).json(blog);
  } catch (err) {
    if (file) await removeImage(file.filename);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  const file = req.file;
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      if (file) await removeImage(file.filename);
      return res.status(404).json({ message: "Blog not found" });
    }

    const { title, summary, content, date, readTime, isPublished, order } =
      req.body;

    if (title && title.trim()) {
      blog.title = title.trim();
      blog.slug = await makeUniqueSlug(title.trim(), blog._id);
    }
    if (summary !== undefined) blog.summary = summary.trim();
    if (content !== undefined) blog.content = parseContent(content);
    if (date !== undefined) blog.date = date.trim();
    if (readTime !== undefined) blog.readTime = readTime.trim();
    if (isPublished !== undefined)
      blog.isPublished = isPublished === "true" || isPublished === true;
    if (order !== undefined) blog.order = Number(order);

    let oldImageId = null;
    if (file) {
      oldImageId = blog.imagePublicId;
      blog.image = file.path;
      blog.imagePublicId = file.filename;
    }

    await blog.save();

    if (oldImageId) {
      await removeImage(oldImageId);
    }

    res.json(blog);
  } catch (err) {
    if (file) await removeImage(file.filename);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.imagePublicId) {
      await removeImage(blog.imagePublicId);
    }

    await Blog.findByIdAndDelete(id);
    res.json({ message: "Blog deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/blogs/:id/toggle
export const toggleBlogPublish = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
