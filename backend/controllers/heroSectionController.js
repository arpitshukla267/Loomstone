import heroSection from "../models/heroSection.js";
import cloudinary from "../config/cloudinary.js";

// GET /api/hero-section  -> website ke liye (sirf active slides), CMS ke liye (?all=true)
export const getHeroSections = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const slides = await heroSection.find(filter).sort({
      order: 1,
      createdAt: 1,
    });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hero section slides", error });
  }
};
export const getHeroSection = getHeroSections;

// GET /api/hero-section/all  -> admin ke liye (sabhi slides)
export const getAllHeroSections = async (req, res) => {
  try {
    const slides = await heroSection.find().sort({
      order: 1,
      createdAt: 1,
    });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hero section slides", error });
  }
};
export const getAllHeroSection = getAllHeroSections;

// GET /api/hero-section/:id
export const getHeroSectionById = async (req, res) => {
  try {
    const slide = await heroSection.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json(slide);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hero section slide", error });
  }
};

// POST /api/hero-section
export const createHeroSection = async (req, res) => {
  try {
    if (
      !req.file ||
      !req.body.heading ||
      !req.body.description ||
      !req.body.primaryText
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const { heading, description, primaryText, secondaryText, order, isActive } =
      req.body;
    const slide = await heroSection.create({
      image: req.file.path,
      imagePublicId: req.file.filename,
      heading,
      description,
      primaryText,
      secondaryText,
      order: order ? Number(order) : 0,
      isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
    });
    res.status(201).json(slide);
  } catch (error) {
    res.status(500).json({ message: "Error creating hero section slide", error });
  }
};

// PUT /api/hero-section/:id
export const updateHeroSection = async (req, res) => {
  try {
    const slide = await heroSection.findById(req.params.id);
    if (!slide) {
      if (req.file) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(404).json({ message: "Slide not found" });
    }
    const fields = [
      "heading",
      "description",
      "primaryText",
      "secondaryText",
      "order",
      "isActive",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "isActive") {
          slide[field] = req.body[field] === "true" || req.body[field] === true;
        } else if (field === "order") {
          slide[field] = Number(req.body[field]);
        } else {
          slide[field] = req.body[field];
        }
      }
    });

    // If a new image is uploaded, delete the old one from Cloudinary
    if (req.file) {
      await cloudinary.uploader.destroy(slide.imagePublicId);
      slide.image = req.file.path;
      slide.imagePublicId = req.file.filename;
      await slide.save();
    } else {
      await slide.save();
    }

    res.json(slide);
  } catch (error) {
    res.status(500).json({ message: "Error updating hero section slide", error });
  }
};

// PATCH /api/hero-section/:id/toggle
export const toggleHeroSection = async (req, res) => {
  try {
    const slide = await heroSection.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });
    slide.isActive = !slide.isActive;
    await slide.save();
    res.json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/hero-section/:id
export const deleteHeroSection = async (req, res) => {
  try {
    const slide = await heroSection.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    await cloudinary.uploader.destroy(slide.imagePublicId);
    await slide.deleteOne();

    res.json({ message: "Slide deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};