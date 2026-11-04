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
    title: "Unbleached Highland Fleece",
    category: "Weave Textures",
    label: "Pure Mountain Wool",
    text: "Natural sheep wool washed with mountain water, soft and durable.",
    fileName: "1.jpeg",
    order: 0,
  },
  {
    title: "Walnut Husks & Plant Roots",
    category: "Natural Dyes",
    label: "Natural Color",
    text: "Warm earthy tones made from boiled walnut husks and botanical extracts.",
    fileName: "2.png",
    order: 1,
  },
  {
    title: "Hand-Knotting on the Loom",
    category: "Artisan Workshops",
    label: "Knot Quality",
    text: "Artisans tying fine knots row by row on upright wooden looms.",
    fileName: "3.png",
    order: 2,
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
