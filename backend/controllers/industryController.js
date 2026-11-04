import { IndustrySection, IndustryCard, generateIndustrySlug } from "../models/Industry.js";
import cloudinary from "../config/cloudinary.js";

const removeImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed for industry image:", err.message);
  }
};

const makeUniqueSlug = async (name, excludeId = null) => {
  const base = generateIndustrySlug(name) || "industry";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await IndustryCard.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
};

// GET /api/industries
export const getIndustries = async (req, res) => {
  try {
    let section = await IndustrySection.findOne();
    if (!section) {
      section = await IndustrySection.create({
        heading: "Industries We Serve",
        description:
          "From iconic hospitality destinations to refined commercial spaces and residences, we create bespoke flooring that brings design vision to life.",
        eyebrow: "Global Flooring Solutions",
      });
    }

    const filter = req.query.all === "true" ? {} : { isActive: true };
    const cards = await IndustryCard.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      heading: section.heading,
      description: section.description,
      eyebrow: section.eyebrow,
      cards,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/industries/section
export const updateSection = async (req, res) => {
  try {
    let section = await IndustrySection.findOne();
    if (!section) {
      section = new IndustrySection();
    }

    const { heading, sectionHeading, description, sectionDesc, eyebrow } = req.body;

    if (heading !== undefined || sectionHeading !== undefined) {
      section.heading = heading !== undefined ? heading : sectionHeading;
    }
    if (description !== undefined || sectionDesc !== undefined) {
      section.description = description !== undefined ? description : sectionDesc;
    }
    if (eyebrow !== undefined) {
      section.eyebrow = eyebrow;
    }

    await section.save();
    res.json({
      heading: section.heading,
      description: section.description,
      eyebrow: section.eyebrow,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/industries/cards
export const createCard = async (req, res) => {
  const file = req.file;
  try {
    const { name, order } = req.body;
    if (!name || !name.trim()) {
      if (file) await removeImage(file.filename);
      return res.status(400).json({ message: "Card name is required" });
    }
    if (!file) {
      return res.status(400).json({ message: "Card image is required" });
    }

    const slug = await makeUniqueSlug(name);
    const count = await IndustryCard.countDocuments();
    const parsedOrder = order !== undefined ? Number(order) : count;

    const card = await IndustryCard.create({
      name: name.trim(),
      slug,
      image: file.path,
      imageId: file.filename,
      order: parsedOrder,
      isActive: true,
    });

    res.status(201).json(card);
  } catch (err) {
    if (file) await removeImage(file.filename);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/industries/cards/:id
export const updateCard = async (req, res) => {
  const file = req.file;
  try {
    const { id } = req.params;
    const card = await IndustryCard.findById(id);
    if (!card) {
      if (file) await removeImage(file.filename);
      return res.status(404).json({ message: "Industry card not found" });
    }

    const { name, order, isActive } = req.body;

    if (name && name.trim()) {
      card.name = name.trim();
      card.slug = await makeUniqueSlug(name.trim(), card._id);
    }

    if (order !== undefined) {
      card.order = Number(order);
    }

    if (isActive !== undefined) {
      card.isActive = isActive === "true" || isActive === true;
    }

    let oldImageId = null;
    if (file) {
      oldImageId = card.imageId;
      card.image = file.path;
      card.imageId = file.filename;
    }

    await card.save();

    if (oldImageId) {
      await removeImage(oldImageId);
    }

    res.json(card);
  } catch (err) {
    if (file) await removeImage(file.filename);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/industries/cards/:id
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await IndustryCard.findById(id);
    if (!card) {
      return res.status(404).json({ message: "Industry card not found" });
    }

    if (card.imageId) {
      await removeImage(card.imageId);
    }

    await IndustryCard.findByIdAndDelete(id);
    res.json({ message: "Card deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/industries/cards/reorder
export const reorderCards = async (req, res) => {
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
      await IndustryCard.bulkWrite(bulkOps);
    }

    res.json({ message: "Cards reordered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
