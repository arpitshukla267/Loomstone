import Inspiration from "../models/Inspiration.js";
import cloudinary from "../config/cloudinary.js";

const removeImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed for inspiration image:", err.message);
  }
};

// GET /api/inspiration
export const getInspirations = async (req, res) => {
  try {
    const items = await Inspiration.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/inspiration
export const createInspiration = async (req, res) => {
  const file = req.file;
  try {
    if (!file) {
      return res.status(400).json({ message: "Inspiration image is required" });
    }

    const { title, category, label, text, order } = req.body;
    const count = await Inspiration.countDocuments();
    const parsedOrder = order !== undefined ? Number(order) : count;

    const item = await Inspiration.create({
      title: title ? title.trim() : `Inspiration #${count + 1}`,
      category: category ? category.trim() : "",
      label: label ? label.trim() : "",
      text: text ? text.trim() : "",
      image: file.path,
      imagePublicId: file.filename,
      order: parsedOrder,
    });

    res.status(201).json(item);
  } catch (err) {
    if (file) await removeImage(file.filename);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/inspiration/:id
export const updateInspiration = async (req, res) => {
  const file = req.file;
  try {
    const { id } = req.params;
    const item = await Inspiration.findById(id);
    if (!item) {
      if (file) await removeImage(file.filename);
      return res.status(404).json({ message: "Inspiration not found" });
    }

    const { title, category, label, text, order } = req.body;
    if (title !== undefined) item.title = title.trim();
    if (category !== undefined) item.category = category.trim();
    if (label !== undefined) item.label = label.trim();
    if (text !== undefined) item.text = text.trim();
    if (order !== undefined) item.order = Number(order);

    let oldImageId = null;
    if (file) {
      oldImageId = item.imagePublicId;
      item.image = file.path;
      item.imagePublicId = file.filename;
    }

    await item.save();

    if (oldImageId) {
      await removeImage(oldImageId);
    }

    res.json(item);
  } catch (err) {
    if (file) await removeImage(file.filename);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/inspiration/:id
export const deleteInspiration = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inspiration.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Inspiration not found" });
    }

    if (item.imagePublicId) {
      await removeImage(item.imagePublicId);
    }

    await Inspiration.findByIdAndDelete(id);
    res.json({ message: "Inspiration image deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/inspiration/reorder
export const reorderInspirations = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds array is required" });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await Inspiration.bulkWrite(bulkOps);
    }

    res.json({ message: "Inspirations reordered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
