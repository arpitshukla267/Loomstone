import mongoose from "mongoose";
import Product, { generateSlug } from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// Helper to remove images from Cloudinary
const removeImages = async (imageIds) => {
  if (!Array.isArray(imageIds) || imageIds.length === 0) return;
  for (const id of imageIds) {
    if (id) {
      try {
        await cloudinary.uploader.destroy(id);
      } catch (err) {
        console.error("Cloudinary delete failed for:", id, err.message);
      }
    }
  }
};

// Robust helper to parse array fields from FormData
const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => String(v).trim()).filter(Boolean);
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean);
      } catch {}
    }
    return trimmed.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

// Helper to parse existingImages JSON
const parseExistingImages = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {}
  }
  return [];
};

// Generate a guaranteed unique slug for product
const makeUniqueSlug = async (name, excludeId = null) => {
  const base = generateSlug(name) || "product";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await Product.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
};

// GET /api/products
// Public: only active. Admin: ?all=true returns all. Supports ?category=... & ?room=...
export const getProducts = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };

    if (req.query.category && req.query.category !== "All") {
      filter.category = { $regex: new RegExp(`^${req.query.category}$`, "i") };
    }

    if (req.query.room && req.query.room !== "All") {
      filter.rooms = { $elemMatch: { $regex: new RegExp(`^${req.query.room}$`, "i") } };
    }

    const products = await Product.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:idOrSlug
export const getProductBySlugOrId = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      product = await Product.findById(idOrSlug);
    }
    if (!product) {
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If request is not admin all=true and product is inactive
    if (req.query.all !== "true" && !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  const uploadedFiles = req.files || [];
  const uploadedImageIds = uploadedFiles.map((f) => f.filename);

  try {
    const { name, desc, category, order, isActive } = req.body;

    if (!name?.trim()) {
      await removeImages(uploadedImageIds);
      return res.status(400).json({ message: "Product name is required" });
    }

    const slug = await makeUniqueSlug(name.trim());
    const rooms = parseList(req.body.rooms);
    const sizes = parseList(req.body.sizes);
    const options = parseList(req.body.options);

    const images = uploadedFiles.map((f) => ({
      url: f.path,
      imageId: f.filename,
    }));

    const product = await Product.create({
      name: name.trim(),
      slug,
      desc: desc !== undefined ? desc : "", // store raw text
      category: category?.trim() || "",
      rooms,
      sizes,
      options,
      images,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive === "true" || isActive === true) : true,
    });

    res.status(201).json(product);
  } catch (err) {
    await removeImages(uploadedImageIds);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const uploadedFiles = req.files || [];
  const newlyUploadedIds = uploadedFiles.map((f) => f.filename);

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      await removeImages(newlyUploadedIds);
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, desc, category, order, isActive } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        await removeImages(newlyUploadedIds);
        return res.status(400).json({ message: "Product name cannot be empty" });
      }
      if (name.trim() !== product.name) {
        product.name = name.trim();
        product.slug = await makeUniqueSlug(name.trim(), product._id);
      }
    }

    if (desc !== undefined) {
      product.desc = desc; // preserve raw string with newlines
    }

    if (category !== undefined) {
      product.category = category.trim();
    }

    if (req.body.rooms !== undefined) {
      product.rooms = parseList(req.body.rooms);
    }

    if (req.body.sizes !== undefined) {
      product.sizes = parseList(req.body.sizes);
    }

    if (req.body.options !== undefined) {
      product.options = parseList(req.body.options);
    }

    if (order !== undefined) {
      product.order = Number(order);
    }

    if (isActive !== undefined) {
      product.isActive = Boolean(isActive === "true" || isActive === true);
    }

    // Handle Images: Retained + New Uploads
    // req.body.existingImages contains JSON array of remaining images
    let retainedImages = [];
    if (req.body.existingImages !== undefined) {
      retainedImages = parseExistingImages(req.body.existingImages);

      // Find any previously stored images that were removed by admin
      const retainedImageIds = new Set(retainedImages.map((img) => img.imageId));
      const removedImages = product.images.filter((img) => !retainedImageIds.has(img.imageId));
      if (removedImages.length > 0) {
        await removeImages(removedImages.map((img) => img.imageId));
      }
    } else {
      retainedImages = product.images;
    }

    const newImages = uploadedFiles.map((f) => ({
      url: f.path,
      imageId: f.filename,
    }));

    product.images = [...retainedImages, ...newImages];

    await product.save();
    res.json(product);
  } catch (err) {
    await removeImages(newlyUploadedIds);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/products/:id/toggle
export const toggleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isActive = !product.isActive;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete all associated images from Cloudinary
    if (Array.isArray(product.images) && product.images.length > 0) {
      await removeImages(product.images.map((img) => img.imageId));
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
