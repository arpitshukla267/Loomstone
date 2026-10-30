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
export const getProducts = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
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
    const { name, desc, description, order, isActive } = req.body;

    if (!name?.trim()) {
      await removeImages(uploadedImageIds);
      return res.status(400).json({ message: "Product name is required" });
    }

    const slug = await makeUniqueSlug(name.trim());

    const images = uploadedFiles.map((f) => ({
      url: f.path,
      imageId: f.filename,
    }));

    const descText = description !== undefined ? description : (desc !== undefined ? desc : "");

    const product = await Product.create({
      name: name.trim(),
      slug,
      desc: descText,
      description: descText,
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

    const { name, desc, description, order, isActive } = req.body;

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

    if (description !== undefined) {
      product.description = description;
      product.desc = description;
    } else if (desc !== undefined) {
      product.desc = desc;
      product.description = desc;
    }

    if (order !== undefined) {
      product.order = Number(order);
    }

    if (isActive !== undefined) {
      product.isActive = Boolean(isActive === "true" || isActive === true);
    }

    // Handle Images: Retained + New Uploads
    let retainedImages = [];
    if (req.body.existingImages !== undefined) {
      retainedImages = parseExistingImages(req.body.existingImages);

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

    if (Array.isArray(product.images) && product.images.length > 0) {
      await removeImages(product.images.map((img) => img.imageId));
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
