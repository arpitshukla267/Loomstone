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
      "High-performance flooring crafted for luxury hospitality and commercial environments, seamlessly blending enduring beauty, exceptional durability, and world-class craftsmanship.",
    fileNames: ["Ax.jpg"],
    order: 0,
  },
  {
    name: "Bespoke Hand-crafted Carpets & Rugs",
    slug: "bespoke-hand-crafted-carpets-rugs",
    description:
      "Created by skilled artisans and tailored to the most demanding design visions, our bespoke carpets and rugs combine exquisite craftsmanship, unparalleled customization, and timeless luxury.",
    fileNames: ["hk.jpg", "hand-tuffted.jpg"],
    order: 1,
  },
  {
    name: "Textile Flooring",
    slug: "textile-flooring",
    description:
      "Architectural flooring solutions crafted for modern workplaces, hospitality spaces, and commercial interiors, combining sophisticated design, exceptional performance, and limitless creative possibilities.",
    fileNames: ["tile.jpg"],
    order: 2,
  },
  {
    name: "Resilient Flooring",
    slug: "resilient-flooring",
    description:
      "Engineered for demanding commercial and hospitality interiors, our resilient flooring pairs lasting durability with comfort underfoot and refined architectural finishes. A low-maintenance surface that performs beautifully in high-traffic spaces without compromising on design.",
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
