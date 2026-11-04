import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import cloudinary from "../config/cloudinary.js";
import HeroSection from "../models/heroSection.js";

// Check hero-backup folder first (present frontend slides), fallback to hero folder
const HERO_BACKUP_DIR = path.resolve(__dirname, "../../frontend/public/hero-backup");
const HERO_DIR = path.resolve(__dirname, "../../frontend/public/hero");

const resolveImagePath = (fileName) => {
  const backupPath = path.join(HERO_BACKUP_DIR, fileName);
  if (fs.existsSync(backupPath)) return backupPath;

  const standardPath = path.join(HERO_DIR, fileName);
  if (fs.existsSync(standardPath)) return standardPath;

  throw new Error(`Hero image file not found: ${fileName} in ${HERO_BACKUP_DIR} or ${HERO_DIR}`);
};

const CLOUDINARY_FOLDER = "loomstone";

// Present frontend hero slides (from frontend/components/sections/hero-section.tsx)
const slides = [
  {
    file: "axminster-2.webp",
    heading: "Bespoke Fashionable Flooring",
    description: "Crafted for exceptional interiors, Designed around your vision.",
    primaryText: "",
    secondaryText: "",
  },
  {
    file: "handmade.webp",
    heading: "Beyond Flooring, An Art of Living.",
    description:
      "Expertly handcrafted to bring timeless elegance, refined textures, and exceptional character to every space.",
    primaryText: "",
    secondaryText: "",
  },
  {
    file: "carpet-tiles.webp",
    heading: "Soft on the Surface. Strong at the Core.",
    description: "Where every floor tells a story.",
    primaryText: "",
    secondaryText: "",
  },
  {
    file: "resilient-flooring.webp",
    heading: "Where Performance Meets Perfection.",
    description:
      "Resilient flooring made for high-traffic spaces without compromising on style. Strong, easy to maintain, and designed to look flawless for years.",
    primaryText: "",
    secondaryText: "",
  },
];

const uploadImage = async (fileName) => {
  const filePath = resolveImagePath(fileName);

  const result = await cloudinary.uploader.upload(filePath, {
    folder: CLOUDINARY_FOLDER,
    public_id: `hero-${path.parse(fileName).name}`,
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
  console.log("MongoDB connected");

  const existing = await HeroSection.find();

  if (existing.length && !force) {
    console.log(
      `${existing.length} slides already exist. To reseed: npm run seed:hero -- --force`
    );
    return;
  }

  if (existing.length && force) {
    console.log("--force: Removing existing hero slides and Cloudinary images...");
    for (const slide of existing) {
      if (slide.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(slide.imagePublicId);
        } catch {}
      }
    }
    await HeroSection.deleteMany({});
  }

  console.log(`Seeding ${slides.length} hero slides from present frontend...`);
  for (const [index, slide] of slides.entries()) {
    console.log(`Uploading ${slide.file}...`);
    const { url, publicId } = await uploadImage(slide.file);

    await HeroSection.create({
      image: url,
      imagePublicId: publicId,
      heading: slide.heading,
      description: slide.description,
      primaryText: slide.primaryText,
      secondaryText: slide.secondaryText,
      order: index,
      isActive: true,
    });
    console.log(`  ✓ Created slide ${index + 1}: ${slide.heading}`);
  }

  console.log(`Done: ${slides.length} hero slides seeded successfully.`);
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
