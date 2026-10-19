import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

const removeImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed for category image:", err.message);
  }
};

// Public: only active. Admin: ?all=true returns all
export const getCategories = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCategory = async (req, res) => {
  const uploaded = req.file;
  try {
    const { name, desc, text, order, isActive } = req.body;
    if (!name?.trim()) {
      await removeImage(uploaded?.filename);
      return res.status(400).json({ message: "Category name is required" });
    }

    const description = (desc || text || "").trim();

    const category = await Category.create({
      name: name.trim(),
      desc: description,
      text: description,
      image: uploaded ? uploaded.path : (req.body.image || ""),
      imageId: uploaded ? uploaded.filename : (req.body.imageId || ""),
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive === "true" || isActive === true) : true,
    });

    res.status(201).json(category);
  } catch (err) {
    await removeImage(uploaded?.filename);
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const uploaded = req.file;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      await removeImage(uploaded?.filename);
      return res.status(404).json({ message: "Category not found" });
    }

    if (req.body.name !== undefined) {
      if (!req.body.name.trim()) {
        await removeImage(uploaded?.filename);
        return res.status(400).json({ message: "Category name cannot be empty" });
      }
      category.name = req.body.name.trim();
    }

    if (req.body.desc !== undefined || req.body.text !== undefined) {
      const description = (req.body.desc || req.body.text || "").trim();
      category.desc = description;
      category.text = description;
    }

    if (req.body.order !== undefined) {
      category.order = Number(req.body.order);
    }

    if (req.body.isActive !== undefined) {
      category.isActive = Boolean(req.body.isActive === "true" || req.body.isActive === true);
    }

    const oldImageId = category.imageId;
    if (uploaded) {
      category.image = uploaded.path;
      category.imageId = uploaded.filename;
    } else if (req.body.image !== undefined && !req.body.image) {
      category.image = "";
      category.imageId = "";
    }

    await category.save();

    if (uploaded && oldImageId) {
      await removeImage(oldImageId);
    }

    res.json(category);
  } catch (err) {
    await removeImage(uploaded?.filename);
    res.status(500).json({ message: err.message });
  }
};

export const toggleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    category.isActive = !category.isActive;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.imageId) {
      await removeImage(category.imageId);
    }

    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
