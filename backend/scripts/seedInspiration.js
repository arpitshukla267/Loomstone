import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import cloudinary from "../config/cloudinary.js";
import Inspiration from "../models/Inspiration.js";

const INSPIRATION_DIR = path.resolve(__dirname, "../../frontend/public/inspiration");
const CLOUDINARY_FOLDER = "loomstone";

const inspirationData = [
  {
    title: "Heritage Wool — Straight from the Highlands",
    category: "Raw Materials",
    label: "New Zealand & Highland Wool",
    text: "Sourced from high-altitude pastures, our unbleached wool delivers natural resilience, rich texture, and a soft hand-feel that synthetics cannot replicate — the foundation of every premium Loomstone carpet.",
    fileName: "1.webp",
    order: 0,
  },
  {
    title: "Nature's Palette — Botanical Dye Traditions",
    category: "Natural Dyes & Colour",
    label: "Sustainable Colour",
    text: "Walnut husks, indigo leaves, pomegranate rinds, and madder root — time-honoured dyeing techniques yield rich, fade-resistant tones that deepen with age, bringing warmth and authenticity to bespoke hospitality interiors.",
    fileName: "2.webp",
    order: 1,
  },
  {
    title: "The Art of the Knot — Artisan Craftsmanship",
    category: "Artisan Workshops",
    label: "Hand-Knotted Excellence",
    text: "Master weavers tie up to 400 knots per square inch on traditional wooden looms — each carpet taking months to complete. This centuries-old craft ensures unmatched detail, durability, and a truly one-of-a-kind surface.",
    fileName: "3.webp",
    order: 2,
  },
  {
    title: "Design Meets Architecture — Inspired Installations",
    category: "Project Showcase",
    label: "Luxury Hospitality",
    text: "From grand ballroom carpets echoing Mughal geometry to minimalist lobby runners in contemporary resorts — our installations demonstrate how bespoke flooring can anchor the design narrative of world-class spaces.",
    fileName: "4.webp",
    order: 3,
  },
];

const uploadImage = async (fileName, publicId) => {
  const filePath = path.join(INSPIRATION_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Inspiration image file not found: ${filePath}`);
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: CLOUDINARY_FOLDER,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  return { url: result.secure_url, publicId: result.public_id };
};

const seed = async () => {
  const force = process.argv.includes("--force");
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Neither MONGODB_URI nor MONGO_URI is defined");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const existing = await Inspiration.find();
  if (existing.length && !force) {
    console.log(
      `${existing.length} inspiration images already exist in database. Use --force to re-seed.`
    );
    return;
  }

  if (existing.length && force) {
    console.log("--force: Removing existing inspiration items and Cloudinary files...");
    for (const item of existing) {
      if (item.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(item.imagePublicId);
        } catch {}
      }
    }
    await Inspiration.deleteMany({});
  }

  console.log(`Seeding ${inspirationData.length} inspiration images...`);
  for (const item of inspirationData) {
    const publicId = `inspiration-${path.parse(item.fileName).name}`;
    console.log(`Uploading ${item.fileName} for "${item.title}"...`);
    const { url, publicId: imgId } = await uploadImage(item.fileName, publicId);

    await Inspiration.create({
      title: item.title,
      category: item.category,
      label: item.label,
      text: item.text,
      image: url,
      imagePublicId: imgId,
      order: item.order,
    });
    console.log(`  ✓ Created inspiration: ${item.title}`);
  }

  console.log("Inspiration images seeded successfully!");
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
