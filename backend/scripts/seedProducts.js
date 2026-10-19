import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.resolve(__dirname, "../../frontend/public/products");
const CLOUDINARY_FOLDER = "loomstone";

const allProductsData = [
  {
    name: "Carpet Tiles",
    slug: "carpet-tiles",
    desc: `Versatile modular carpet tiles designed for modern commercial and residential spaces.

Durable modular construction with flexible installation patterns and stain-resistant treatment.`,
    category: "Carpet Tiles",
    rooms: ["Office & Study", "Living Room"],
    sizes: ["50 x 50 cm", "Custom Size"],
    options: ["Solution-Dyed Nylon", "Commercial Grade"],
    fileName: "carpet-tiles.webp",
    order: 0,
  },
  {
    name: "Flatweave Rugs",
    slug: "flatweave",
    desc: `Lightweight flatwoven rugs with understated patterns and versatile styling.

Crafted by master weavers on traditional shuttle looms, each piece brings organic warmth and subtle texture to residential and hospitality settings.`,
    category: "Handloom Rugs",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    options: ["Wool & Natural Fibres", "Low Profile Weave"],
    fileName: "flatweave.webp",
    order: 1,
  },
  {
    name: "Hand-Knotted Rugs",
    slug: "hand-knotted",
    desc: `Artisan-crafted rugs showcasing intricate patterns and timeless character.

Individually hand-knotted with over 120 knots per square inch, these heirloom-grade floor coverings offer acoustic dampening and incomparable tactile richness.`,
    category: "Hand-Knotted Rugs",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    sizes: ["6 x 9 ft", "8 x 10 ft", "9 x 12 ft", "Custom Size"],
    options: ["New Zealand Wool & Silk", "High Knot Density"],
    fileName: "hand-knotted.webp",
    order: 2,
  },
  {
    name: "Handloom Rugs",
    slug: "handloom-rug",
    desc: `Handwoven rugs combining traditional weaving methods with contemporary design.

Loom-woven construction featuring distinctive woven textures, subtle ribs, and organic earthy tones.`,
    category: "Handloom Rugs",
    rooms: ["Living Room", "Bedroom", "Dining Room"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    options: ["Wool, Cotton & Natural Fibres", "Textured Ribs"],
    fileName: "handloom-rug.webp",
    order: 3,
  },
  {
    name: "Handmade Upcycled Printed Dhurrie",
    slug: "handmade-upcycled-printed-dhurrie",
    desc: `Handmade dhurries featuring expressive prints and upcycled textile materials.

Flatwoven construction with distinctive printed motifs designed to bring sustainable craftsmanship and vivid character to entryways and living zones.`,
    category: "Handloom Rugs",
    rooms: ["Living Room", "Bedroom", "Hallway & Entryway"],
    sizes: ["4 x 6 ft", "5 x 8 ft", "Custom Size"],
    options: ["Upcycled Textile Fibres", "Artisanal Print"],
    fileName: "Handmade-Upcycled-Printed-Dhurrie.webp",
    order: 4,
  },
  {
    name: "Hand-Tufted Carpets & Rugs",
    slug: "hand-tufted",
    desc: `Custom tufted rugs offering creative freedom in colour, pattern and texture.

Hand-tufted pile with options for carved relief and sculptured loop finishes, backed with reinforced latex.`,
    category: "Hand-Tufted Carpets & Rugs",
    rooms: ["Living Room", "Bedroom", "Office & Study"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    options: ["Wool & Viscose", "Sculpted Relief"],
    fileName: "hand-tufted.webp",
    order: 5,
  },
  {
    name: "Homemonde Polyester Chindi Rugs",
    slug: "homemonde-polyester-chindi",
    desc: `Textured chindi rugs with a casual aesthetic and distinctive textile character.

Textile-based construction featuring mixed-fibre textures woven for everyday durability and relaxed warmth.`,
    category: "Handloom Rugs",
    rooms: ["Living Room", "Bedroom", "Hallway & Entryway"],
    sizes: ["4 x 6 ft", "5 x 8 ft", "Custom Size"],
    options: ["Polyester Chindi", "Mixed Texture"],
    fileName: "HOMEMONDE-Polyester-Chindi.webp",
    order: 6,
  },
  {
    name: "Plush Hand-Tufted Wool Rugs",
    slug: "plush-hand-tufted-wool-rugs",
    desc: `Soft, plush wool rugs designed to bring warmth and tactile comfort to interiors.

Dense tufted pile with a luxurious, soft-touch finish calibrated for master bedrooms and intimate lounge settings.`,
    category: "Hand-Tufted Carpets & Rugs",
    rooms: ["Living Room", "Bedroom"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    options: ["100% Pure Wool", "Plush Cut Pile"],
    fileName: "Plush-Hand-Tufted-&-Wool-Rugs.webp",
    order: 7,
  },
  {
    name: "Power-Loomed Carpets & Rugs",
    slug: "power-loomed",
    desc: `Machine-woven carpets offering consistent patterns and versatile design options.

Power-loomed construction designed for consistent production and finish across large commercial and hospitality projects.`,
    category: "Axminster Carpets & Rugs",
    rooms: ["Living Room", "Dining Room", "Office & Study"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    options: ["Wool & Synthetic Blends", "Commercial Heavy Duty"],
    fileName: "Power-Loomed.webp",
    order: 8,
  },
  {
    name: "Shaggy Hand-Tufted Wool Floral Loop Area Rug",
    slug: "shaggy-expert-hand-tufted-wool-floral-loop-area-rug",
    desc: `Distinctive shaggy wool rugs featuring floral motifs and varied loop textures.

Hand-tufted wool construction with deep textured pile and tactile loop detailing providing acoustic warmth.`,
    category: "Hand-Tufted Carpets & Rugs",
    rooms: ["Living Room", "Bedroom"],
    sizes: ["5 x 8 ft", "6 x 9 ft", "8 x 10 ft", "Custom Size"],
    options: ["Natural Wool", "Dimensional Loop Detailing"],
    fileName: "Shaggy-Expert-Hand-Tufted-Wool-Floral-Loop-Area-Rug.webp",
    order: 9,
  },
];

const uploadImage = async (fileName, publicId) => {
  const filePath = path.join(PRODUCTS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
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
            await cloudinary.uploader.destroy(img.imageId);
          } catch {}
        }
      }
    }
    await Product.deleteMany({});
  }

  console.log(`Seeding all ${allProductsData.length} products to MongoDB...`);
  for (const item of allProductsData) {
    console.log(`Uploading image for "${item.name}" to Cloudinary folder "${CLOUDINARY_FOLDER}"...`);
    const imgData = await uploadImage(item.fileName, `product-${item.slug}`);

    await Product.create({
      name: item.name,
      slug: item.slug,
      desc: item.desc,
      category: item.category,
      rooms: item.rooms,
      sizes: item.sizes,
      options: item.options,
      images: [imgData],
      order: item.order,
      isActive: true,
    });
    console.log(`  ✓ Created product: ${item.name} (${item.category})`);
  }

  console.log("All 10 products seeded successfully!");
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
