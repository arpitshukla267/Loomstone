import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Category from "../models/Category.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../../frontend/public");
const CLOUDINARY_FOLDER = "loomstone";

const categoriesData = [
  {
    name: "Hand-Tufted Carpets & Rugs",
    desc: "Yarn is punched into a canvas frame using a tufting gun and secured with latex backing for a thick, cushioned pile.",
    relPath: "products/hand-tufted.webp",
    slug: "category-hand-tufted",
    order: 0,
  },
  {
    name: "Hand-Knotted Rugs",
    desc: "Individually knotted by skilled artisans, these exceptionally durable rugs can last 50–100+ years with proper care.",
    relPath: "products/hand-knotted.webp",
    slug: "category-hand-knotted",
    order: 1,
  },
  {
    name: "Handloom Rugs",
    desc: "Woven by master weavers on traditional shuttle looms, offering subtle textural ribs, organic flatweaves, and timeless warmth.",
    relPath: "products/handloom-rug.webp",
    slug: "category-handloom",
    order: 2,
  },
  {
    name: "Axminster Carpets & Rugs",
    desc: "Precision-woven high-density wool-rich carpets crafted for grand hospitality ballrooms, luxury suites, and statement residential floors.",
    relPath: "carpet.jpeg",
    slug: "category-axminster",
    order: 3,
  },
  {
    name: "Carpet Tiles",
    desc: "Modular, high-performance textile squares engineered for modern corporate headquarters, commercial spaces, and versatile design layouts.",
    relPath: "products/carpet-tiles.webp",
    slug: "category-carpet-tiles",
    order: 4,
  },
];

const uploadImage = async (relPath, publicId) => {
  const filePath = path.join(PUBLIC_DIR, relPath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Category image file not found: ${filePath}`);
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: CLOUDINARY_FOLDER,
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });

  return { url: result.secure_url, imageId: result.public_id };
};

const seed = async () => {
  const force = process.argv.includes("--force");
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Neither MONGODB_URI nor MONGO_URI is defined");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const existing = await Category.find();
  if (existing.length && !force) {
    console.log(
      `${existing.length} categories already exist. Re-seeding with images: run with --force`
    );
  }

  if (existing.length && (force || existing.some((c) => !c.image))) {
    console.log("Replacing existing categories with image-backed categories...");
    for (const c of existing) {
      if (c.imageId) {
        try {
          await cloudinary.uploader.destroy(c.imageId);
        } catch {}
      }
    }
    await Category.deleteMany({});
  } else if (existing.length && !force) {
    return;
  }

  console.log(`Seeding ${categoriesData.length} categories with Cloudinary images...`);
  for (const item of categoriesData) {
    console.log(`Uploading image for "${item.name}" to Cloudinary folder "${CLOUDINARY_FOLDER}"...`);
    const { url, imageId } = await uploadImage(item.relPath, item.slug);

    await Category.create({
      name: item.name,
      desc: item.desc,
      text: item.desc,
      image: url,
      imageId,
      order: item.order,
      isActive: true,
    });
    console.log(`  ✓ Created category: ${item.name} -> ${url}`);
  }

  console.log("Categories seeded successfully with images!");
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
