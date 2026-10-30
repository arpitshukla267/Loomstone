import WhyLoomstone from "../models/WhyLoomstone.js";
import cloudinary from "../config/cloudinary.js";

const removeImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err.message);
  }
};

// GET /api/why-loomstone
// Returns the singleton document (creates one with defaults if none exists)
export const getWhyLoomstone = async (req, res) => {
  try {
    let doc = await WhyLoomstone.findOne();
    if (!doc) {
      doc = await WhyLoomstone.create({
        heading: "What Sets Loomstone Apart",
        subheading:
          "Thoughtful Design. Bespoke Craftmenship. Seemless Execution.",
        features: [
          {
            icon: "Layers",
            title: "Flooring Expertise",
            text: "Axminster carpets & Rugs, Handcrafted carpets & Rugs, Textile flooring, Resilient Flooring",
            order: 0,
          },
          {
            icon: "Palette",
            title: "Design Collaboration",
            text: "Working with architects and designers to translate their creative vision into distinctive flooring concepts.",
            order: 1,
          },
          {
            icon: "Gem",
            title: "Bespoke Flooring Solutions",
            text: "Custom patterns, colours textures and specifications crafted to bring each project's unique design vision to life.",
            order: 2,
          },
          {
            icon: "Globe",
            title: "Global Manufacturing Partnerships",
            text: "Working with trusted manufacturing partners and specialist suppliers to deliver quality material, consistent standards & Bespoke flooring solutions.",
            order: 3,
          },
          {
            icon: "ClipboardCheck",
            title: "Technical Precision",
            text: "Meticulous attention to specification, accurate measurements, budget considration and project requirements ensuring flooring solutions that balance design intent, performance and practicality.",
            order: 4,
          },
          {
            icon: "Handshake",
            title: "End to End Project Support",
            text: "Coordinated support from design development to supply and installation, ensuring a seemless product journey from concept to completion .",
            order: 5,
          },
        ],
      });
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/why-loomstone
// Upserts the singleton document
export const updateWhyLoomstone = async (req, res) => {
  const uploaded = req.file;
  try {
    let doc = await WhyLoomstone.findOne();

    if (!doc) {
      doc = new WhyLoomstone();
    }

    const { heading, subheading, features } = req.body;

    if (heading !== undefined) doc.heading = heading;
    if (subheading !== undefined) doc.subheading = subheading;

    if (features !== undefined) {
      try {
        const parsed =
          typeof features === "string" ? JSON.parse(features) : features;
        if (Array.isArray(parsed)) {
          doc.features = parsed;
        }
      } catch {}
    }

    const oldImageId = doc.imageId;
    if (uploaded) {
      doc.image = uploaded.path;
      doc.imageId = uploaded.filename;
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
