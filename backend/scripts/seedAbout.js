import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import cloudinary from "../config/cloudinary.js";
import Founder from "../models/Founder.js";
import ProcessSection from "../models/Process.js";

const FRONTEND_PUBLIC_DIR = path.resolve(__dirname, "../../frontend/public");
const PROCESS_DIR = path.join(FRONTEND_PUBLIC_DIR, "process");
const CLOUDINARY_FOLDER = "loomstone";

/* ─── Current Data for Founder Section ─── */
const founderData = {
  sectionTitle: "Meet Our Visionary",
  founderName: "Pawan Yadav",
  designation: "Managing Partner at Loomstone",
  tagline: "Perfection is the foundation beneath every great space.",
  quote:
    "We believe exceptional hospitality is shaped by thoughtful details. Flooring is more than a surface; it is a defining design element that enhances environments, enriches guest experiences, and contributes to the enduring identity of a space.",
  fileName: "founder.webp",
};

/* ─── Current Data for Process Section ─── */
const processSectionData = {
  heading: "From Vision to Exceptional Spaces",
  intro:
    "At Loomstone, exceptional flooring begins with a clear vision and is realised through meticulous execution. We guide every project from concept to completion, creating floors that elevate the character and identity of a space.",
  steps: [
    {
      title: "Design Consultation",
      description:
        "We work with architects, designers and project teams to understand the vision, technical requirements and practical needs of every space.",
      fileName: "design-consultation.webp",
      order: 0,
    },
    {
      title: "Bespoke Design Development",
      description:
        "From patterns and colours to textures and materials, we develop tailored flooring solutions that complement each project's architectural vision and functional requirements.",
      fileName: "design-development.webp",
      order: 1,
    },
    {
      title: "Sampling & Prototyping",
      description:
        "Detailed samples bring concepts to life, allowing materials, colours and finishes to be reviewed and refined before production.",
      fileName: "sampling-prototyping.webp",
      order: 2,
    },
    {
      title: "Technical Planning & Specification",
      description:
        "We align design intent with material suitability, durability, performance requirements and project budgets to support informed decisions.",
      fileName: "technical-planning.webp",
      order: 3,
    },
    {
      title: "Production & Quality Assurance",
      description:
        "Through careful coordination and quality checks, we focus on consistency, craftsmanship and adherence to agreed project specifications.",
      fileName: "production-quality.webp",
      order: 4,
    },
    {
      title: "Installation & Project Support",
      description:
        "From delivery coordination to installation guidance, we provide project support to help achieve a seamless finish and lasting performance.",
      fileName: "installation-support.webp",
      order: 5,
    },
  ],
};

const uploadFile = async (filePath, publicId) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image file not found: ${filePath}`);
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

  /* ──────────────────────────────────────────────────────────
     1. Seed Founder Section
     ────────────────────────────────────────────────────────── */
  console.log("\n--- Seeding Founder Section ---");
  let founder = await Founder.findOne();

  if (founder && !force) {
    console.log("Founder document already exists. Use --force to re-seed.");
  } else {
    const founderFilePath = path.join(FRONTEND_PUBLIC_DIR, founderData.fileName);
    console.log(`Uploading founder image: ${founderData.fileName}...`);
    const { url, publicId } = await uploadFile(
      founderFilePath,
      "founder-pawan-yadav"
    );

    if (founder && force) {
      founder.sectionTitle = founderData.sectionTitle;
      founder.founderName = founderData.founderName;
      founder.designation = founderData.designation;
      founder.tagline = founderData.tagline;
      founder.quote = founderData.quote;
      founder.image = url;
      founder.imagePublicId = publicId;
      await founder.save();
      console.log("✓ Updated Founder document.");
    } else {
      await Founder.create({
        sectionTitle: founderData.sectionTitle,
        founderName: founderData.founderName,
        designation: founderData.designation,
        tagline: founderData.tagline,
        quote: founderData.quote,
        image: url,
        imagePublicId: publicId,
      });
      console.log("✓ Created Founder document.");
    }
  }

  /* ──────────────────────────────────────────────────────────
     2. Seed Process Section & Steps
     ────────────────────────────────────────────────────────── */
  console.log("\n--- Seeding Process Section ---");
  let processDoc = await ProcessSection.findOne();

  if (processDoc && !force) {
    console.log("Process document already exists. Use --force to re-seed.");
  } else {
    if (!processDoc) {
      processDoc = new ProcessSection();
    }

    processDoc.heading = processSectionData.heading;
    processDoc.intro = processSectionData.intro;

    const uploadedSteps = [];
    for (const step of processSectionData.steps) {
      const stepFilePath = path.join(PROCESS_DIR, step.fileName);
      const publicId = `process-${path.parse(step.fileName).name}`;
      console.log(`Uploading process step image: ${step.fileName}...`);
      const { url, publicId: imgId } = await uploadFile(stepFilePath, publicId);

      uploadedSteps.push({
        title: step.title,
        description: step.description,
        media: url,
        mediaPublicId: imgId,
        order: step.order,
      });
      console.log(`  ✓ Uploaded & added step: ${step.title}`);
    }

    processDoc.steps = uploadedSteps;
    await processDoc.save();
    console.log("✓ Process section with all 6 steps seeded successfully!");
  }

  console.log("\nAbout page seed completed successfully!");
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
