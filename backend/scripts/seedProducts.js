import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

const FINAL_WEBSITE_DIR = path.resolve(__dirname, "../../frontend/public/final-website");
const PRODUCTS_FALLBACK_DIR = path.resolve(__dirname, "../../frontend/public/products");

const CLOUDINARY_FOLDER = "loomstone";

const resolveProductImage = (fileName) => {
  const p1 = path.join(FINAL_WEBSITE_DIR, fileName);
  if (fs.existsSync(p1)) return p1;

  const p2 = path.join(PRODUCTS_FALLBACK_DIR, fileName);
  if (fs.existsSync(p2)) return p2;

  throw new Error(`Product image file not found: ${fileName} in ${FINAL_WEBSITE_DIR} or ${PRODUCTS_FALLBACK_DIR}`);
};

// Present frontend products (from frontend/data/products.ts)
const presentProductsData = [
  {
    name: "Bespoke Axminster Carpets & Rugs",
    slug: "bespoke-axminster-carpets-rugs",
    description:
      "Precision-woven on state-of-the-art looms, our Axminster carpets deliver unlimited design freedom with exceptional durability — engineered to retain colour, pattern definition, and pile resilience across millions of footfalls in luxury hotels, resorts, and premium commercial interiors.",
    fileNames: ["Ax.jpg"],
    order: 0,
  },
  {
    name: "Bespoke Hand-crafted Carpets & Rugs",
    slug: "bespoke-hand-crafted-carpets-rugs",
    description:
      "Hand-knotted and hand-tufted by master artisans using the finest New Zealand wool, silk, and botanical fibres. Each piece is a one-of-a-kind creation — custom-designed to complement signature suites, presidential lobbies, and heritage restoration projects.",
    fileNames: ["hk.jpg"],
    order: 1,
  },
  {
    name: "Textile Flooring",
    slug: "textile-flooring",
    description:
      "Modular carpet tiles and broadloom solutions engineered for modern workplaces, convention centres, and hospitality corridors. Superior acoustic performance, rapid installation, and virtually limitless colour and texture combinations for dynamic commercial environments.",
    fileNames: ["tile.jpg"],
    order: 2,
  },
  {
    name: "Resilient Flooring",
    slug: "resilient-flooring",
    description:
      "Luxury Vinyl Tile (LVT), SPC, and heterogeneous vinyl flooring that replicates the beauty of natural wood and stone with waterproof, scratch-resistant, and low-maintenance performance — ideal for high-traffic hospitality zones, healthcare facilities, and F&B spaces.",
    fileNames: ["lvt.jpg"],
    order: 3,
  },
];

const uploadImage = async (fileName, publicId) => {
  const filePath = resolveProductImage(fileName);

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

  const existing = await Product.find();
  if (existing.length && !force) {
    console.log(
      `${existing.length} products already exist in database. Use --force to re-seed all.`
    );
    return;
  }

  if (existing.length && force) {
    console.log("--force: Removing existing products and Cloudinary images...");
    for (const p of existing) {
      if (Array.isArray(p.images)) {
        for (const img of p.images) {
          try {
            if (img.imageId) await cloudinary.uploader.destroy(img.imageId);
          } catch {}
        }
      }
    }
    await Product.deleteMany({});
  }

  console.log(`Seeding ${presentProductsData.length} products to MongoDB...`);
  for (const item of presentProductsData) {
    const uploadedImages = [];

    for (let i = 0; i < item.fileNames.length; i++) {
      const fileName = item.fileNames[i];
      const publicId = `product-${item.slug}-${i + 1}`;
      console.log(`Uploading "${fileName}" for "${item.name}"...`);
      const imgData = await uploadImage(fileName, publicId);
      uploadedImages.push(imgData);
    }

    await Product.create({
      name: item.name,
      slug: item.slug,
      desc: item.description,
      description: item.description,
      images: uploadedImages,
      order: item.order,
      isActive: true,
    });
    console.log(`  ✓ Created product: ${item.name} (${uploadedImages.length} images)`);
  }

  console.log(`All ${presentProductsData.length} products seeded successfully!`);
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
