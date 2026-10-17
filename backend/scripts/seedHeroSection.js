import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import HeroSection from "../models/HeroSection.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Frontend ke public/hero folder ka path. Apne hisaab se .env mein set karo.
const IMAGES_DIR =
  process.env.HERO_IMAGES_DIR ||
  path.resolve(__dirname, "../../frontend/public/hero");

const CLOUDINARY_FOLDER = "loomstone/hero-section";

// Heading format: *word* = gold word, \n = line break
const slides = [
  {
    file: "hero-1.png",
    heading: "Handmade rugs for *beautiful* spaces.",
    description:
      "Carefully woven by hand using natural wool and silk. Designed to fit your home, hotel, or office perfectly.",
    primaryText: "Explore Collections",
    secondaryText: "Inquire About a Custom Rug",
  },
  {
    file: "carpet-tiles.png",
    heading: "Designed for *Spaces* That Move You.",
    description:
      "Redefine modern interiors with precision-crafted carpet tiles that bring together distinctive textures, contemporary patterns, and lasting performance.",
    primaryText: "Discover Our Rugs",
    secondaryText: "Create Your Custom Rug",
  },
  {
    file: "axminster.png",
    heading: "Timeless Patterns. *Exceptional* Performance.",
    description:
      "Discover premium Axminster carpets and rugs featuring intricate woven patterns, rich textures, and exceptional durability—crafted to bring timeless elegance to luxury homes, hotels, and commercial spaces.",
    primaryText: "Discover Our Rugs",
    secondaryText: "Create Your Custom Rug",
  },
  {
    file: "hero-6.jpeg",
    heading: "Made by hand. *Made for you.*",
    description:
      "From carefully chosen materials to refined finishes, find a rug that feels uniquely yours.",
    primaryText: "View Collections",
    secondaryText: "Design Your Own Rug",
  },
  {
    file: "handloom-rugs.png",
    heading: "Handwoven Heritage,\n*Naturally Refined*",
    description:
      "Discover handloom rugs crafted with traditional weaving techniques, natural textures, and timeless patterns—bringing warmth, character, and understated elegance to every space.",
    primaryText: "View Collections",
    secondaryText: "Design Your Own Rug",
  },
];

const uploadImage = async (fileName) => {
  const filePath = path.join(IMAGES_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image not found: ${filePath}`);
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: CLOUDINARY_FOLDER,
    public_id: path.parse(fileName).name, // hero-1.png -> hero-1
    overwrite: true,
    resource_type: "image",
  });

  return { url: result.secure_url, publicId: result.public_id };
};

const seed = async () => {
  const force = process.argv.includes("--force");

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const existing = await HeroSection.find();

  if (existing.length && !force) {
    console.log(
      `${existing.length} slides pehle se hain. Dobara seed karne ke liye: npm run seed:hero -- --force`,
    );
    return;
  }

  if (existing.length && force) {
    console.log("--force: purane slides aur unki images hata raha hu...");
    for (const slide of existing) {
      await cloudinary.uploader.destroy(slide.imagePublicId);
    }
    await HeroSection.deleteMany({});
  }

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
  }

  console.log(`Done: ${slides.length} slides seed ho gaye.`);
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
