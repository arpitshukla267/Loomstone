import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import cloudinary from "../config/cloudinary.js";
import { ClienteleSection, ClientLogo } from "../models/Clientele.js";

const CLIENTS_DIR = path.resolve(__dirname, "../../frontend/public/clients");
const CLOUDINARY_FOLDER = "loomstone";

const sectionData = {
  heading: "Trusted by Industry Leaders.",
  headingHighlight: "Proven by Results.",
  description:
    "From five-star hotel chains to Fortune 500 corporate campuses, Loomstone has delivered bespoke flooring for over 200 projects across India and the Middle East — partnering with the country's most respected architects, designers, and hospitality groups.",
  subheading: "Long-Term Partnerships. Measurable Impact.",
  testimonialsHeading: "Voices of Our Partners",
  testimonials: [
    {
      text: "Loomstone understood our brand language from the very first meeting. The bespoke Axminster carpets they delivered for our Udaipur property set a new benchmark for our entire portfolio. Their attention to colour fidelity and pattern scale was outstanding.",
      name: "Rajiv Menon",
      designation: "VP of Design & Technical Services",
      company: "The Leela Palaces, Hotels and Resorts",
      order: 0,
    },
    {
      text: "We've collaborated with Loomstone on three commercial headquarters projects. They bring a level of technical rigour — fire ratings, acoustic data, lifecycle costing — that most flooring suppliers simply don't offer. A genuine design partner.",
      name: "Sneha Kapoor",
      designation: "Principal Architect",
      company: "Studio Formwork",
      order: 1,
    },
    {
      text: "From initial sampling through to final installation across 400+ rooms, the execution was flawless. Loomstone managed tight timelines without compromising quality — exactly what large-scale hospitality renovations demand.",
      name: "Vikram Singhania",
      designation: "Director of Projects",
      company: "ITC Hotels",
      order: 2,
    },
    {
      text: "Their hand-knotted rugs brought a layer of warmth and identity to our penthouse collection that no other element could. The artisan quality, natural dyes, and custom sizing made each piece feel truly one-of-a-kind.",
      name: "Ananya Mehta",
      designation: "Lead Interior Designer",
      company: "Atelier Living",
      order: 3,
    },
  ],
};

const clientLogosData = [
  { name: "The Leela", fileName: "leela.webp", order: 0 },
  { name: "Marriott International", fileName: "marriott.webp", order: 1 },
  { name: "ITC Hotels", fileName: "itc.png", order: 2 },
  { name: "Hilton Hotels & Resorts", fileName: "hilton.webp", order: 3 },
  { name: "Hyatt Hotels", fileName: "hyatt.png", order: 4 },
  { name: "DLF Limited", fileName: "dlf.webp", order: 5 },
  { name: "FCML India", fileName: "fcml.png", order: 6 },
  { name: "Bharti Airtel", fileName: "airtel.webp", order: 7 },
  { name: "Vodafone", fileName: "vodafone.webp", order: 8 },
  { name: "Fortune Hotels", fileName: "Fortune-Hotel-logo.webp", order: 9 },
];

const uploadLogo = async (fileName, publicId) => {
  const filePath = path.join(CLIENTS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Client logo file not found: ${filePath}`);
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

  // 1. Seed or update Section
  let section = await ClienteleSection.findOne();
  if (!section) {
    section = await ClienteleSection.create(sectionData);
    console.log("✓ Created ClienteleSection document.");
  } else if (force) {
    section.heading = sectionData.heading;
    section.headingHighlight = sectionData.headingHighlight;
    section.description = sectionData.description;
    section.subheading = sectionData.subheading;
    section.testimonialsHeading = sectionData.testimonialsHeading;
    section.testimonials = sectionData.testimonials;
    await section.save();
    console.log("✓ Updated ClienteleSection document.");
  }

  // 2. Seed Client Logos
  const existingLogos = await ClientLogo.find();
  if (existingLogos.length && !force) {
    console.log(
      `${existingLogos.length} client logos already exist in database. Use --force to re-seed.`
    );
    return;
  }

  if (existingLogos.length && force) {
    console.log("--force: Removing existing client logos and Cloudinary files...");
    for (const item of existingLogos) {
      if (item.logoPublicId) {
        try {
          await cloudinary.uploader.destroy(item.logoPublicId);
        } catch {}
      }
    }
    await ClientLogo.deleteMany({});
  }

  console.log(`Seeding ${clientLogosData.length} client logos...`);
  for (const item of clientLogosData) {
    const slugName = item.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const publicId = `client-${slugName}`;
    console.log(`Uploading ${item.fileName} for "${item.name}"...`);
    const { url, publicId: imgId } = await uploadLogo(item.fileName, publicId);

    await ClientLogo.create({
      name: item.name,
      logo: url,
      logoPublicId: imgId,
      order: item.order,
      isActive: true,
    });
    console.log(`  ✓ Created client: ${item.name}`);
  }

  console.log("Clientele page seeded successfully!");
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
