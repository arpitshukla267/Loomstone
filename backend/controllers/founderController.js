import Founder from "../models/Founder.js";
import cloudinary from "../config/cloudinary.js";

const removeImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed for founder image:", err.message);
  }
};

// GET /api/founder
export const getFounder = async (req, res) => {
  try {
    let doc = await Founder.findOne();
    if (!doc) {
      doc = await Founder.create({
        sectionTitle: "Meet Our Visionary",
        founderName: "Pawan Yadav",
        designation: "Managing Partner at Loomstone",
        tagline: "Perfection is the foundation beneath every great space.",
        quote:
          "We believe exceptional hospitality is shaped by thoughtful details. Flooring is more than a surface; it is a defining design element that enhances environments, enriches guest experiences, and contributes to the enduring identity of a space.",
      });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/founder
export const updateFounder = async (req, res) => {
  const uploaded = req.file;
  try {
    let doc = await Founder.findOne();
    if (!doc) {
      doc = new Founder();
    }

    const { sectionTitle, founderName, designation, tagline, quote } = req.body;

    if (sectionTitle !== undefined) doc.sectionTitle = sectionTitle;
    if (founderName !== undefined) doc.founderName = founderName;
    if (designation !== undefined) doc.designation = designation;
    if (tagline !== undefined) doc.tagline = tagline;
    if (quote !== undefined) doc.quote = quote;

    const oldImageId = doc.imagePublicId;
    if (uploaded) {
      doc.image = uploaded.path;
      doc.imagePublicId = uploaded.filename;
    }

    await doc.save();

    if (uploaded && oldImageId) {
      await removeImage(oldImageId);
    }

    res.json(doc);
  } catch (err) {
    if (uploaded) await removeImage(uploaded.filename);
    res.status(500).json({ message: err.message });
  }
};
