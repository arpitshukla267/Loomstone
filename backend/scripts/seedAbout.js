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
  sectionTitle: "The Mind Behind Loomstone",
  founderName: "Pawan Yadav",
  designation: "Founder & Managing Partner, Loomstone",
  tagline: "Where craftsmanship meets conscience — every floor tells a story.",
  quote:
    "With over 15 years in the luxury hospitality flooring industry, I founded Loomstone to bridge the gap between world-class design and responsible sourcing. We don't just supply floors — we partner with architects and designers to create surfaces that define the character of a space, from five-star hotel lobbies to landmark commercial developments. Every project is a collaboration rooted in precision, trust, and an unwavering commitment to excellence.",
  fileName: "founder.webp",
};

/* ─── Current Data for Process Section ─── */
const processSectionData = {
  heading: "Our Process — Concept to Completion",
  intro:
    "Every Loomstone project follows a proven six-stage journey. We embed ourselves in your design team from day one, ensuring that the flooring solution is not an afterthought but a defining element — delivered on spec, on budget, and on time.",
  steps: [
    {
      title: "Discovery & Design Consultation",
      description:
        "We begin by understanding the project's architectural narrative, functional demands, foot-traffic patterns, and aesthetic goals through in-depth sessions with architects, interior designers, and project owners.",
      fileName: "design-consultation.webp",
      order: 0,
    },
    {
      title: "Bespoke Design Development",
      description:
        "Our design studio translates creative briefs into detailed flooring concepts — custom patterns, colour palettes, material blends, and textures — ensuring every element harmonises with the broader interior vision.",
      fileName: "design-development.webp",
      order: 1,
    },
    {
      title: "Sampling & Prototyping",
      description:
        "Physical samples and prototypes are produced so stakeholders can evaluate materials, colours, and finishes under real lighting and spatial conditions before committing to full production.",
      fileName: "sampling-prototyping.webp",
      order: 2,
    },
    {
      title: "Technical Specification & Budgeting",
      description:
        "We prepare comprehensive technical specifications — covering material performance, fire ratings, acoustic values, and maintenance profiles — aligned with project budgets and regulatory requirements.",
      fileName: "technical-planning.webp",
      order: 3,
    },
    {
      title: "Manufacturing & Quality Control",
      description:
        "Production is managed through our trusted global manufacturing partners with multi-stage quality inspections ensuring consistency in colour, pile height, pattern registration, and dimensional accuracy.",
      fileName: "production-quality.webp",
      order: 4,
    },
    {
      title: "Logistics, Installation & Aftercare",
      description:
        "We coordinate delivery schedules, provide on-site installation guidance with trained fitting teams, and offer post-installation support including maintenance documentation and warranty management.",
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
