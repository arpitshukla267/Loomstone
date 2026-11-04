import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import cloudinary from "../config/cloudinary.js";
import { IndustrySection, IndustryCard } from "../models/Industry.js";

const INDUSTRIES_DIR = path.resolve(__dirname, "../../frontend/public/industries");
const CLOUDINARY_FOLDER = "loomstone";

const sectionData = {
  heading: "Industries We Serve",
  description:
    "From iconic hospitality destinations to refined commercial spaces and residences, we create bespoke flooring that brings design vision to life.",
  eyebrow: "Global Flooring Solutions",
};

const initialCardsData = [
  {
    name: "Hospitality",
    slug: "hospitality",
    fileName: "Hospitality.PNG",
    order: 0,
  },
  {
    name: "Luxury Residential",
    slug: "luxury-residential",
    fileName: "Residencieal.PNG",
    order: 1,
  },
  {
    name: "Corp & Commercial spaces",
    slug: "corporate-commercial",
    fileName: "corporate-commercial.jpeg",
    order: 2,
  },
  {
    name: "Public Spaces",
    slug: "public-institutional",
    fileName: "public-institutional.png",
    order: 3,
  },
  {
    name: "Leisure & Entertainment",
    slug: "leisure-entertainment",
    fileName: "leisure-entertainment.jpeg",
    order: 4,
  },
  {
    name: "Gaming",
    slug: "gaming",
    fileName: "Gaming.png",
    order: 5,
  },
];

const uploadImage = async (fileName, publicId) => {
  const filePath = path.join(INDUSTRIES_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Industry image file not found: ${filePath}`);
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

  // 1. Seed or update IndustrySection
  let section = await IndustrySection.findOne();
  if (!section) {
    section = await IndustrySection.create(sectionData);
    console.log("Created IndustrySection with heading & description.");
  } else if (force) {
    section.heading = sectionData.heading;
    section.description = sectionData.description;
    section.eyebrow = sectionData.eyebrow;
    await section.save();
    console.log("Updated IndustrySection.");
  }

  // 2. Seed cards
  const existingCards = await IndustryCard.find();
  if (existingCards.length && !force) {
    console.log(
      `${existingCards.length} industry cards already exist. Use --force to re-seed.`
    );
    return;
  }

  if (existingCards.length && force) {
    console.log("--force: Removing existing industry cards and images...");
    for (const card of existingCards) {
      if (card.imageId) {
        try {
          await cloudinary.uploader.destroy(card.imageId);
        } catch {}
      }
    }
    await IndustryCard.deleteMany({});
  }

  console.log(`Seeding ${initialCardsData.length} industry cards...`);
  for (const item of initialCardsData) {
    console.log(`Uploading ${item.fileName} for "${item.name}"...`);
    const { url, imageId } = await uploadImage(item.fileName, `industry-${item.slug}`);

    await IndustryCard.create({
      name: item.name,
      slug: item.slug,
      image: url,
      imageId,
      order: item.order,
      isActive: true,
    });
    console.log(`  ✓ Created industry card: ${item.name}`);
  }

  console.log("Industries section and all cards seeded successfully!");
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
