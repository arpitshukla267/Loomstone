import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import WhyLoomstone from "../models/WhyLoomstone.js";

const whyLoomstoneData = {
  heading: "Why India's Leading Architects Choose Loomstone",
  subheading: "Design-Led. Quality-Driven. Partnership-Focused.",
  features: [
    {
      icon: "Layers",
      title: "Complete Flooring Portfolio",
      text: "One partner for every flooring need — Axminster carpets, hand-knotted & hand-tufted rugs, broadloom & carpet tiles, LVT, SPC, and resilient flooring — eliminating multi-vendor complexity.",
      order: 0,
    },
    {
      icon: "Palette",
      title: "Architect-First Design Studio",
      text: "Our in-house design team works shoulder-to-shoulder with architects and interior designers, translating mood boards and material palettes into production-ready flooring concepts.",
      order: 1,
    },
    {
      icon: "Gem",
      title: "Truly Bespoke Manufacturing",
      text: "Custom colourways, pile heights, pattern scales, and yarn blends — every specification is tailored. No minimum order is too small for a flagship project.",
      order: 2,
    },
    {
      icon: "Globe",
      title: "Global Supply, Local Expertise",
      text: "Strategic partnerships with mills in the UK, New Zealand, Belgium, and India ensure world-class raw materials, competitive pricing, and reliable lead times.",
      order: 3,
    },
    {
      icon: "ClipboardCheck",
      title: "Specification & Compliance Rigour",
      text: "Detailed technical data sheets, fire-rating certifications (BS 4790, EN 13501), acoustic performance reports, and VOC compliance — delivered upfront to accelerate approvals.",
      order: 4,
    },
    {
      icon: "Handshake",
      title: "End-to-End Project Ownership",
      text: "From initial consultation through sampling, production, logistics, installation supervision, and post-handover maintenance support — a single accountable team throughout.",
      order: 5,
    },
  ],
};

const seed = async () => {
  const force = process.argv.includes("--force");
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Neither MONGODB_URI nor MONGO_URI is defined");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const existing = await WhyLoomstone.findOne();
  if (existing && !force) {
    console.log(
      "Why Loomstone document already exists in database. Use --force to overwrite."
    );
    return;
  }

  if (existing && force) {
    console.log("--force: Updating existing Why Loomstone document...");
    existing.heading = whyLoomstoneData.heading;
    existing.subheading = whyLoomstoneData.subheading;
    existing.features = whyLoomstoneData.features;
    await existing.save();
    console.log("Why Loomstone updated with 6 cards successfully!");
    return;
  }

  console.log("Creating Why Loomstone document with 6 cards...");
  await WhyLoomstone.create(whyLoomstoneData);
  console.log("Why Loomstone seeded successfully!");
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
