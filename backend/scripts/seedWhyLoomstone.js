import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import WhyLoomstone from "../models/WhyLoomstone.js";

const whyLoomstoneData = {
  heading: "What Sets Loomstone Apart",
  subheading: "Thoughtful Design. Bespoke Craftsmanship. Seamless Execution.",
  features: [
    {
      icon: "Layers",
      title: "Flooring Expertise",
      text: "Axminster carpets & Rugs, Handcrafted carpets & Rugs, Textile flooring, Resilient Flooring",
      order: 0,
    },
    {
      icon: "Palette",
      title: "Design Collaboration",
      text: "Working with architects and designers to translate their creative vision into distinctive flooring concepts.",
      order: 1,
    },
    {
      icon: "Gem",
      title: "Bespoke Flooring Solutions",
      text: "Custom patterns, colours, textures and specifications crafted to bring each project's unique design vision to life.",
      order: 2,
    },
    {
      icon: "Globe",
      title: "Global Manufacturing Partnerships",
      text: "Working with trusted manufacturing partners and specialist suppliers to deliver quality material, consistent standards & Bespoke flooring solutions.",
      order: 3,
    },
    {
      icon: "ClipboardCheck",
      title: "Technical Precision",
      text: "Meticulous attention to specification, accurate measurements, budget consideration and project requirements ensuring flooring solutions that balance design intent, performance and practicality.",
      order: 4,
    },
    {
      icon: "Handshake",
      title: "End to End Project Support",
      text: "Coordinated support from design development to supply and installation, ensuring a seamless product journey from concept to completion.",
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
